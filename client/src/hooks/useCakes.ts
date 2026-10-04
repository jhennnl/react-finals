import { useEffect, useState } from "react";
import { api, getApiError } from "../api";
import { asset } from "../assets";
import type { Cake } from "../types";

type ApiCake = {
  id?: string;
  slug?: string;
  _id?: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  tone?: Cake["tone"];
  imageFile?: string;
  stock?: number;
  popular?: boolean;
  active?: boolean;
};

export function mapCake(raw: ApiCake): Cake & { mongoId?: string; stock?: number; active?: boolean } {
  const slug = raw.slug || raw.id || "";
  return {
    id: slug,
    mongoId: raw._id,
    name: raw.name,
    description: raw.description,
    basePrice: raw.basePrice,
    category: raw.category,
    tone: raw.tone,
    imageFile: raw.imageFile,
    image: asset(raw.imageFile || `${slug}.png`),
    popular: raw.popular,
    stock: raw.stock,
    active: raw.active,
  };
}

export function useCakes() {
  const [cakes, setCakes] = useState<ReturnType<typeof mapCake>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = () => {
    setLoading(true);
    setError("");
    return api
      .get("/cakes")
      .then(({ data }) => setCakes((data.cakes as ApiCake[]).map(mapCake)))
      .catch((err) => setError(getApiError(err, "We couldn't load the cake menu.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  return { cakes, loading, error, reload, setCakes };
}
