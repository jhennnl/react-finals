import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getApiError } from "../api";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { usePageTitle } from "../hooks/usePageTitle";

type Overview = {
  totals: {
    cakes: number;
    customers: number;
    orders: number;
    activePromotions: number;
    reviews: number;
  };
  revenue: number;
  pendingOrders: number;
  lowStockCakes: number;
  averageRating: number;
  nextFullyBookedDate: string | null;
  pickupPressure: { date: string; utilization: number }[];
};

type CakeStats = {
  totalCakes: number;
  activeCount: number;
  totalStock: number;
  averageBasePrice: number;
  byCategory: Record<string, number>;
};

type OrderStats = {
  revenue: number;
  averageOrderValue: number;
  byStatus: Record<string, number>;
  discountGiven: number;
};

function isOverview(value: unknown): value is Overview {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<Overview>;
  return (
    typeof data.revenue === "number" &&
    typeof data.pendingOrders === "number" &&
    typeof data.lowStockCakes === "number" &&
    Array.isArray(data.pickupPressure)
  );
}

function isCakeStats(value: unknown): value is CakeStats {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<CakeStats>;
  return (
    typeof data.totalCakes === "number" &&
    typeof data.activeCount === "number" &&
    typeof data.totalStock === "number" &&
    typeof data.averageBasePrice === "number" &&
    !!data.byCategory &&
    typeof data.byCategory === "object"
  );
}

function isOrderStats(value: unknown): value is OrderStats {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<OrderStats>;
  return (
    typeof data.averageOrderValue === "number" &&
    typeof data.discountGiven === "number" &&
    !!data.byStatus &&
    typeof data.byStatus === "object"
  );
}

export default function Dashboard() {
  usePageTitle("Studio Dashboard");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [cakeStats, setCakeStats] = useState<CakeStats | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    (async () => {
      try {
        const [overviewRes, cakeRes, orderRes] = await Promise.all([
          api.get("/dashboard/overview", { signal: controller.signal }),
          api.get("/cakes/stats/summary", { signal: controller.signal }),
          api.get("/orders/stats/summary", { signal: controller.signal }),
        ]);

        if (!active) return;

        if (!isOverview(overviewRes.data) || !isCakeStats(cakeRes.data) || !isOrderStats(orderRes.data)) {
          setError("Could not load dashboard metrics.");
          return;
        }

        setOverview(overviewRes.data);
        setCakeStats(cakeRes.data);
        setOrderStats(orderRes.data);
        setError("");
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        setError(getApiError(err, "Could not load dashboard metrics."));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return (
    <section className="py-14">
      <div className="page-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label">DATA PROCESSING</p>
            <h1 className="mt-3 font-display text-5xl">Studio dashboard.</h1>
            <p className="mt-4 max-w-2xl text-[#786a76]">
              Live totals, stock pressure, order status distribution, and pickup utilization from the API.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/manage/cakes" className="btn-secondary">
              Manage menu
            </Link>
            <Link to="/manage/promotions" className="btn-secondary">
              Manage promos
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-10">
            <LoadingState />
          </div>
        ) : error ? (
          <div className="mt-10">
            <ErrorState message={error} />
          </div>
        ) : overview && cakeStats && orderStats ? (
          <>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Revenue", `₱${Number(overview.revenue).toLocaleString()}`],
                ["Pending orders", overview.pendingOrders],
                ["Low stock cakes", overview.lowStockCakes],
                ["Avg rating", overview.averageRating || "—"],
              ].map(([label, value]) => (
                <div key={String(label)} className="soft-card p-6">
                  <p className="text-xs font-bold uppercase tracking-[.12em] text-[#786a76]">{label}</p>
                  <p className="mt-3 font-display text-4xl">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="soft-card p-7">
                <h2 className="font-display text-3xl">Catalog snapshot</h2>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#786a76]">Active cakes</span>
                    <strong>
                      {cakeStats.activeCount}/{cakeStats.totalCakes}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786a76]">Total stock units</span>
                    <strong>{cakeStats.totalStock}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786a76]">Average base price</span>
                    <strong>₱{Number(cakeStats.averageBasePrice).toLocaleString()}</strong>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {Object.entries(cakeStats.byCategory).map(([category, count]) => (
                    <span key={category} className="rounded-full bg-[#fff1f5] px-3 py-1 text-xs font-bold">
                      {category}: {count}
                    </span>
                  ))}
                </div>
              </div>

              <div className="soft-card p-7">
                <h2 className="font-display text-3xl">Order health</h2>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#786a76]">Average completed order</span>
                    <strong>₱{Number(orderStats.averageOrderValue).toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786a76]">Discounts given</span>
                    <strong>₱{Number(orderStats.discountGiven).toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#786a76]">Next fully booked day</span>
                    <strong>{overview.nextFullyBookedDate || "None soon"}</strong>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  {Object.entries(orderStats.byStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-sm">
                      <span className="text-[#786a76]">{status}</span>
                      <strong>{count}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="soft-card mt-8 p-7">
              <h2 className="font-display text-3xl">Pickup utilization</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {overview.pickupPressure.map((slot) => (
                  <div key={slot.date} className="rounded-2xl bg-[#fff8f5] p-4">
                    <p className="text-xs font-bold text-[#786a76]">{slot.date}</p>
                    <p className="mt-2 font-display text-3xl">{slot.utilization}%</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eadde2]">
                      <div
                        className="h-full rounded-full bg-[#a99ad9]"
                        style={{ width: `${Math.min(100, Number(slot.utilization) || 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-10">
            <ErrorState message="Could not load dashboard metrics." />
          </div>
        )}
      </div>
    </section>
  );
}
