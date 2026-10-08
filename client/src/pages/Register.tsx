import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../auth";
import { getApiError } from "../api";
import { useModal } from "../components/Modal";

const schema = z
  .object({
    name: z.string().min(2, "Enter your name."),
    email: z.string().email("Enter a valid email."),
    password: z.string().min(6, "Use at least 6 characters."),
    confirm: z.string().min(6),
  })
  .refine((values) => values.password === values.confirm, {
    path: ["confirm"],
    message: "Passwords do not match.",
  });

type Values = z.infer<typeof schema>;

export default function Register() {
  usePageTitle("Create Account");

  const navigate = useNavigate();
  const { register: registerAccount } = useAuth();
  const { show } = useModal();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async ({ confirm: _confirm, ...data }: Values) => {
    setError("");
    setSubmitting(true);

    try {
      await registerAccount(data);
      show({
        title: "Account created!",
        message: "You're ready to save orders, checkout, and manage your profile.",
        confirmLabel: "Set up my profile",
        showClose: false,
        onConfirm: () => navigate("/profile"),
      });
    } catch (e) {
      setError(getApiError(e, "We couldn't create your account."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="page-shell max-w-5xl">
        <div className="grid gap-8 md:grid-cols-[1fr_.9fr]">
          <div>
            <p className="section-label">JOIN CAKETTE</p>
            <h1 className="mt-4 max-w-xl font-display text-5xl leading-tight">
              Create a profile for your next celebration.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#786a76]">
              Your account securely saves your contact details and orders in the Cakette shop.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="soft-card p-7 md:p-9">
            <p className="section-label">GET STARTED</p>
            <h2 className="mt-3 font-display text-4xl">Create account.</h2>

            {error && <p className="error-text mt-5">{error}</p>}

            <div className="mt-7">
              <label className="label">Full name</label>
              <input className="input" autoComplete="name" {...register("name")} />
              {errors.name && <p className="error-text">{errors.name.message}</p>}
            </div>

            <div className="mt-5">
              <label className="label">Email</label>
              <input className="input" type="email" autoComplete="email" {...register("email")} />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            <div className="mt-5">
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            <div className="mt-5">
              <label className="label">Confirm password</label>
              <input
                className="input"
                type="password"
                autoComplete="new-password"
                {...register("confirm")}
              />
              {errors.confirm && <p className="error-text">{errors.confirm.message}</p>}
            </div>

            <button
              disabled={!isValid || submitting}
              className="btn-primary mt-7 w-full disabled:opacity-60"
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>

            <p className="mt-6 text-center text-sm text-[#786a76]">
              Already registered?{" "}
              <Link to="/login" className="font-bold text-[#a05f7b]">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
