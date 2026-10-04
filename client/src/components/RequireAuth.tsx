import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth(); const location = useLocation();
  if (!ready) return <div className="page-shell py-20 text-center text-sm text-[#786a76]">Loading your account…</div>;
  return user ? <>{children}</> : <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
}
