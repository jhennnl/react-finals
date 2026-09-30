import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
const schema = z.object({ email: z.string().email("Enter a valid email address.") });
type Values = z.infer<typeof schema>;
export default function ForgotPassword() { usePageTitle("Forgot Password"); const [sent,setSent]=useState(false); const {register,handleSubmit,formState:{errors}}=useForm<Values>({resolver:zodResolver(schema)}); return <section className="py-20"><div className="page-shell max-w-xl"><div className="soft-card p-8 md:p-10"><p className="section-label">ACCOUNT RECOVERY</p><h1 className="mt-3 font-display text-5xl">Reset your password.</h1><p className="mt-4 text-sm leading-6 text-[#786a76]">Enter your email and the backend will later send a secure reset link.</p>{sent?<div className="mt-7 rounded-2xl bg-[#e9f2e3] p-4 text-sm font-bold text-[#3d6b4e]">If an account exists for that email, reset instructions would be sent.</div>:<form onSubmit={handleSubmit(()=>setSent(true))} className="mt-7"><label className="label">Email</label><input className="input" type="email" {...register("email")}/>{errors.email&&<p className="error-text">{errors.email.message}</p>}<button className="btn-primary mt-6 w-full">Send reset link</button></form>}<Link to="/login" className="mt-6 block text-center text-sm font-bold text-[#a05f7b]">Back to login</Link></div></div></section>; }
