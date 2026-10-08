import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { api, getApiError } from "../api";
import { useModal } from "../components/Modal";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

const resetSchema = z
  .object({
    code: z.string().regex(/^\d{6}$/, "Enter the 6-digit verification code."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Confirm your new password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type EmailValues = z.infer<typeof emailSchema>;
type ResetValues = z.infer<typeof resetSchema>;

export default function ForgotPassword() {
  usePageTitle("Forgot Password");

  const navigate = useNavigate();
  const { show } = useModal();
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
  });

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
  });

  const requestCode = async (data: EmailValues) => {
    setError("");
    setSending(true);

    try {
      const { data: response } = await api.post<{
        message: string;
        verificationCode: string | null;
      }>("/auth/forgot-password", { email: data.email });

      setEmail(data.email.trim().toLowerCase());
      setDemoCode(response.verificationCode || "");
      setStep("verify");
      resetForm.reset();
      show({
        title: "Verification required",
        message: response.verificationCode
          ? `Enter the 6-digit code to continue. Demo code: ${response.verificationCode}`
          : response.message,
        confirmLabel: "Enter code",
      });
    } catch (e) {
      setError(getApiError(e));
    } finally {
      setSending(false);
    }
  };

  const resetPassword = async (data: ResetValues) => {
    setError("");
    setSending(true);

    try {
      const { data: response } = await api.post("/auth/reset-password", {
        email,
        code: data.code,
        password: data.password,
      });
      show({
        title: "Password updated",
        message: response.message,
        confirmLabel: "Log in",
        showClose: false,
        onConfirm: () => navigate("/login"),
      });
    } catch (e) {
      setError(getApiError(e, "Invalid or expired verification code."));
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-20">
      <div className="page-shell max-w-xl">
        <div className="soft-card p-8 md:p-10">
          <p className="section-label">ACCOUNT RECOVERY</p>
          <h1 className="mt-3 font-display text-5xl">Reset your password.</h1>
          <p className="mt-4 text-sm leading-6 text-[#786a76]">
            {step === "email"
              ? "Enter your email and we’ll issue a verification code before any password change."
              : "Enter the verification code, then choose a new password."}
          </p>

          {step === "email" ? (
            <form onSubmit={emailForm.handleSubmit(requestCode)} className="mt-7 space-y-5">
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  autoComplete="email"
                  {...emailForm.register("email")}
                />
                {emailForm.formState.errors.email && (
                  <p className="error-text">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              {error && <p className="error-text">{error}</p>}

              <button
                disabled={!emailForm.formState.isValid || sending}
                className="btn-primary w-full disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send verification code"}
              </button>
            </form>
          ) : (
            <form onSubmit={resetForm.handleSubmit(resetPassword)} className="mt-7 space-y-5">
              <div className="rounded-2xl bg-[#fff1f5] px-4 py-3 text-sm text-[#725d69]">
                Code sent for <strong>{email}</strong>
                {demoCode ? (
                  <>
                    . Demo verification code: <strong className="tracking-[0.2em]">{demoCode}</strong>
                  </>
                ) : (
                  ". If that inbox has an account, use the code from your email."
                )}
              </div>

              <div>
                <label className="label">Verification code</label>
                <input
                  className="input tracking-[0.3em]"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="6-digit code"
                  {...resetForm.register("code")}
                />
                {resetForm.formState.errors.code && (
                  <p className="error-text">{resetForm.formState.errors.code.message}</p>
                )}
              </div>

              <div>
                <label className="label">New password</label>
                <input
                  className="input"
                  type="password"
                  autoComplete="new-password"
                  {...resetForm.register("password")}
                />
                {resetForm.formState.errors.password && (
                  <p className="error-text">{resetForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="label">Confirm new password</label>
                <input
                  className="input"
                  type="password"
                  autoComplete="new-password"
                  {...resetForm.register("confirmPassword")}
                />
                {resetForm.formState.errors.confirmPassword && (
                  <p className="error-text">{resetForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              {error && <p className="error-text">{error}</p>}

              <button
                disabled={!resetForm.formState.isValid || sending}
                className="btn-primary w-full disabled:opacity-60"
              >
                {sending ? "Updating…" : "Verify & update password"}
              </button>

              <button
                type="button"
                className="w-full text-sm font-bold text-[#a05f7b]"
                onClick={() => {
                  setStep("email");
                  setDemoCode("");
                  setError("");
                }}
              >
                Use a different email
              </button>
            </form>
          )}

          <Link
            to="/login"
            className="mt-6 block text-center text-sm font-bold text-[#a05f7b]"
          >
            Back to login
          </Link>
        </div>
      </div>
    </section>
  );
}
