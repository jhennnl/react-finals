import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { usePageTitle } from "../hooks/usePageTitle";

const steps = [
  ["01", "Choose a starting cake", "Browse the collection and select a design that fits the mood of your celebration."],
  ["02", "Build your configuration", "Choose size, flavor, filling, design, and optional finishing touches."],
  ["03", "See the estimated total", "The selected prices are combined automatically so you can adjust before ordering."],
  ["04", "Choose a pickup date", "Dates show remaining production capacity so you can select an available slot."],
  ["05", "Review and place", "Check your cake configuration, customer details, pickup date, and total."],
  ["06", "Track the order", "Follow your order through pending, confirmed, production, ready, and completed stages."],
];

const faqs = [
  ["Can I change my cake after choosing it?", "Yes. The customization flow is designed so you can change the cake and options before reviewing the final order."],
  ["Why does the price change?", "The starting cake has a base price. Size, flavor, filling, design, and add-ons can each add to the total."],
  ["Why are some pickup dates unavailable?", "The system uses daily production capacity. When the available capacity reaches zero, that date cannot be selected."],
  ["Can I track an order?", "Yes. My Orders and Order Details show the current status and progress of your order."],
];

export default function About() {
  usePageTitle("How It Works");

  return (
    <section className="py-14 md:py-16">
      <div className="page-shell">
        <SectionHeading
          eyebrow="HOW CAKECRAFT WORKS"
          title="Less guessing. More designing."
          description="CakeCraft is built around the part of custom cake ordering that needs the most attention: choosing details, understanding the price, finding an available date, and keeping track of the order."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <div className="pastel-panel-pink rounded-[28px] p-7"><p className="section-label">CUSTOM</p><h2 className="mt-3 font-display text-3xl">Built around your choices.</h2><p className="mt-3 text-sm leading-6 text-[#765d6d]">Your cake starts with a design, then becomes a configuration made from your selected options.</p></div>
          <div className="pastel-panel-lilac rounded-[28px] p-7"><p className="section-label">CLEAR</p><h2 className="mt-3 font-display text-3xl">Know what you are ordering.</h2><p className="mt-3 text-sm leading-6 text-[#665b76]">The summary keeps the selected options and calculated total visible before submission.</p></div>
          <div className="pastel-panel-green rounded-[28px] p-7"><p className="section-label">PLANNED</p><h2 className="mt-3 font-display text-3xl">Pick a realistic date.</h2><p className="mt-3 text-sm leading-6 text-[#5b7055]">Production capacity is part of the ordering flow instead of being an afterthought.</p></div>
        </div>

        <div className="mt-20">
          <p className="section-label">THE PROCESS</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">From idea to pickup.</h2>
          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {steps.map(([number, title, text]) => (
              <div key={number} className="soft-card p-7">
                <span className="text-xs font-bold tracking-[.16em] text-[#b45f7e]">{number}</span>
                <h3 className="mt-3 font-display text-3xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#786a76]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="section-label">GOOD TO KNOW</p>
            <h2 className="mt-3 font-display text-4xl">A few common questions.</h2>
            <p className="mt-4 text-sm leading-6 text-[#786a76]">Everything is designed to keep the ordering flow easy to understand.</p>
          </div>
          <div className="space-y-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-[20px] border border-[#eadde2] bg-[#fffdfb] p-5">
                <summary className="cursor-pointer list-none pr-6 text-sm font-bold">{question}</summary>
                <p className="mt-3 text-sm leading-6 text-[#786a76]">{answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-20 rounded-[32px] bg-[#332532] p-8 text-white md:p-12">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#e7a8be]">READY TO CREATE</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl md:text-5xl">Start with a design. Make it yours.</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">Choose a starting cake and let the builder handle the option-by-option price calculation.</p>
          <Link to="/cakes" className="mt-7 inline-flex rounded-full bg-[#f9e3eb] px-5 py-3 text-sm font-bold text-[#332532]">Explore cakes →</Link>
        </div>
      </div>
    </section>
  );
}
