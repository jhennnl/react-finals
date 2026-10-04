import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, getApiError } from "../api";
import { useCakes } from "../hooks/useCakes";
import type { Order } from "../types";
import StatusBadge from "../components/StatusBadge";
import SectionHeading from "../components/SectionHeading";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { usePageTitle } from "../hooks/usePageTitle";

const filters = ["All", "Pending", "Confirmed", "In Production", "Ready for Pickup", "Completed", "Cancelled"];

export default function MyOrders() {
  usePageTitle("My Orders");
  const { cakes } = useCakes();
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/me")
      .then(({ data }) => setOrders(data.orders))
      .catch((e) => setError(getApiError(e, "We couldn't load your orders.")))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => orders.filter((order) => filter === "All" || order.status === filter),
    [filter, orders]
  );

  return (
    <section className="py-14">
      <div className="page-shell">
        <SectionHeading
          eyebrow="YOUR CAKE ORDERS"
          title="Keep track of every order."
          description="View your upcoming pickups, current production status, and past orders."
        />
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${
                filter === item ? "bg-[#332532] text-white" : "border border-[#e4d6dd] bg-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-8">
            <LoadingState />
          </div>
        ) : error ? (
          <div className="mt-8">
            <ErrorState message={error} />
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {filtered.length === 0 ? (
              <div className="soft-card p-12 text-center">
                <h2 className="font-display text-3xl">No orders here yet.</h2>
                <p className="mt-2 text-sm text-[#786a76]">Try another filter or create your first cake.</p>
                <Link to="/customize" className="btn-primary mt-6">
                  Create a cake
                </Link>
              </div>
            ) : (
              filtered.map((order) => {
                const cake = cakes.find((item) => item.id === order.cakeId);
                return (
                  <Link
                    key={order.id}
                    to={`/orders/${order.id}`}
                    className="soft-card flex flex-col gap-5 p-5 transition hover:-translate-y-1 sm:flex-row sm:items-center"
                  >
                    {cake && (
                      <img
                        src={cake.image}
                        alt={order.cakeName}
                        className="h-28 w-full rounded-[18px] object-contain bg-[#f9e3eb] p-2 sm:w-32"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-display text-2xl">{order.cakeName}</h2>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="mt-2 text-sm text-[#786a76]">
                        Order #{order.id} · Pickup {order.pickupDate}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs text-[#786a76]">Total</p>
                      <p className="mt-1 text-lg font-bold">₱{order.total.toLocaleString()}</p>
                      <p className="mt-2 text-xs font-bold text-[#8d7bbd]">View details →</p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}
