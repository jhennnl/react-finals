import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";

export type User = { id: string; name: string; email: string; phone: string };
type Credentials = { email: string; password: string };
type Registration = Credentials & { name: string };
type AuthContextValue = { user: User | null; ready: boolean; login: (data: Credentials) => Promise<void>; register: (data: Registration) => Promise<void>; logout: () => void; updateUser: (user: User) => void };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { const restore = async () => { if (!localStorage.getItem("cakecraftToken")) { setReady(true); return; } try { const { data } = await api.get<{ user: User }>("/auth/me"); setUser(data.user); } catch { localStorage.removeItem("cakecraftToken"); } finally { setReady(true); } }; void restore(); }, []);
  const accept = (data: { token: string; user: User }) => { localStorage.setItem("cakecraftToken", data.token); setUser(data.user); };
  const value = { user, ready, login: async (data: Credentials) => accept((await api.post("/auth/login", data)).data), register: async (data: Registration) => accept((await api.post("/auth/register", data)).data), logout: () => { localStorage.removeItem("cakecraftToken"); setUser(null); }, updateUser: setUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used inside AuthProvider"); return context; };
