import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().min(7, "Enter a valid phone number."),
});

type ProfileValues = z.infer<typeof schema>;

export default function Profile() {
  usePageTitle("Profile");
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "Jhen",
      email: "customer@example.com",
      phone: "09171234567",
    },
  });

  const onSubmit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <section className="py-14">
      <div className="page-shell max-w-3xl">
        <p className="section-label">YOUR DETAILS</p>
        <h1 className="mt-3 font-display text-5xl">Profile.</h1>
        <p className="mt-4 text-[#786a76]">Keep your contact details ready for future cake orders.</p>

        {saved && (
          <div className="mt-7 rounded-[18px] border border-[#d8e9e0] bg-[#eaf5ef] p-4 text-sm font-bold text-[#347155]">
            Profile details saved successfully.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="soft-card mt-8 space-y-6 p-7">
          <div>
            <label className="label">Full name</label>
            <input className="input" {...register("name")} />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" {...register("email")} />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Phone number</label>
            <input className="input" {...register("phone")} />
            {errors.phone && <p className="error-text">{errors.phone.message}</p>}
          </div>
          <button className="btn-primary">Save profile</button>
        </form>
      </div>
    </section>
  );
}