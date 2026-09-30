import { sampleOrders } from "../data";
import { usePageTitle } from "../hooks/usePageTitle";

export default function OrderHistory() {
  usePageTitle("Order History");
  const completed = sampleOrders.filter((order) => order.status === "Completed");
  const totalSpent = completed.reduce((sum, order) => sum + order.total, 0);
  const average = completed.length ? Math.round(totalSpent / completed.length) : 0;

  return (
    <section className="py-14">
      <div className="page-shell">
        <p className="section-label">YOUR NUMBERS</p>
        <h1 className="mt-3 font-display text-5xl">Order history.</h1>
        <p className="mt-4 max-w-2xl text-[#786a76]">A simple summary of your completed cake orders and spending.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Completed orders", completed.length],
            ["Total spent", `₱${totalSpent.toLocaleString()}`],
            ["Average order", `₱${average.toLocaleString()}`],
            ["All orders", sampleOrders.length],
          ].map(([label, value]) => (
            <div key={label} className="soft-card p-6">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-[#786a76]">{label}</p>
              <p className="mt-3 font-display text-4xl">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 soft-card p-7">
          <h2 className="font-display text-3xl">Completed orders</h2>
          <div className="mt-6 divide-y divide-[#eadde2]">
            {completed.map((order) => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-bold">{order.cakeName}</p>
                  <p className="mt-1 text-xs text-[#786a76]">#{order.id} · {order.pickupDate}</p>
                </div>
                <p className="font-bold">₱{order.total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}