import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api, getApiError } from "../api";
import { useCakes } from "../hooks/useCakes";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { usePageTitle } from "../hooks/usePageTitle";

type Slot = {
  date: string;
  label: string;
  day: string;
  capacity: number;
  booked: number;
};

export default function PickupAvailability() {
  usePageTitle("Pickup Availability");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { cakes } = useCakes();
  const [selected, setSelected] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const cake = cakes.find((item) => item.id === params.get("cake")) ?? cakes[0];
  const query = useMemo(() => params.toString(), [params]);

  useEffect(() => {
    api
      .get("/pickup-slots")
      .then(({ data }) => setSlots(data.slots))
      .catch((e) => setError(getApiError(e, "We couldn't load pickup availability.")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-14">
      <div className="page-shell">
        <div className="max-w-2xl">
          <p className="section-label">PLAN AHEAD</p>
          <h1 className="mt-3 font-display text-5xl">Choose your pickup date.</h1>
          <p className="mt-4 text-[#786a76]">
            Availability updates from the shop as orders are placed, so we never overbook a production day.
          </p>
        </div>

        {loading ? (
          <div className="mt-10">
            <LoadingState />
          </div>
        ) : error ? (
          <div className="mt-10">
            <ErrorState message={error} />
          </div>
        ) : slots.length === 0 ? (
          <div className="soft-card mt-10 p-12 text-center">
            <h2 className="font-display text-3xl">No pickup slots available.</h2>
            <p className="mt-2 text-sm text-[#786a76]">Please check back later for new production dates.</p>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {slots.map((item) => {
                const remaining = item.capacity - item.booked;
                const available = remaining > 0;
                const active = selected === item.date;
                return (
                  <button
                    type="button"
                    key={item.date}
                    disabled={!available}
                    onClick={() => setSelected(item.date)}
                    className={`rounded-[22px] border p-5 text-left transition ${
                      active
                        ? "border-[#a99ad9] bg-[#eee9f8] ring-2 ring-[#a99ad9]/10"
                        : available
                          ? "border-[#eadde2] bg-white hover:-translate-y-1"
                          : "cursor-not-allowed border-[#eadde2] bg-[#faf2f5] opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#786a76]">{item.label}</span>
                      <span className="font-display text-3xl">{item.day}</span>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#eadde2]">
                      <div
                        className="h-full rounded-full bg-[#a99ad9]"
                        style={{ width: `${(item.booked / item.capacity) * 100}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs font-bold">
                      {available ? `${remaining} slots remaining` : "Fully booked"}
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-[1fr_360px]">
              <div className="soft-card p-7">
                <p className="text-sm font-bold">Fresh availability</p>
                <p className="mt-2 text-sm leading-6 text-[#786a76]">
                  The final availability check happens again when you place the order, ensuring every confirmed
                  order has a real production slot.
                </p>
              </div>
              <div className="rounded-[24px] bg-[#e4eee0] p-7">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#24705c]">Selected cake</p>
                <h2 className="mt-2 font-display text-2xl">{cake?.name ?? "Loading…"}</h2>
                <p className="mt-2 text-sm text-[#49675f]">
                  {selected ? `Pickup: ${selected}` : "Select an available date to continue."}
                </p>
                <button
                  disabled={!selected}
                  onClick={() => navigate(`/summary?${query}&pickupDate=${selected}`)}
                  className="mt-6 w-full rounded-full bg-[#332532] px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Review order →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
