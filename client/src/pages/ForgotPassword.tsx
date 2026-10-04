import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { api, getApiError } from "../api";
import { useModal } from "../components/Modal";
const schema=z.object({email:z.string().email("Enter a valid email address.")}); type Values=z.infer<typeof schema>;
export default function ForgotPassword(){usePageTitle("Forgot Password");const {show}=useModal(),[error,setError]=useState(""),[sending,setSending]=useState(false);const {register,handleSubmit,formState:{errors,isValid}}=useForm<Values>({resolver:zodResolver(schema),mode:"onChange"});const submit=async(data:Values)=>{setError("");setSending(true);try{const {data:response}=await api.post("/auth/forgot-password",data);show({title:"Check your inbox",message:response.message});}catch(e){setError(getApiError(e));}finally{setSending(false);}};return <section className="py-20"><div className="page-shell max-w-xl"><div className="soft-card p-8 md:p-10"><p className="section-label">ACCOUNT RECOVERY</p><h1 className="mt-3 font-display text-5xl">Reset your password.</h1><p className="mt-4 text-sm leading-6 text-[#786a76]">Enter your email and we’ll prepare reset instructions for your account.</p><form onSubmit={handleSubmit(submit)} className="mt-7"><label className="label">Email</label><input className="input" type="email" autoComplete="email" {...register("email")}/>{errors.email&&<p className="error-text">{errors.email.message}</p>}{error&&<p className="error-text">{error}</p>}<button disabled={!isValid||sending} className="btn-primary mt-6 w-full disabled:opacity-60">{sending?"Sending…":"Send reset link"}</button></form><Link to="/login" className="mt-6 block text-center text-sm font-bold text-[#a05f7b]">Back to login</Link></div></div></section>;}
