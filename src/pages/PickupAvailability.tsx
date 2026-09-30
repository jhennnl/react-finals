import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { cakes } from "../data";
import { usePageTitle } from "../hooks/usePageTitle";

const days = [
  { date: "2026-10-08", label: "Thu", day: "08", capacity: 10, booked: 8 },
  { date: "2026-10-09", label: "Fri", day: "09", capacity: 10, booked: 10 },
  { date: "2026-10-10", label: "Sat", day: "10", capacity: 10, booked: 5 },
  { date: "2026-10-11", label: "Sun", day: "11", capacity: 8, booked: 3 },
  { date: "2026-10-12", label: "Mon", day: "12", capacity: 10, booked: 2 },
  { date: "2026-10-13", label: "Tue", day: "13", capacity: 10, booked: 6 },
  { date: "2026-10-14", label: "Wed", day: "14", capacity: 10, booked: 4 },
];

export default function PickupAvailability() {
  usePageTitle("Pickup Availability");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const cake = cakes.find((item) => item.id === params.get("cake")) ?? cakes[0];

  const query = useMemo(() => params.toString(), [params]);

  return (
    <section className="py-14">
      <div className="page-shell">
        <div className="max-w-2xl">
          <p className="section-label">PLAN AHEAD</p>
          <h1 className="mt-3 font-display text-5xl">Choose your pickup date.</h1>
          <p className="mt-4 text-[#786a76]">
            We limit the number of cakes prepared each day so your order can be handled properly.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {days.map((item) => {
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
                  active ? "border-[#a99ad9] bg-[#eee9f8] ring-2 ring-[#a99ad9]/10" :
                  available ? "border-[#eadde2] bg-white hover:-translate-y-1" :
                  "cursor-not-allowed border-[#eadde2] bg-[#faf2f5] opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#786a76]">{item.label}</span>
                  <span className="font-display text-3xl">{item.day}</span>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#eadde2]">
                  <div className="h-full rounded-full bg-[#a99ad9]" style={{ width: `${(item.booked / item.capacity) * 100}%` }} />
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
            <p className="text-sm font-bold">Availability rule</p>
            <p className="mt-2 text-sm leading-6 text-[#786a76]">
              Remaining capacity is calculated as daily capacity minus scheduled orders. Fully booked dates cannot be selected.
            </p>
          </div>
          <div className="rounded-[24px] bg-[#e4eee0] p-7">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-[#24705c]">Selected cake</p>
            <h2 className="mt-2 font-display text-2xl">{cake.name}</h2>
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
      </div>
    </section>
  );
}