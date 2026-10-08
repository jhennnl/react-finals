import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Page Not Found");

  return (
    <section className="hero-surface">
      <div className="page-shell relative grid min-h-[70vh] items-center gap-10 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24">
        <div className="relative z-10">
          <span className="eyebrow-chip">404 · page not found</span>
          <p className="section-label mt-8">OOPS, THIS SLICE IS MISSING</p>
          <h1 className="mt-4 max-w-2xl font-display text-[48px] leading-[.96] tracking-[-0.045em] md:text-[68px]">
            this page
            <br />
            <span className="italic text-[#d98daa]">wandered off.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#786a76] md:text-lg">
            The link you followed doesn&apos;t lead anywhere in the Cakette studio. Let&apos;s get you back to something sweet.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="btn-primary">
              Back to home →
            </Link>
            <Link to="/cakes" className="btn-secondary">
              Browse cakes
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#786a76]">
            <Link to="/customize" className="transition hover:text-[#d98daa]">
              Start customizing
            </Link>
            <Link to="/promotions" className="transition hover:text-[#d98daa]">
              View promotions
            </Link>
            <Link to="/about" className="transition hover:text-[#d98daa]">
              How it works
            </Link>
          </div>
        </div>

        <div className="relative flex min-h-[360px] items-center justify-center">
          <div className="pastel-orb h-[300px] w-[300px] bg-[#eee9f8] md:h-[380px] md:w-[380px]" />
          <div className="pastel-orb h-[220px] w-[220px] bg-[#f9dce7] shadow-[0_30px_80px_rgba(217,141,170,.16)]" />
          <div className="pastel-orb h-[130px] w-[130px] bg-[#e4eee0]" />
          <div className="absolute left-[12%] top-[18%] h-3 w-3 rounded-full bg-[#f3d99a]" />
          <div className="absolute right-[14%] top-[28%] h-2.5 w-2.5 rounded-full bg-[#a99ad9]" />
          <div className="absolute bottom-[18%] left-[20%] h-2 w-2 rounded-full bg-[#d98daa]" />
          <div className="relative z-10 w-[240px] rotate-[-2deg] rounded-[30px] border border-white/70 bg-[#fffdfb]/85 p-7 text-center shadow-[0_25px_70px_rgba(72,45,64,.10)] backdrop-blur-md md:w-[260px]">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#b45f7e]">Error 404</p>
            <p className="mt-4 font-display text-5xl leading-none tracking-[-0.04em] text-[#332532]">404</p>
            <div className="mx-auto mt-5 h-px w-14 bg-[#d98daa]" />
            <p className="mt-4 text-xs leading-5 text-[#786a76]">
              No crumbs left on this path. Try another route in the studio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
