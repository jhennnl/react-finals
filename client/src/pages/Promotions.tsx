import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Promotion } from "../types";
import { api, getApiError } from "../api";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Promotions() {
  usePageTitle("Promotions");
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/promotions?active=true")
      .then(({ data }) => setPromotions(data.promotions))
      .catch((err) => setError(getApiError(err, "Could not load promotions.")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-14 md:py-20">
      <div className="page-shell">
        <div className="pastel-panel-pink rounded-[32px] p-8 md:p-12">
          <p className="section-label">SWEET SAVINGS</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl md:text-6xl">
            Promotions made for little celebrations.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#725d69]">
            Apply an eligible code during customization. The system checks the minimum subtotal and calculates the
            discount automatically.
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
        ) : promotions.length === 0 ? (
          <div className="soft-card mt-10 p-12 text-center">
            <h2 className="font-display text-3xl">No active promotions.</h2>
            <p className="mt-2 text-sm text-[#786a76]">Check back soon for new sweet savings.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {promotions.map((promo) => (
              <article key={promo.id || promo.code} className="soft-card overflow-hidden">
                <div className="flex items-start justify-between gap-5 bg-[#fff4f7] p-7">
                  <div>
                    <p className="section-label">LIMITED OFFER</p>
                    <h2 className="mt-2 font-display text-3xl">{promo.title}</h2>
                  </div>
                  <span className="rounded-full bg-[#332532] px-3 py-2 text-xs font-bold text-white">
                    {promo.label}
                  </span>
                </div>
                <div className="p-7">
                  <p className="text-sm leading-6 text-[#786a76]">{promo.description}</p>
                  <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#f6efe9] p-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#786a76]">Promo code</p>
                      <p className="mt-1 font-bold tracking-[.12em]">{promo.code}</p>
                    </div>
                    <p className="text-xs text-[#786a76]">Minimum ₱{promo.minimum.toLocaleString()}</p>
                  </div>
                  <Link to={`/customize?promo=${promo.code}`} className="btn-secondary mt-5 w-full">
                    Use this promotion
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
