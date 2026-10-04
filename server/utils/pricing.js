export const sizePrices = {
  "4-inch mini": 480,
  "6-inch": 650,
  "8-inch": 850,
  "10-inch": 1100,
  "12-inch": 1450,
  "14-inch party": 1850,
};

export const flavorPrices = {
  Vanilla: 0,
  Chocolate: 100,
  "Red Velvet": 150,
  Matcha: 150,
  Strawberry: 130,
  Ube: 140,
  "Cookies & Cream": 160,
  Lemon: 120,
};

export const fillingPrices = {
  None: 0,
  "Vanilla Cream": 50,
  Chocolate: 80,
  Strawberry: 120,
  "Salted Caramel": 120,
  "Cream Cheese": 140,
  "Ube Cream": 130,
  "Mango Cream": 140,
  "Blueberry Cream": 140,
};

export const designPrices = {
  Minimalist: 100,
  Floral: 250,
  Vintage: 300,
  Character: 350,
  "Y2K Pastel": 280,
  "Heart Ribbon": 320,
  "Lambeth Piping": 380,
  "Korean Minimal": 220,
  "Photo Style": 300,
};

export const addOnPrices = {
  "Cake Topper": 100,
  "Custom Message": 50,
  "Extra Decorations": 150,
  "Mini Candle Set": 80,
  "Fresh Flowers": 220,
  "Chocolate Plaque": 120,
  "Ribbon Finish": 90,
  "Mini Cupcake Set": 260,
  "Cake Knife Set": 60,
};

export function optionFrom(group, name) {
  if (typeof name !== "string" || !(name in group)) {
    const error = new Error("One of your cake choices is unavailable.");
    error.status = 400;
    throw error;
  }
  return { name, price: group[name] };
}

export function calculateQuote({ cake, size, flavor, filling, design, addOns = [], promo }) {
  let subtotal = cake.basePrice;
  const sizeOpt = optionFrom(sizePrices, size);
  const flavorOpt = optionFrom(flavorPrices, flavor);
  const fillingOpt = optionFrom(fillingPrices, filling);
  const designOpt = optionFrom(designPrices, design);
  subtotal += sizeOpt.price + flavorOpt.price + fillingOpt.price + designOpt.price;

  const addOnOpts = [];
  for (const addOn of addOns) {
    const opt = optionFrom(addOnPrices, addOn);
    addOnOpts.push(opt);
    subtotal += opt.price;
  }

  let discount = 0;
  let promoCode = "";
  if (promo && promo.active) {
    const expired = promo.expiresAt && new Date(promo.expiresAt) < new Date();
    if (!expired && subtotal >= promo.minimum) {
      discount =
        promo.type === "percent"
          ? Math.round((subtotal * promo.value) / 100)
          : promo.value;
      promoCode = promo.code;
    }
  }

  return {
    size: sizeOpt,
    flavor: flavorOpt,
    filling: fillingOpt,
    design: designOpt,
    addOns: addOnOpts,
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    promoCode,
  };
}

export function dailyPickupSlots(orders, days = 7) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() + index + 2);
    const value = date.toISOString().slice(0, 10);
    const capacity = date.getDay() === 0 ? 8 : 10;
    const booked = orders.filter(
      (order) => order.pickupDate === value && order.status !== "Cancelled"
    ).length;
    return {
      date: value,
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      day: value.slice(-2),
      capacity,
      booked,
      available: Math.max(0, capacity - booked),
      full: booked >= capacity,
    };
  });
}

export const STATUS_FLOW = [
  "Pending",
  "Confirmed",
  "In Production",
  "Ready for Pickup",
  "Completed",
];

export function canTransition(from, to) {
  if (to === "Cancelled") {
    return ["Pending", "Confirmed"].includes(from);
  }
  const fromIndex = STATUS_FLOW.indexOf(from);
  const toIndex = STATUS_FLOW.indexOf(to);
  return fromIndex !== -1 && toIndex === fromIndex + 1;
}
