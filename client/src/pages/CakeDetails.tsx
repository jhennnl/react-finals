import { Link, useParams } from "react-router-dom";
import CakeCard from "../components/CakeCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { useCakes } from "../hooks/useCakes";
import { usePageTitle } from "../hooks/usePageTitle";

export default function CakeDetails() {
  const { id } = useParams();
  const { cakes, loading, error } = useCakes();
  const cake = cakes.find((item) => item.id === id);
  usePageTitle(cake?.name ?? "Cake Details");

  if (loading) {
    return (
      <section className="py-20">
        <div className="page-shell">
          <LoadingState />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="page-shell">
          <ErrorState message={error} />
        </div>
      </section>
    );
  }

  if (!cake) {
    return (
      <section className="py-20">
        <div className="page-shell soft-card p-12 text-center">
          <h1 className="font-display text-4xl">Cake not found</h1>
          <Link to="/cakes" className="btn-primary mt-6">
            Back to cakes
          </Link>
        </div>
      </section>
    );
  }

  const related = cakes.filter((item) => item.id !== cake.id && item.category === cake.category).slice(0, 2);

  return (
    <section className="py-14 md:py-16">
      <div className="page-shell">
        <Link to="/cakes" className="text-sm font-bold text-[#a99ad9]">
          ← Back to collection
        </Link>

        <div className="mt-7 grid gap-10 md:grid-cols-[1.05fr_.95fr] md:items-center">
          <div className="overflow-hidden rounded-[32px] bg-[#f9e3eb]">
            <div className="cake-image-stage min-h-[440px]">
              {cake.image ? (
                <img src={cake.image} alt={cake.name} className="h-full min-h-[440px] w-full object-contain p-10" />
              ) : (
                <div className="flex min-h-[440px] items-center justify-center p-10 text-center">
                  <p className="font-display text-5xl italic">{cake.name}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <span className="eyebrow-chip">{cake.category}</span>
              {cake.popular && <span className="eyebrow-chip">customer favorite</span>}
            </div>
            <h1 className="mt-4 font-display text-5xl leading-tight md:text-6xl">{cake.name}</h1>
            <p className="mt-5 text-sm leading-7 text-[#786a76]">{cake.description}</p>
            <p className="mt-6 font-display text-4xl">From ₱{cake.basePrice.toLocaleString()}</p>
            {typeof cake.stock === "number" && (
              <p className="mt-2 text-xs text-[#786a76]">{cake.stock} left in studio stock</p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={`/customize?cake=${cake.id}`} className="btn-primary">
                Customize this cake
              </Link>
              <Link to="/cakes" className="btn-secondary">
                Browse more
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <p className="section-label">MORE IN THIS COLLECTION</p>
            <h2 className="mt-3 font-display text-4xl">You might also love</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {related.map((item) => (
                <CakeCard key={item.id} cake={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
