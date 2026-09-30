import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { useModal } from "./Modal";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Cakes", to: "/cakes" },
  { label: "Offers", to: "/promotions" },
  { label: "My Orders", to: "/orders" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { show } = useModal();
  const userName = user?.name ?? "";
  const requestLogout = () => show({ title: "Log out?", message: "You can log back in at any time to see your saved orders and profile.", confirmLabel: "Log out", onConfirm: () => { logout(); navigate("/"); } });

  return <header className="sticky top-0 z-40 border-b border-[#eadde2] bg-[#fff8f5]/90 backdrop-blur-xl">
    <div className="page-shell flex min-h-[74px] items-center justify-between gap-5">
      <Link to="/" onClick={() => setOpen(false)} className="font-display text-[29px] font-semibold tracking-[-0.05em]">cakette<span className="text-[#d98daa]">.</span></Link>
      <nav className="hidden items-center gap-7 lg:flex">{navItems.map(item=><NavLink key={item.to} to={item.to} className={({isActive})=>`text-sm transition ${isActive?"font-bold text-[#a05f7b]":"text-[#493d4f] hover:text-[#a05f7b]"}`}>{item.label}</NavLink>)}</nav>
      <div className="flex items-center gap-2">
        {user ? <div className="hidden items-center gap-2 sm:flex"><Link to="/profile" className="rounded-full border border-[#e4d6dd] bg-[#fffdfb] px-4 py-2 text-xs font-bold">{userName || "Profile"}</Link><button onClick={requestLogout} className="px-2 text-xs font-bold text-[#786a76]">Log out</button></div> : <Link to="/login" className="hidden rounded-full border border-[#e4d6dd] bg-[#fffdfb] px-4 py-2 text-xs font-bold sm:inline-flex">Log in</Link>}
        <Link to="/customize" className="btn-primary hidden text-sm md:inline-flex">Create a cake</Link>
        <button type="button" onClick={()=>setOpen(v=>!v)} className="rounded-full border border-[#e4d6dd] bg-[#fffdfb] px-4 py-2 text-sm font-bold lg:hidden">Menu</button>
      </div>
    </div>
    {open && <div className="border-t border-[#eadde2] bg-[#fffdfb] lg:hidden"><nav className="page-shell flex flex-col gap-1 py-4">{navItems.map(item=><NavLink key={item.to} to={item.to} onClick={()=>setOpen(false)} className={({isActive})=>`rounded-2xl px-4 py-3 text-sm ${isActive?"bg-[#f9e3eb] font-bold":"text-[#493d4f]"}`}>{item.label}</NavLink>)}{user?<><Link to="/profile" onClick={()=>setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-bold">Profile</Link><button onClick={()=>{setOpen(false);requestLogout();}} className="rounded-2xl px-4 py-3 text-left text-sm font-bold text-[#786a76]">Log out</button></>:<Link to="/login" onClick={()=>setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-bold">Log in</Link>}<Link to="/customize" onClick={()=>setOpen(false)} className="btn-primary mt-2 text-sm">Create a cake</Link></nav></div>}
  </header>;
}
