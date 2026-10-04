import { useEffect, useMemo, useState } from "react";
import { api, getApiError } from "../api";
import type { Order } from "../types";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { usePageTitle } from "../hooks/usePageTitle";

export default function OrderHistory() {
  usePageTitle("Order History");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/me")
      .then(({ data }) => setOrders(data.orders))
      .catch((err) => setError(getApiError(err, "We couldn't load your order history.")))
      .finally(() => setLoading(false));
  }, []);

  const completed = useMemo(() => orders.filter((o) => o.status === "Completed"), [orders]);
  const totalSpent = completed.reduce((sum, o) => sum + o.total, 0);
  const average = completed.length ? Math.round(totalSpent / completed.length) : 0;

  return (
    <section className="py-14">
      <div className="page-shell">
        <p className="section-label">YOUR NUMBERS</p>
        <h1 className="mt-3 font-display text-5xl">Order history.</h1>
        <p className="mt-4 max-w-2xl text-[#786a76]">A summary of your completed cake orders and spending.</p>

        {loading ? (
          <div className="mt-8">
            <LoadingState />
          </div>
        ) : error ? (
          <div className="mt-8">
            <ErrorState message={error} />
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Completed orders", completed.length],
                ["Total spent", `₱${totalSpent.toLocaleString()}`],
                ["Average order", `₱${average.toLocaleString()}`],
                ["All orders", orders.length],
              ].map(([label, value]) => (
                <div key={String(label)} className="soft-card p-6">
                  <p className="text-xs font-bold uppercase tracking-[.12em] text-[#786a76]">{label}</p>
                  <p className="mt-3 font-display text-4xl">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 soft-card p-7">
              <h2 className="font-display text-3xl">Completed orders</h2>
              <div className="mt-6 divide-y divide-[#eadde2]">
                {completed.length ? (
                  completed.map((order) => (
                    <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                      <div>
                        <p className="font-bold">{order.cakeName}</p>
                        <p className="mt-1 text-xs text-[#786a76]">
                          #{order.id} · {order.pickupDate}
                        </p>
                      </div>
                      <p className="font-bold">₱{order.total.toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="py-5 text-sm text-[#786a76]">Completed orders will appear here after pickup.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
