export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="section-label">{eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl leading-tight tracking-[-0.03em] md:text-5xl">{title}</h1>
      {description && <p className="mt-4 text-base leading-7 text-[#786a76]">{description}</p>}
    </div>
  );
}