// ⁘[ ADD PLACE PAGE ]⁘
// cualquier usuario logueado puede sugerir un cafe nuevo

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/client";
import { useT } from "@/stores/lang";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { Establishment } from "@/types";

export function AddPlacePage() {
  const t = useT();
  const navigate = useNavigate();
  const geo = useGeolocation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", address: "", city: "", country: "",
    lat: "", lng: "", phone: "", website: "",
  });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const useMyLocation = () => {
    if (geo.lat && geo.lng) {
      setForm((f) => ({ ...f, lat: String(geo.lat), lng: String(geo.lng) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const est = await api.post<Establishment>("/establishments", {
        name: form.name,
        description: form.description || undefined,
        address: form.address,
        city: form.city,
        country: form.country,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        phone: form.phone || undefined,
        website: form.website || undefined,
      });
      navigate(`/establishment/${est.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-2xl mb-2">{t.addPlace}</h1>
      <p className="text-text-muted text-sm mb-8">{t.addPlaceDesc}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder={t.placeName} value={form.name} onChange={(e) => set("name", e.target.value)} className="input" required />
        <textarea placeholder={t.placeDesc} value={form.description} onChange={(e) => set("description", e.target.value)} className="input min-h-[80px] resize-y" rows={3} />
        <input placeholder={t.address} value={form.address} onChange={(e) => set("address", e.target.value)} className="input" required />

        <div className="grid grid-cols-2 gap-3">
          <input placeholder={t.city} value={form.city} onChange={(e) => set("city", e.target.value)} className="input" required />
          <input placeholder={t.country} value={form.country} onChange={(e) => set("country", e.target.value)} className="input" required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input placeholder={t.latitude} value={form.lat} onChange={(e) => set("lat", e.target.value)} className="input" required type="number" step="any" />
          <input placeholder={t.longitude} value={form.lng} onChange={(e) => set("lng", e.target.value)} className="input" required type="number" step="any" />
        </div>

        <button type="button" onClick={useMyLocation} className="btn-secondary text-sm py-2 px-3">
          {t.useMyLocation}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <input placeholder={t.phone} value={form.phone} onChange={(e) => set("phone", e.target.value)} className="input" />
          <input placeholder={t.website} value={form.website} onChange={(e) => set("website", e.target.value)} className="input" type="url" />
        </div>

        {error && <p className="text-error text-sm bg-error/10 border border-error/20 rounded-sm px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? t.savingChanges : t.submitPlace}
        </button>
      </form>
    </div>
  );
}
