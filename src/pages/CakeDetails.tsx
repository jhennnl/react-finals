import { Link, useParams } from "react-router-dom";
import CakeCard from "../components/CakeCard";
import { cakes } from "../data";
import { usePageTitle } from "../hooks/usePageTitle";

export default function CakeDetails() {
  const { id } = useParams();
  const cake = cakes.find((item) => item.id === id);
  usePageTitle(cake?.name ?? "Cake Details");

  if (!cake) {
    return (
      <section className="py-20"><div className="page-shell soft-card p-12 text-center"><h1 className="font-display text-4xl">Cake not found</h1><Link to="/cakes" className="btn-primary mt-6">Back to cakes</Link></div></section>
    );
  }

  const related = cakes.filter((item) => item.id !== cake.id && item.category === cake.category).slice(0, 2);

  return (
    <section className="py-14 md:py-16">
      <div className="page-shell">
        <Link to="/cakes" className="text-sm font-bold text-[#a99ad9]">← Back to collection</Link>

        <div className="mt-7 grid gap-10 md:grid-cols-[1.05fr_.95fr] md:items-center">
          <div className="overflow-hidden rounded-[32px] bg-[#f9e3eb]">
            <div className="cake-image-stage min-h-[440px]">
              {cake.image ? (
                <img src={cake.image} alt={cake.name} className="h-full min-h-[440px] w-full object-contain p-10" />
              ) : (
                <div className="flex min-h-[440px] items-center justify-center p-10 text-center"><p className="font-display text-5xl italic">{cake.name}</p></div>
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <span className="eyebrow-chip">{cake.category}</span>
              {cake.popular && <span className="eyebrow-chip">customer favorite</span>}
            </div>
            <h1 className="mt-4 font-display text-5xl leading-tight md:text-6xl">{cake.name}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#786a76]">{cake.description}</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[20px] bg-[#f9e3eb] p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#b45f7e]">Starting</p><p className="mt-2 font-semibold">₱{cake.basePrice.toLocaleString()}</p></div>
              <div className="rounded-[20px] bg-[#eee9f8] p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#6e5e9b]">Size</p><p className="mt-2 font-semibold">6–12 inch</p></div>
              <div className="rounded-[20px] bg-[#e4eee0] p-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#55734f]">Made for</p><p className="mt-2 font-semibold">Your occasion</p></div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={`/customize?cake=${cake.id}`} className="btn-primary">Customize this cake →</Link>
              <Link to="/pickup" className="btn-secondary">Check pickup dates</Link>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            ["Choose your size", "From 6-inch to 12-inch, select the size that fits your gathering."],
            ["Change the flavor", "Mix classic and specialty flavors with fillings to create your combination."],
            ["Finish the look", "Choose a design and optional finishing touches like a topper or message."],
          ].map(([title, text], index) => (
            <div key={title} className="soft-card p-6">
              <span className="text-xs font-bold tracking-[.16em] text-[#b45f7e]">0{index + 1}</span>
              <h2 className="mt-3 font-display text-2xl">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#786a76]">{text}</p>
            </div>
          ))}
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <p className="section-label">YOU MAY ALSO LIKE</p>
            <h2 className="mt-3 font-display text-4xl">More from {cake.category.toLowerCase()}.</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">{related.map((item) => <CakeCard key={item.id} cake={item} />)}</div>
          </div>
        )}
      </div>
    </section>
  );
}
