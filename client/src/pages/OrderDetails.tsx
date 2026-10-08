import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, getApiError } from "../api";
import { useAuth } from "../auth";
import { useCakes } from "../hooks/useCakes";
import type { Order } from "../types";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { usePageTitle } from "../hooks/usePageTitle";
import { useModal } from "../components/Modal";

const steps = ["Pending", "Confirmed", "In Production", "Ready for Pickup", "Completed"] as const;

export default function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const { cakes } = useCakes();
  const { show } = useModal();
  usePageTitle(order ? `Order ${order.id}` : "Order Details");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch((e) => setError(getApiError(e, "We couldn't find this order.")))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="py-20">
        <div className="page-shell">
          <LoadingState />
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="py-20">
        <div className="page-shell soft-card p-10 text-center">
          <h1 className="font-display text-4xl">Order unavailable</h1>
          <div className="mt-4">
            <ErrorState message={error || "Order not found."} />
          </div>
          <Link to="/orders" className="btn-primary mt-6">
            Back to orders
          </Link>
        </div>
      </section>
    );
  }

  const cake = cakes.find((item) => item.id === order.cakeId);
  const currentIndex = steps.indexOf(order.status as (typeof steps)[number]);
  const nextStatus = currentIndex >= 0 && currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
  const isAdmin = user?.role === "admin";

  const cancel = () =>
    show({
      title: "Cancel this order?",
      message:
        "This releases your pickup slot. Online cancellations are available before bakery production starts.",
      confirmLabel: "Cancel order",
      tone: "danger",
      onConfirm: async () => {
        try {
          const { data } = await api.patch(`/orders/${order.id}/cancel`);
          setOrder(data.order);
          show({
            title: "Order cancelled",
            message: "Your pickup slot has been released.",
            confirmLabel: "Done",
          });
        } catch (e) {
          setError(getApiError(e));
        }
      },
    });

  const advanceStatus = () => {
    if (!nextStatus) return;
    show({
      title: `Move to ${nextStatus}?`,
      message: `This uses the studio status workflow (PATCH /orders/:id/status) to advance the order from ${order.status}.`,
      confirmLabel: `Mark ${nextStatus}`,
      onConfirm: async () => {
        setAdvancing(true);
        try {
          const { data } = await api.patch(`/orders/${order.id}/status`, { status: nextStatus });
          setOrder(data.order);
          show({
            title: "Status updated",
            message: `Order is now ${data.order.status}.`,
            confirmLabel: "Done",
          });
        } catch (e) {
          setError(getApiError(e, "Could not update order status."));
        } finally {
          setAdvancing(false);
        }
      },
    });
  };

  return (
    <section className="py-14">
      <div className="page-shell">
        <Link to="/orders" className="text-sm font-bold text-[#8d7bbd]">
          ← Back to orders
        </Link>
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
                    <div
                      className={`mt-1 h-5 w-5 shrink-0 rounded-full border-4 ${
                        complete ? "border-[#a99ad9] bg-[#332532]" : "border-[#dfd3d9] bg-white"
                      }`}
                    />
                    <div>
                      <p className={`text-sm font-bold ${complete ? "text-[#332532]" : "text-[#9b919b]"}`}>
                        {step}
                      </p>
                      {index === currentIndex && (
                        <p className="mt-1 text-xs text-[#786a76]">Current order status</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {order.specialInstructions && (
              <div className="mt-8 rounded-2xl bg-[#fff1f5] p-5">
                <p className="section-label">SPECIAL INSTRUCTIONS</p>
                <p className="mt-2 text-sm">{order.specialInstructions}</p>
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {isAdmin && nextStatus && (
                <button
                  type="button"
                  disabled={advancing}
                  onClick={advanceStatus}
                  className="btn-primary disabled:opacity-60"
                >
                  {advancing ? "Updating…" : `Advance to ${nextStatus}`}
                </button>
              )}
              {["Pending", "Confirmed"].includes(order.status) && (
                <button
                  type="button"
                  onClick={cancel}
                  className="btn-secondary border-[#e4a1ad] text-[#a44255]"
                >
                  Cancel order
                </button>
              )}
            </div>
          </div>
          <aside className="soft-card h-fit overflow-hidden">
            {cake && (
              <img
                src={cake.image}
                alt={order.cakeName}
                className="h-52 w-full object-contain bg-[#f9e3eb] p-5"
              />
            )}
            <div className="p-6">
              <p className="section-label">YOUR CAKE</p>
              <h2 className="mt-2 font-display text-3xl">{order.cakeName}</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#786a76]">Pickup date</span>
                  <strong>{order.pickupDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#786a76]">Total</span>
                  <strong>₱{order.total.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
