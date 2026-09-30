export type CakeTone = "pink" | "yellow" | "green" | "lilac" | "blue" | "rose";

export type Cake = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  imageFile?: string;
  category: string;
  tone?: CakeTone;
  popular?: boolean;
};

export type CakeOption = { name: string; price: number };

export type Promotion = {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "percent" | "fixed";
  value: number;
  minimum: number;
  label: string;
  active: boolean;
};

export type CakeConfiguration = {
  cakeId: string;
  size: CakeOption;
  flavor: CakeOption;
  filling: CakeOption;
  design: CakeOption;
  addOns: CakeOption[];
  pickupDate: string;
  specialInstructions?: string;
};

export type Order = {
  id: string;
  cakeName: string;
  pickupDate: string;
  total: number;
  status: "Pending" | "Confirmed" | "In Production" | "Ready for Pickup" | "Completed" | "Cancelled";
  image: string;
};
