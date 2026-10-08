import { Link } from "react-router-dom";
import type { Cake } from "../types";

const toneClasses = {
  pink: "bg-[#f9e3eb]",
  yellow: "bg-[#fbf1d7]",
  green: "bg-[#e4eee0]",
  lilac: "bg-[#eee9f8]",
  blue: "bg-[#e7edf7]",
  rose: "bg-[#f5dde1]",
};

export default function CakeCard({ cake }: { cake: Cake }) {
  const tone = toneClasses[cake.tone ?? "pink"];

  return (
    <article className="group overflow-hidden rounded-[26px] border border-[#eadde2] bg-[#fffdfb] shadow-[0_18px_45px_rgba(72,45,64,.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(72,45,64,.09)]">
      <Link to={`/cakes/${cake.id}`}>
        <div className={`cake-image-stage aspect-[4/3] ${tone}`}>
          <div className="absolute left-5 top-5 z-10 rounded-full bg-white/70 px-3 py-1 text-[9px] font-bold uppercase tracking-[.14em] text-[#6e5c68]">
            {cake.category}
          </div>
          {cake.popular && (
            <div className="absolute right-5 top-5 z-10 rounded-full bg-[#332532] px-3 py-1 text-[9px] font-bold uppercase tracking-[.14em] text-white">
              Popular
            </div>
          )}
          <div className="absolute left-[18%] top-[18%] h-2 w-2 rounded-full bg-[#f3d99a]" />
          <div className="absolute right-[20%] top-[30%] h-3 w-3 rounded-full bg-[#a99ad9]" />
          {cake.image ? (
            <img
              src={cake.image}
              alt={cake.name}
              className="h-full w-full object-contain p-7 transition duration-500 group-hover:scale-[1.045]"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center">
              <div>
                <p className="font-display text-4xl italic">{cake.name}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[.16em] text-[#786a76]">
                  Add image in src/assets
                </p>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl">{cake.name}</h3>
            <p className="mt-1 text-xs text-[#786a76]">
              Starting at ₱{cake.basePrice.toLocaleString()}
            </p>
          </div>
          <span className="rounded-full bg-[#f7edf1] px-3 py-1 text-[10px] font-bold text-[#a05f7b]">
            Custom
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#786a76]">{cake.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#786a76]">6+ ways to personalize</span>
          <Link
            to={`/customize?cake=${cake.id}`}
            className="text-sm font-bold text-[#a05f7b] hover:text-[#7e435d]"
          >
            Customize →
          </Link>
        </div>
      </div>
    </article>
  );
}
