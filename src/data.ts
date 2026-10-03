import type { Cake, Order, Promotion } from "./types";
import { asset } from "./assets";

export const cakes: Cake[] = [
  { id: "strawberry-cloud", name: "Strawberry Cloud", description: "Strawberry sponge, whipped cream, and a soft pink finish.", basePrice: 780, category: "Fruity", popular: true, image: asset("strawberry-cloud.png"), imageFile: "strawberry-cloud.png", tone: "pink" },
  { id: "vanilla-dream", name: "Vanilla Dream", description: "Classic vanilla layers with a clean, elegant finish.", basePrice: 650, category: "Classic", popular: true, image: asset("vanilla-dream.png"), imageFile: "vanilla-dream.png", tone: "yellow" },
  { id: "matcha-bloom", name: "Matcha Bloom", description: "Soft matcha sponge with creamy layers and a fresh pastel finish.", basePrice: 800, category: "Specialty", popular: true, image: asset("matcha-bloom.png"), imageFile: "matcha-bloom.png", tone: "green" },
  { id: "choco-velvet", name: "Chocolate Velvet", description: "Rich chocolate layers with smooth chocolate cream.", basePrice: 750, category: "Chocolate", popular: true, image: asset("choco-velvet.png"), imageFile: "choco-velvet.png", tone: "lilac" },
  { id: "blueberry-milk", name: "Blueberry Milk", description: "Creamy blueberry layers with a delicate pastel finish.", basePrice: 820, category: "Fruity", image: asset("blueberry-milk.png"), imageFile: "blueberry-milk.png", tone: "blue" },
  { id: "birthday-pop", name: "Birthday Pop", description: "A colorful celebration cake designed for birthdays and milestones.", basePrice: 900, category: "Celebration", popular: true, image: asset("birthday-pop.png"), imageFile: "birthday-pop.png", tone: "pink" },
  { id: "lemon-cloud", name: "Lemon Cloud", description: "Bright lemon sponge with a light citrus cream filling.", basePrice: 760, category: "Fruity", image: asset("lemon-cloud.png"), imageFile: "lemon-cloud.png", tone: "yellow" },
  { id: "ube-milk", name: "Ube Milk", description: "A Filipino-inspired ube cake with soft milk cream.", basePrice: 820, category: "Specialty", popular: true, image: asset("ube-milk.png"), imageFile: "ube-milk.png", tone: "lilac" },
  { id: "red-velvet", name: "Red Velvet Kiss", description: "Velvety red cake with smooth cream cheese layers.", basePrice: 850, category: "Classic", image: asset("red-velvet.png"), imageFile: "red-velvet.png", tone: "rose" },
  { id: "caramel-nude", name: "Caramel Nude", description: "Vanilla cake layered with salted caramel and a warm nude finish.", basePrice: 880, category: "Classic", image: asset("caramel-nude.png"), imageFile: "caramel-nude.png", tone: "yellow" },
  { id: "peach-blush", name: "Peach Blush", description: "Peach sponge with fruit cream and a soft blush palette.", basePrice: 840, category: "Fruity", image: asset("peach-blush.png"), imageFile: "peach-blush.png", tone: "pink" },
  { id: "cookies-cream", name: "Cookies & Cream", description: "Chocolate cookie crumbs, vanilla cream, and a playful finish.", basePrice: 790, category: "Chocolate", image: asset("cookies-cream.png"), imageFile: "cookies-cream.png", tone: "lilac" },
  { id: "strawberry-shortcake", name: "Strawberry Shortcake", description: "Fresh strawberry layers with vanilla cream and soft sponge.", basePrice: 860, category: "Fruity", image: asset("strawberry-shortcake.png"), imageFile: "strawberry-shortcake.png", tone: "pink" },
  { id: "midnight-chocolate", name: "Midnight Chocolate", description: "Deep chocolate cake with glossy ganache and chocolate cream.", basePrice: 920, category: "Chocolate", image: asset("midnight-chocolate.png"), imageFile: "midnight-chocolate.png", tone: "blue" },
  { id: "garden-party", name: "Garden Party", description: "A floral-inspired cake made for elegant celebrations.", basePrice: 980, category: "Celebration", image: asset("garden-party.png"), imageFile: "garden-party.png", tone: "green" },
  { id: "retro-cherry", name: "Retro Cherry", description: "A playful vintage-style cake with cherry-inspired details.", basePrice: 950, category: "Y2K", popular: true, image: asset("retro-cherry.png"), imageFile: "retro-cherry.png", tone: "rose" },
  { id: "pink-heart", name: "Pink Heart", description: "A soft heart-shaped celebration cake with strawberry cream.", basePrice: 890, category: "Y2K", image: asset("pink-heart.png"), imageFile: "pink-heart.png", tone: "pink" },
  { id: "dreamy-ribbon", name: "Dreamy Ribbon", description: "A pastel ribbon cake with vanilla cream and delicate decorations.", basePrice: 990, category: "Y2K", popular: true, image: asset("dreamy-ribbon.png"), imageFile: "dreamy-ribbon.png", tone: "lilac" },
  { id: "mango-sunset", name: "Mango Sunset", description: "Vanilla sponge layered with mango cream and fresh mango slices.", basePrice: 850, category: "Fruity", image: asset("mango-sunset.png"), imageFile: "mango-sunset.png", tone: "yellow" },
  { id: "tiramisu-bliss", name: "Tiramisu Bliss", description: "Coffee-soaked sponge with mascarpone cream and cocoa.", basePrice: 920, category: "Specialty", image: asset("tiramisu-bliss.png"), imageFile: "tiramisu-bliss.png", tone: "lilac" },
  { id: "lotus-biscoff", name: "Lotus Biscoff", description: "Vanilla cake with cookie butter filling and crunchy biscuit topping.", basePrice: 980, category: "Specialty", image: asset("lotus-biscoff.png"), imageFile: "lotus-biscoff.png", tone: "yellow" },
  { id: "black-forest", name: "Black Forest", description: "Chocolate sponge with whipped cream, cherries, and chocolate shavings.", basePrice: 950, category: "Chocolate", image: asset("black-forest.png"), imageFile: "black-forest.png", tone: "rose" },
  { id: "mango-cheesecake", name: "Mango Cheesecake", description: "Creamy cheesecake with mango topping and a biscuit crust.", basePrice: 890, category: "Fruity", image: asset("mango-cheesecake.png"), imageFile: "mango-cheesecake.png", tone: "yellow" },
  { id: "pistachio-dream", name: "Pistachio Dream", description: "Soft sponge with pistachio cream and crushed pistachios.", basePrice: 1050, category: "Specialty", image: asset("pistachio-dream.png"), imageFile: "pistachio-dream.png", tone: "green" },
  { id: "mocha-mousse", name: "Mocha Mousse", description: "Chocolate sponge layered with coffee mousse and chocolate glaze.", basePrice: 880, category: "Chocolate", image: asset("mocha-mousse.png"), imageFile: "mocha-mousse.png", tone: "lilac" },
  { id: "choco-hazelnut", name: "Chocolate Hazelnut", description: "Chocolate sponge with hazelnut cream and smooth ganache.", basePrice: 990, category: "Chocolate", image: asset("choco-hazelnut.png"), imageFile: "choco-hazelnut.png", tone: "blue" },
  { id: "cookies-caramel", name: "Cookie Caramel", description: "Vanilla cake with cookie pieces and salted caramel cream.", basePrice: 920, category: "Specialty", image: asset("cookies-caramel.png"), imageFile: "cookies-caramel.png", tone: "yellow" },
  { id: "raspberry-rose", name: "Raspberry Rose", description: "Light vanilla sponge with raspberry filling and rose cream.", basePrice: 940, category: "Fruity", image: asset("raspberry-rose.png"), imageFile: "raspberry-rose.png", tone: "rose" },
  { id: "lemon-blueberry", name: "Lemon Blueberry", description: "Lemon sponge with blueberry filling and whipped cream.", basePrice: 900, category: "Fruity", image: asset("lemon-blueberry.png"), imageFile: "lemon-blueberry.png", tone: "blue" },
  { id: "carrot-walnut", name: "Carrot Walnut", description: "Spiced carrot cake with cream cheese frosting and walnuts.", basePrice: 870, category: "Classic", image: asset("carrot-walnut.png"), imageFile: "carrot-walnut.png", tone: "yellow" },
  { id: "chocolate-fudge", name: "Chocolate Fudge", description: "Rich chocolate cake with thick fudge filling and ganache.", basePrice: 950, category: "Chocolate", image: asset("chocolate-fudge.png"), imageFile: "chocolate-fudge.png", tone: "lilac" },
  { id: "peaches-cream", name: "Peaches and Cream", description: "Vanilla sponge with peach pieces and smooth cream.", basePrice: 860, category: "Fruity", image: asset("peaches-cream.png"), imageFile: "peaches-cream.png", tone: "pink" },
  { id: "coffee-caramel", name: "Coffee Caramel", description: "Coffee-flavored sponge with caramel cream and a glossy finish.", basePrice: 910, category: "Specialty", image: asset("coffee-caramel.png"), imageFile: "coffee-caramel.png", tone: "yellow" },
  { id: "blueberry-cheesecake", name: "Blueberry Cheesecake", description: "Creamy cheesecake topped with blueberry compote.", basePrice: 920, category: "Fruity", image: asset("blueberry-cheesecake.png"), imageFile: "blueberry-cheesecake.png", tone: "blue" },
  { id: "rainbow-party", name: "Rainbow Party", description: "Colorful vanilla layers with light buttercream frosting.", basePrice: 980, category: "Celebration", image: asset("rainbow-party.png"), imageFile: "rainbow-party.png", tone: "pink" },
  { id: "cherry-chocolate", name: "Cherry Chocolate", description: "Chocolate layers with cherry filling and chocolate cream.", basePrice: 960, category: "Chocolate", image: asset("cherry-chocolate.png"), imageFile: "cherry-chocolate.png", tone: "rose" },
  { id: "ube-cheese", name: "Ube Cheese", description: "Ube sponge with creamy cheese filling and soft frosting.", basePrice: 890, category: "Specialty", image: asset("ube-cheese.png"), imageFile: "ube-cheese.png", tone: "lilac" },
  { id: "vanilla-strawberry", name: "Vanilla Strawberry", description: "Classic vanilla sponge layered with strawberry cream.", basePrice: 850, category: "Fruity", image: asset("vanilla-strawberry.png"), imageFile: "vanilla-strawberry.png", tone: "pink" },
];

export const sizes = [
  { name: "4-inch mini", price: 480 },
  { name: "6-inch", price: 650 },
  { name: "8-inch", price: 850 },
  { name: "10-inch", price: 1100 },
  { name: "12-inch", price: 1450 },
  { name: "14-inch party", price: 1850 },
];

export const flavors = [
  { name: "Vanilla", price: 0 },
  { name: "Chocolate", price: 100 },
  { name: "Red Velvet", price: 150 },
  { name: "Matcha", price: 150 },
  { name: "Strawberry", price: 130 },
  { name: "Ube", price: 140 },
  { name: "Cookies & Cream", price: 160 },
  { name: "Lemon", price: 120 },
];

export const fillings = [
  { name: "None", price: 0 },
  { name: "Vanilla Cream", price: 50 },
  { name: "Chocolate", price: 80 },
  { name: "Strawberry", price: 120 },
  { name: "Salted Caramel", price: 120 },
  { name: "Cream Cheese", price: 140 },
  { name: "Ube Cream", price: 130 },
  { name: "Mango Cream", price: 140 },
  { name: "Blueberry Cream", price: 140 },
];

export const designs = [
  { name: "Minimalist", price: 100 },
  { name: "Floral", price: 250 },
  { name: "Vintage", price: 300 },
  { name: "Character", price: 350 },
  { name: "Y2K Pastel", price: 280 },
  { name: "Heart Ribbon", price: 320 },
  { name: "Lambeth Piping", price: 380 },
  { name: "Korean Minimal", price: 220 },
  { name: "Photo Style", price: 300 },
];

export const addOns = [
  { name: "Cake Topper", price: 100 },
  { name: "Custom Message", price: 50 },
  { name: "Extra Decorations", price: 150 },
  { name: "Mini Candle Set", price: 80 },
  { name: "Fresh Flowers", price: 220 },
  { name: "Chocolate Plaque", price: 120 },
  { name: "Ribbon Finish", price: 90 },
  { name: "Mini Cupcake Set", price: 260 },
  { name: "Cake Knife Set", price: 60 },
];

export const occasions = ["Birthday", "Graduation", "Anniversary", "Baby Shower", "Bridal Shower", "Thank You", "Corporate", "Just Because"];

export const promotions: Promotion[] = [
  { id: "welcome10", code: "WELCOME10", title: "A little welcome treat", description: "Get 10% off your first custom cake order.", type: "percent", value: 10, minimum: 800, label: "10% OFF", active: true },
  { id: "sweet150", code: "SWEET150", title: "Sweet savings", description: "Save ₱150 when your cake subtotal reaches ₱1,500.", type: "fixed", value: 150, minimum: 1500, label: "₱150 OFF", active: true },
  { id: "y2k15", code: "Y2K15", title: "Pastel weekend", description: "Enjoy 15% off selected Y2K designs during the promotional period.", type: "percent", value: 15, minimum: 1000, label: "15% OFF", active: true },
  { id: "birthday200", code: "BIRTHDAY200", title: "Birthday bonus", description: "Save ₱200 on birthday orders worth ₱1,800 or more.", type: "fixed", value: 200, minimum: 1800, label: "₱200 OFF", active: true },
];

export const sampleOrders: Order[] = [
  { id: "CC-1028", cakeName: "Chocolate Velvet", pickupDate: "2026-10-08", total: 1470, status: "In Production", image: cakes[3].image },
  { id: "CC-1014", cakeName: "Vanilla Dream", pickupDate: "2026-09-20", total: 980, status: "Completed", image: cakes[1].image },
  { id: "CC-0998", cakeName: "Strawberry Cloud", pickupDate: "2026-09-05", total: 1260, status: "Completed", image: cakes[0].image },
  { id: "CC-0982", cakeName: "Matcha Bloom", pickupDate: "2026-08-22", total: 1120, status: "Completed", image: cakes[2].image },
];
