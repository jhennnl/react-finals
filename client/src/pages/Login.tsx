import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../auth";
import { getApiError } from "../api";
import { useModal } from "../components/Modal";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type Values = z.infer<typeof schema>;

export default function Login() {
  usePageTitle("Log In");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
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

  const onSubmit = async (data: Values) => {
    setError("");
    setSubmitting(true);

    try {
      await login(data);
      show({
        title: "Welcome back!",
        message: "Your account, profile, and saved orders are ready.",
        confirmLabel: "Continue",
        onConfirm: () =>
          navigate((location.state as { from?: string })?.from ?? "/profile"),
      });
    } catch (e) {
      setError(getApiError(e, "We couldn't log you in."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell py-16 md:py-24">
      <div className="page-shell grid max-w-5xl gap-8 md:grid-cols-[.85fr_1fr]">
        <div className="auth-art pastel-panel-pink rounded-[32px] p-8 md:p-12">
          <p className="section-label">CAKETTE ACCOUNT</p>
          <h1 className="mt-4 font-display text-5xl leading-tight">
            Keep your sweet plans in one place.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#725d69]">
            Save your profile, follow real order updates, and make another cake without starting
            from scratch.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="soft-card p-7 md:p-10">
          <p className="section-label">WELCOME BACK</p>
          <h2 className="mt-3 font-display text-4xl">Log in.</h2>
          <p className="mt-3 text-sm text-[#786a76]">Use your Cakette account to continue.</p>

          {error && <p className="error-text mt-5">{error}</p>}

          <div className="mt-7">
            <label className="label">Email</label>
            <input className="input" type="email" autoComplete="email" {...register("email")} />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          <div className="mt-5">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs">
            <Link to="/forgot-password" className="font-bold text-[#a05f7b]">
              Forgot password?
            </Link>
            <span className="text-[#786a76]">Secure account login</span>
          </div>

          <button
            disabled={!isValid || submitting}
            className="btn-primary mt-7 w-full disabled:opacity-60"
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>

          <p className="mt-6 text-center text-sm text-[#786a76]">
            New here?{" "}
            <Link to="/register" className="font-bold text-[#a05f7b]">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
