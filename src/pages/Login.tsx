import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";

const schema = z.object({ email: z.string().email("Enter a valid email address."), password: z.string().min(6, "Password must be at least 6 characters.") });
type Values = z.infer<typeof schema>;

export default function Login() {
  usePageTitle("Log In");
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = (data: Values) => {
    localStorage.setItem("cakecraftUser", JSON.stringify({ email: data.email, name: data.email.split("@")[0] }));
    setMessage("You are now logged in.");
    setTimeout(() => navigate((location.state as { from?: string })?.from ?? "/profile"), 500);
  };

  return <section className="auth-shell py-16 md:py-24"><div className="page-shell grid max-w-5xl gap-8 md:grid-cols-[.85fr_1fr]">
    <div className="auth-art pastel-panel-pink rounded-[32px] p-8 md:p-12"><p className="section-label">CAKECRAFT ACCOUNT</p><h1 className="mt-4 font-display text-5xl leading-tight">Keep your sweet plans in one place.</h1><p className="mt-5 max-w-md text-sm leading-6 text-[#725d69]">Save your profile, keep track of orders, and make another cake without starting from scratch.</p><div className="mt-10 grid grid-cols-2 gap-3"><div className="soft-card p-5"><p className="font-display text-3xl">01</p><p className="mt-2 text-xs text-[#786a76]">Save your cake details</p></div><div className="soft-card p-5"><p className="font-display text-3xl">02</p><p className="mt-2 text-xs text-[#786a76]">Track every order</p></div></div></div>
    <form onSubmit={handleSubmit(onSubmit)} className="soft-card p-7 md:p-10"><p className="section-label">WELCOME BACK</p><h2 className="mt-3 font-display text-4xl">Log in.</h2><p className="mt-3 text-sm text-[#786a76]">Use your CakeCraft account to continue.</p>{message && <div className="mt-5 rounded-2xl bg-[#e9f2e3] p-3 text-sm font-bold text-[#3d6b4e]">{message}</div>}
      <div className="mt-7"><label className="label">Email</label><input className="input" type="email" {...register("email")} />{errors.email && <p className="error-text">{errors.email.message}</p>}</div>
      <div className="mt-5"><label className="label">Password</label><input className="input" type="password" {...register("password")} />{errors.password && <p className="error-text">{errors.password.message}</p>}</div>
      <div className="mt-6 flex items-center justify-between text-xs"><Link to="/forgot-password" className="font-bold text-[#a05f7b]">Forgot password?</Link><span className="text-[#786a76]">Demo frontend account</span></div>
      <button className="btn-primary mt-7 w-full">Log in</button><p className="mt-6 text-center text-sm text-[#786a76]">New here? <Link to="/register" className="font-bold text-[#a05f7b]">Create an account</Link></p>
    </form></div></section>;
}
