import { Link, useParams } from "react-router-dom";
import { sampleOrders } from "../data";
import StatusBadge from "../components/StatusBadge";
import { usePageTitle } from "../hooks/usePageTitle";

const steps = ["Pending", "Confirmed", "In Production", "Ready for Pickup", "Completed"];

export default function OrderDetails() {
  const { id } = useParams();
  const order = sampleOrders.find((item) => item.id === id) ?? sampleOrders[0];
  usePageTitle(`Order ${order.id}`);

  const currentIndex = steps.indexOf(order.status);

  return (
    <section className="py-14">
      <div className="page-shell">
        <Link to="/orders" className="text-sm font-bold text-[#8d7bbd]">← Back to orders</Link>

        <div className="mt-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-label">ORDER DETAILS</p>
            <h1 className="mt-2 font-display text-5xl">#{order.id}</h1>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="mt-10 grid gap-7 lg:grid-cols-[1fr_360px]">
          <div className="soft-card p-7">
            <h2 className="font-display text-3xl">Order progress</h2>
            <div className="mt-8 space-y-6">
              {steps.map((step, index) => {
                const complete = currentIndex >= index;
                return (
                  <div key={step} className="flex gap-4">
                    <div className={`mt-1 h-5 w-5 shrink-0 rounded-full border-4 ${complete ? "border-[#a99ad9] bg-[#332532]" : "border-[#dfd3d9] bg-white"}`} />
                    <div>
                      <p className={`text-sm font-bold ${complete ? "text-[#332532]" : "text-[#9b919b]"}`}>{step}</p>
                      {index === currentIndex && <p className="mt-1 text-xs text-[#786a76]">Current order status</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="soft-card h-fit overflow-hidden">
            <img src={order.image} alt={order.cakeName} className="h-52 w-full object-cover" />
            <div className="p-6">
              <p className="section-label">YOUR CAKE</p>
              <h2 className="mt-2 font-display text-3xl">{order.cakeName}</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[#786a76]">Pickup date</span><strong>{order.pickupDate}</strong></div>
                <div className="flex justify-between"><span className="text-[#786a76]">Total</span><strong>₱{order.total.toLocaleString()}</strong></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}