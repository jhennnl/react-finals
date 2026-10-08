import type { Order } from "../types";

const styles: Record<Order["status"], string> = {
  Pending: "bg-[#f3d99a] text-[#8a6810]",
  Confirmed: "bg-[#eee5fa] text-[#6243a5]",
  "In Production": "bg-[#e4eee0] text-[#24705c]",
  "Ready for Pickup": "bg-[#f8d9e5] text-[#9b5137]",
  Completed: "bg-[#e3f0e9] text-[#327144]",
  Cancelled: "bg-[#f4d8e4] text-[#9a4747]",
};

export default function StatusBadge({ status }: { status: Order["status"] }) {
  return <span className={`pill ${styles[status]}`}>{status}</span>;
}
