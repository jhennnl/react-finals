import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#eadde2] bg-[#fffdfb]">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.3fr_.7fr_.9fr]">
        <div>
          <div className="font-display text-3xl font-semibold">
            cakette<span className="text-[#d98daa]">.</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#786a76]">
            A soft, simple way to plan a custom cake around your celebration, budget, design, and
            pickup date.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="eyebrow-chip">Custom pricing</span>
            <span className="eyebrow-chip">Pickup scheduling</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold">Explore</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#786a76]">
            <Link to="/cakes" className="hover:text-[#b45f7e]">
              Cake collection
            </Link>
            <Link to="/customize" className="hover:text-[#b45f7e]">
              Build a cake
            </Link>
            <Link to="/orders" className="hover:text-[#b45f7e]">
              My orders
            </Link>
            <Link to="/history" className="hover:text-[#b45f7e]">
              Order history
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold">cakette</p>
          <p className="mt-4 text-sm leading-6 text-[#786a76]">
            Custom cake planning and ordering system focused on configuration, price calculation,
            production capacity, and order tracking.
          </p>
          <Link to="/about" className="mt-4 inline-flex text-sm font-bold text-[#a99ad9]">
            How it works →
          </Link>
        </div>
      </div>

      <div className="border-t border-[#eadde2] py-5 text-center text-xs text-[#958892]">
        CAKETTE © 2026
      </div>
    </footer>
  );
}
