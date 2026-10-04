import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { addOns, designs, fillings, flavors, sizes } from "../data";
import type { CakeOption, Promotion } from "../types";
import { api } from "../api";
import { useCakes } from "../hooks/useCakes";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { usePageTitle } from "../hooks/usePageTitle";

const schema = z.object({
  cakeId: z.string().min(1),
  size: z.string().min(1),
  flavor: z.string().min(1),
  filling: z.string().min(1),
  design: z.string().min(1),
  addOns: z.array(z.string()),
  specialInstructions: z.string().max(250, "Keep instructions under 250 characters.").optional(),
  promoCode: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: CakeOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-end justify-between">
        <label className="label mb-0">{label}</label>
        <span className="text-[11px] text-[#8b7884]">Choose one</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <button
            type="button"
            key={option.name}
            onClick={() => onChange(option.name)}
            className={`rounded-[16px] border p-4 text-left transition ${
              value === option.name
                ? "border-[#d98daa] bg-[#f9e3eb] ring-2 ring-[#d98daa]/10"
                : "border-[#e4d6dd] bg-white hover:bg-[#fff8f5]"
            }`}
          >
            <div className="flex justify-between gap-3">
              <span className="text-sm font-bold">{option.name}</span>
              <span className="text-xs text-[#786a76]">
                {option.price ? `+₱${option.price}` : "Included"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const findPrice = (options: CakeOption[], name: string) =>
  options.find((o) => o.name === name)?.price ?? 0;

export default function Customize() {
  usePageTitle("Customize Your Cake");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { cakes, loading, error } = useCakes();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promoMessage, setPromoMessage] = useState("");

  const defaultCake = params.get("cake") || "";

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      cakeId: defaultCake,
      size: sizes[1].name,
      flavor: flavors[0].name,
      filling: fillings[0].name,
      design: designs[0].name,
      addOns: [],
      specialInstructions: "",
      promoCode: params.get("promo") ?? "",
    },
  });

  const values = watch();
  const selectedAddOns = values.addOns || [];
  const promoCode = values.promoCode || "";

  useEffect(() => {
    api.get("/promotions?active=true").then(({ data }) => setPromotions(data.promotions)).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!cakes.length) return;
    if (!values.cakeId || !cakes.some((cake) => cake.id === values.cakeId)) {
      setValue("cakeId", defaultCake && cakes.some((c) => c.id === defaultCake) ? defaultCake : cakes[0].id, {
        shouldValidate: true,
      });
    }
  }, [cakes, defaultCake, setValue, values.cakeId]);

  const cake = cakes.find((c) => c.id === values.cakeId) ?? cakes[0];

  const subtotal = useMemo(() => {
    if (!cake) return 0;
    return (
      findPrice(sizes, values.size) +
      cake.basePrice +
      findPrice(flavors, values.flavor) +
      findPrice(fillings, values.filling) +
      findPrice(designs, values.design) +
      selectedAddOns.reduce((sum, n) => sum + findPrice(addOns, n), 0)
    );
  }, [values.size, values.flavor, values.filling, values.design, selectedAddOns, cake]);

  const promotion = promotions.find(
    (p) => p.code.toLowerCase() === promoCode.trim().toLowerCase() && p.active
  );
  const discount =
    promotion && subtotal >= promotion.minimum
      ? promotion.type === "percent"
        ? Math.round((subtotal * promotion.value) / 100)
        : promotion.value
      : 0;
  const total = Math.max(0, subtotal - discount);

  const applyPromo = () => {
    if (!promoCode) {
      setPromoMessage("Enter a promotion code first.");
      return;
    }
    if (!promotion) {
      setPromoMessage("That promotion code is not available.");
      return;
    }
    if (subtotal < promotion.minimum) {
      setPromoMessage(`This code requires a subtotal of at least ₱${promotion.minimum.toLocaleString()}.`);
      return;
    }
    setPromoMessage(`${promotion.label} applied to your order.`);
    setValue("promoCode", promotion.code, { shouldValidate: true });
  };

  const onSubmit = (data: FormValues) => {
    const q = new URLSearchParams({
      cake: data.cakeId,
      size: data.size,
      flavor: data.flavor,
      filling: data.filling,
      design: data.design,
      addons: (data.addOns || []).join(","),
      subtotal: String(subtotal),
      discount: String(discount),
      total: String(total),
      promo: promotion?.code ?? "",
      instructions: data.specialInstructions ?? "",
    });
    navigate(`/pickup?${q.toString()}`);
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="page-shell">
          <LoadingState />
        </div>
      </section>
    );
  }

  if (error || !cake) {
    return (
      <section className="py-16">
        <div className="page-shell">
          <ErrorState message={error || "No cakes available to customize."} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="page-shell">
        <div className="mb-10 max-w-3xl">
          <p className="section-label">THE CAKE BUILDER</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Build the cake you actually want.</h1>
          <p className="mt-4 text-sm leading-7 text-[#786a76]">
            Choose a starting cake, customize each layer, add finishing touches, and apply a promotion before
            checking pickup availability.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-7">
            <div className="soft-card p-6 md:p-8">
              <div className="flex items-end justify-between">
                <div>
                  <p className="section-label">01 · STARTING CAKE</p>
                  <h2 className="mt-2 font-display text-3xl">Choose your base.</h2>
                </div>
                <span className="text-xs text-[#786a76]">{cakes.length} designs</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cakes.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setValue("cakeId", item.id, { shouldValidate: true })}
                    className={`overflow-hidden rounded-[22px] border text-left transition ${
                      values.cakeId === item.id
                        ? "border-[#d98daa] bg-[#fff0f4] ring-2 ring-[#d98daa]/10"
                        : "border-[#eadde2] bg-white hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="cake-image-stage aspect-[4/3]">
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain p-4" />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a05f7b]">
                        {item.category}
                      </p>
                      <p className="mt-1 font-display text-xl">{item.name}</p>
                      <p className="mt-1 text-xs text-[#786a76]">From ₱{item.basePrice.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
              {errors.cakeId && <p className="error-text">Please select a cake.</p>}
            </div>

            <div className="soft-card space-y-8 p-6 md:p-8">
              <div>
                <p className="section-label">02 · CAKE DETAILS</p>
                <h2 className="mt-2 font-display text-3xl">Choose the flavor profile.</h2>
              </div>
              <OptionGroup
                label="Size"
                options={sizes}
                value={values.size}
                onChange={(v) => setValue("size", v, { shouldValidate: true })}
              />
              <OptionGroup
                label="Flavor"
                options={flavors}
                value={values.flavor}
                onChange={(v) => setValue("flavor", v, { shouldValidate: true })}
              />
              <OptionGroup
                label="Filling"
                options={fillings}
                value={values.filling}
                onChange={(v) => setValue("filling", v, { shouldValidate: true })}
              />
            </div>

            <div className="soft-card space-y-8 p-6 md:p-8">
              <div>
                <p className="section-label">03 · LOOK & FINISH</p>
                <h2 className="mt-2 font-display text-3xl">Choose how it should look.</h2>
              </div>
              <OptionGroup
                label="Design"
                options={designs}
                value={values.design}
                onChange={(v) => setValue("design", v, { shouldValidate: true })}
              />
              <div>
                <label className="label">Add-ons</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {addOns.map((item) => {
                    const checked = selectedAddOns.includes(item.name);
                    return (
                      <label
                        key={item.name}
                        className={`flex cursor-pointer items-center justify-between rounded-[16px] border p-4 transition ${
                          checked
                            ? "border-[#a99ad9] bg-[#eee9f8]"
                            : "border-[#e4d6dd] bg-white hover:bg-[#fff8f5]"
                        }`}
                      >
                        <span className="flex items-center gap-3 text-sm font-bold">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const next = checked
                                ? selectedAddOns.filter((n) => n !== item.name)
                                : [...selectedAddOns, item.name];
                              setValue("addOns", next, { shouldValidate: true });
                            }}
                            className="accent-[#a99ad9]"
                          />
                          {item.name}
                        </span>
                        <span className="text-xs text-[#786a76]">+₱{item.price}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="label">Special instructions</label>
                <textarea
                  rows={4}
                  className="input resize-none"
                  placeholder="Colors, wording, references, or other details..."
                  {...register("specialInstructions")}
                />
                {errors.specialInstructions && (
                  <p className="error-text">{errors.specialInstructions.message}</p>
                )}
              </div>
            </div>

            <div className="soft-card p-6 md:p-8">
              <div>
                <p className="section-label">04 · PROMOTION</p>
                <h2 className="mt-2 font-display text-3xl">Have a code?</h2>
              </div>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <input
                  className="input"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setValue("promoCode", e.target.value.toUpperCase())}
                />
                <button type="button" onClick={applyPromo} className="btn-secondary sm:w-36">
                  Apply code
                </button>
              </div>
              {promoMessage && (
                <p className={`mt-3 text-xs font-bold ${discount ? "text-[#3d6b4e]" : "text-[#a05f7b]"}`}>
                  {promoMessage}
                </p>
              )}
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {promotions.slice(0, 3).map((p) => (
                  <button
                    type="button"
                    key={p.code}
                    onClick={() => setValue("promoCode", p.code)}
                    className="rounded-2xl bg-[#fff4f7] p-4 text-left hover:bg-[#f9e3eb]"
                  >
                    <p className="text-xs font-bold">{p.code}</p>
                    <p className="mt-1 text-[11px] text-[#786a76]">
                      {p.label} · ₱{p.minimum.toLocaleString()} min.
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-[28px] bg-[#332532] p-6 text-white shadow-[0_22px_55px_rgba(43,29,50,.15)] lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#f3b7cf]">LIVE ORDER SUMMARY</p>
            <div className="mt-5 flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-2xl bg-[#f9e3eb]">
                <img src={cake.image} alt={cake.name} className="h-full w-full object-contain" />
              </div>
              <div>
                <h2 className="font-display text-2xl">{cake.name}</h2>
                <p className="mt-1 text-xs text-white/60">
                  {values.size} · {values.flavor}
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-3 border-y border-white/10 py-5 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Cake base</span>
                <span>₱{cake.basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Size</span>
                <span>+₱{findPrice(sizes, values.size)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Flavor</span>
                <span>+₱{findPrice(flavors, values.flavor)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Filling</span>
                <span>+₱{findPrice(fillings, values.filling)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Design</span>
                <span>+₱{findPrice(designs, values.design)}</span>
              </div>
              {selectedAddOns.map((n) => (
                <div key={n} className="flex justify-between">
                  <span className="max-w-[180px] text-white/60">{n}</span>
                  <span>+₱{findPrice(addOns, n)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between text-sm">
              <span className="text-white/60">Subtotal</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="mt-2 flex justify-between text-sm text-[#f4c3d6]">
                <span>Discount · {promotion?.code}</span>
                <span>-₱{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="mt-4 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₱{total.toLocaleString()}</span>
            </div>
            <button
              type="submit"
              disabled={!isValid}
              className="mt-6 w-full rounded-full bg-[#e7a8be] px-5 py-3 font-bold text-[#332532] transition hover:bg-[#f1b8cc] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Choose pickup date
            </button>
            <Link to="/cakes" className="mt-3 block text-center text-xs text-white/60 hover:text-white">
              Back to collection
            </Link>
          </aside>
        </form>
      </div>
    </section>
  );
}
