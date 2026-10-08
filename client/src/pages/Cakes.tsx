import { useMemo, useState } from "react";
import CakeCard from "../components/CakeCard";
import SectionHeading from "../components/SectionHeading";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { useCakes } from "../hooks/useCakes";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Cakes() {
  usePageTitle("Cake Collection");
  const { cakes, loading, error } = useCakes();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  const categories = useMemo(
    () => ["All", ...new Set(cakes.map((cake) => cake.category))],
    [cakes]
  );

  const filtered = useMemo(() => {
    const result = cakes
      .filter((cake) => category === "All" || cake.category === category)
      .filter((cake) =>
        `${cake.name} ${cake.description} ${cake.category}`.toLowerCase().includes(query.toLowerCase())
      );

    if (sort === "low") result.sort((a, b) => a.basePrice - b.basePrice);
    if (sort === "high") result.sort((a, b) => b.basePrice - a.basePrice);
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") result.sort((a, b) => Number(b.popular) - Number(a.popular));
    return result;
  }, [cakes, category, query, sort]);

  const minPrice = cakes.length ? Math.min(...cakes.map((cake) => cake.basePrice)) : 0;

  return (
    <section className="py-14 md:py-16">
      <div className="page-shell">
        <SectionHeading
          eyebrow="THE COLLECTION"
          title="Find a starting point that feels like you."
          description="These are starting designs, not limits. Every cake can be adjusted with your preferred size, flavor, filling, design, and add-ons."
        />

        {loading ? (
          <div className="mt-10">
            <LoadingState />
          </div>
        ) : error ? (
          <div className="mt-10">
            <ErrorState message={error} />
          </div>
        ) : (
          <>
            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              <div className="soft-card p-5">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#b45f7e]">Starting cakes</p>
                <p className="mt-2 font-display text-3xl">{cakes.length}</p>
              </div>
              <div className="soft-card p-5">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#b45f7e]">Customization</p>
                <p className="mt-2 font-display text-3xl">5+ options</p>
              </div>
              <div className="soft-card p-5">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#b45f7e]">Price range</p>
                <p className="mt-2 font-display text-3xl">₱{minPrice.toLocaleString()}+</p>
              </div>
            </div>

            <div className="mt-10 rounded-[26px] border border-[#eadde2] bg-[#fffdfb] p-4 md:p-5">
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by cake, flavor, or collection..."
                  className="input"
                />
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="input md:w-48">
                  <option value="featured">Featured first</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  <option value="name">Name: A–Z</option>
                </select>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                      category === item
                        ? "bg-[#332532] text-white"
                        : "border border-[#e4d6dd] bg-[#fff8f5] text-[#594d5b] hover:bg-[#f9e3eb]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold">{filtered.length} cakes</p>
                <p className="mt-1 text-xs text-[#786a76]">Select a design to see details and customize it.</p>
              </div>
              <span className="hidden text-xs text-[#786a76] sm:block">Prices shown are starting prices.</span>
            </div>

            <div className="mt-5">
              {filtered.length === 0 ? (
                <div className="soft-card p-14 text-center">
                  <p className="section-label">NOTHING FOUND</p>
                  <h2 className="mt-3 font-display text-3xl">Try another search.</h2>
                  <p className="mt-2 text-sm text-[#786a76]">Clear the search or choose another collection.</p>
                  <button
                    onClick={() => {
                      setQuery("");
                      setCategory("All");
                    }}
                    className="btn-secondary mt-6"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((cake) => (
                    <CakeCard key={cake.id} cake={cake} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
