import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, getApiError } from "../api";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { usePageTitle } from "../hooks/usePageTitle";

type Order = { id: string; status: string; total: number; pickupDate: string };

export default function Confirmation() {
  usePageTitle("Order Confirmation");
  const [params] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = params.get("order");
    if (!id) {
      setError("Missing order number.");
      setLoading(false);
      return;
    }
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch((err) => setError(getApiError(err, "We couldn't load this confirmation.")))
      .finally(() => setLoading(false));
  }, [params]);

  return (
    <section className="py-20">
      <div className="page-shell max-w-2xl">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="soft-card p-10 text-center">
            <ErrorState message={error} />
            <Link to="/orders" className="btn-primary mt-6 inline-flex">
              View my orders
            </Link>
          </div>
        ) : (
          <div className="rounded-[30px] bg-[#e4eee0] p-8 text-center md:p-12">
            <p className="section-label">ORDER RECEIVED</p>
            <h1 className="mt-4 font-display text-5xl">Your cake is on its way.</h1>
            <p className="mx-auto mt-5 max-w-lg leading-7 text-[#49675f]">
              Your order has been submitted and is now waiting for bakery confirmation.
            </p>
            <div className="mx-auto mt-9 max-w-md rounded-[22px] bg-white p-6 text-left shadow-sm">
              <div className="flex justify-between border-b border-[#eadde2] pb-4">
                <span className="text-sm text-[#786a76]">Order number</span>
                <strong>{order?.id}</strong>
              </div>
              <div className="flex justify-between py-4">
                <span className="text-sm text-[#786a76]">Status</span>
                <span className="pill bg-[#f3d99a] text-[#8a6810]">{order?.status ?? "Pending"}</span>
              </div>
              <div className="flex justify-between border-t border-[#eadde2] pt-4">
                <span className="text-sm text-[#786a76]">Pickup date</span>
                <strong>{order?.pickupDate ?? "—"}</strong>
              </div>
              <div className="mt-4 flex justify-between border-t border-[#eadde2] pt-4">
                <span className="text-sm text-[#786a76]">Confirmed total</span>
                <strong>{order ? `₱${order.total.toLocaleString()}` : "—"}</strong>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/orders" className="btn-primary">
                View my orders
              </Link>
              <Link to="/cakes" className="btn-secondary">
                Browse more cakes
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
