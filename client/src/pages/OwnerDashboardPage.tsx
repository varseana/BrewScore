// ⁘[ OWNER DASHBOARD ]⁘
// editar info, coffee program, fotos del establecimiento

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import { useEstablishments, useEstablishment, useUpdateCoffeeProgram } from "@/api/hooks";
import { api } from "@/api/client";
import { useT } from "@/stores/lang";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { Link } from "react-router-dom";
import type { CoffeeProgram } from "@/types";

export function OwnerDashboardPage() {
  const t = useT();
  const { user } = useAuthStore();

  // buscar establecimientos del owner
  const { data } = useEstablishments({ limit: 10 });
  const myEst = data?.items.find((e) => e.ownerId === user?.id);
  const { data: full, isLoading } = useEstablishment(myEst?.id ?? "");
  const updateCP = useUpdateCoffeeProgram();

  const [tab, setTab] = useState<"info" | "coffee" | "photos">("info");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // info form
  const [info, setInfo] = useState({ name: "", description: "", address: "", city: "", country: "", phone: "", website: "" });

  // coffee program form
  const [cp, setCp] = useState<{
    beanOrigins: string[]; brewingMethods: string[]; equipment: { name: string; type: string }[];
    waterFiltration: string; milkOptions: string[]; signatureDrinks: { name: string; description: string }[];
    roastPolicy: string; roastsInHouse: boolean; daysFromRoast: string;
  }>({
    beanOrigins: [], brewingMethods: [], equipment: [], waterFiltration: "",
    milkOptions: [], signatureDrinks: [], roastPolicy: "", roastsInHouse: false, daysFromRoast: "",
  });

  // temp inputs
  const [newOrigin, setNewOrigin] = useState("");
  const [newMethod, setNewMethod] = useState("");
  const [newMilk, setNewMilk] = useState("");
  const [newEquip, setNewEquip] = useState({ name: "", type: "" });
  const [newDrink, setNewDrink] = useState({ name: "", description: "" });

  useEffect(() => {
    if (full) {
      setInfo({ name: full.name, description: full.description ?? "", address: full.address, city: full.city, country: full.country, phone: "", website: "" });
      if (full.coffeeProgram) {
        const p = full.coffeeProgram;
        setCp({
          beanOrigins: p.beanOrigins, brewingMethods: p.brewingMethods,
          equipment: p.equipment, waterFiltration: p.waterFiltration ?? "",
          milkOptions: p.milkOptions, signatureDrinks: p.signatureDrinks,
          roastPolicy: p.roastPolicy ?? "", roastsInHouse: p.roastsInHouse,
          daysFromRoast: p.daysFromRoast?.toString() ?? "",
        });
      }
    }
  }, [full]);

  if (!user || (user.role !== "OWNER" && user.role !== "ADMIN")) {
    return <div className="text-center py-20 text-text-muted">Only owners can access this page.</div>;
  }

  if (isLoading) return <div className="max-w-3xl mx-auto px-4 py-8"><ProfileSkeleton /></div>;

  if (!myEst) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="font-display text-2xl mb-4">{t.ownerDashboard}</h1>
        <p className="text-text-muted mb-6">You don't have an establishment yet. Claim one or add a new place.</p>
        <Link to="/add-place" className="btn-primary">{t.addPlace}</Link>
      </div>
    );
  }

  const saveInfo = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      await api.patch(`/establishments/${myEst.id}`, info);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setSaving(false); }
  };

  const saveCoffeeProgram = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      await updateCP.mutateAsync({
        estId: myEst.id,
        data: {
          ...cp,
          daysFromRoast: cp.daysFromRoast ? parseInt(cp.daysFromRoast) : undefined,
          waterFiltration: cp.waterFiltration || undefined,
          roastPolicy: cp.roastPolicy || undefined,
        } as Partial<CoffeeProgram>,
      });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setSaving(false); }
  };

  const addToList = (key: "beanOrigins" | "brewingMethods" | "milkOptions", val: string, clear: () => void) => {
    if (!val.trim()) return;
    setCp((p) => ({ ...p, [key]: [...p[key], val.trim()] }));
    clear();
  };

  const removeFromList = (key: "beanOrigins" | "brewingMethods" | "milkOptions", idx: number) => {
    setCp((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">{t.ownerDashboard}</h1>
        <Link to={`/establishment/${myEst.id}`} className="text-brand-500 hover:text-brand-300 text-sm">{t.viewFullProfile} →</Link>
      </div>

      {/* tabs */}
      <div className="flex gap-2 mb-6">
        {(["info", "coffee", "photos"] as const).map((k) => (
          <button key={k} onClick={() => setTab(k)} className={`text-sm py-2 px-4 rounded-sm transition-colors ${tab === k ? "bg-brand-500 text-bg" : "bg-surface-alt text-text-muted"}`}>
            {k === "info" ? t.editInfo : k === "coffee" ? t.editCoffeeProgram : t.photos}
          </button>
        ))}
      </div>

      {error && <p className="text-error text-sm bg-error/10 border border-error/20 rounded-sm px-3 py-2 mb-4">{error}</p>}
      {saved && <p className="text-success text-sm bg-success/10 border border-success/20 rounded-sm px-3 py-2 mb-4">{t.changesSaved}</p>}

      {/* ⁘[ INFO TAB ]⁘ */}
      {tab === "info" && (
        <div className="space-y-4">
          <input placeholder={t.placeName} value={info.name} onChange={(e) => setInfo((f) => ({ ...f, name: e.target.value }))} className="input" />
          <textarea placeholder={t.placeDesc} value={info.description} onChange={(e) => setInfo((f) => ({ ...f, description: e.target.value }))} className="input min-h-[80px] resize-y" />
          <input placeholder={t.address} value={info.address} onChange={(e) => setInfo((f) => ({ ...f, address: e.target.value }))} className="input" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder={t.city} value={info.city} onChange={(e) => setInfo((f) => ({ ...f, city: e.target.value }))} className="input" />
            <input placeholder={t.country} value={info.country} onChange={(e) => setInfo((f) => ({ ...f, country: e.target.value }))} className="input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder={t.phone} value={info.phone} onChange={(e) => setInfo((f) => ({ ...f, phone: e.target.value }))} className="input" />
            <input placeholder={t.website} value={info.website} onChange={(e) => setInfo((f) => ({ ...f, website: e.target.value }))} className="input" />
          </div>
          <button onClick={saveInfo} disabled={saving} className="btn-primary">{saving ? t.savingChanges : t.editInfo}</button>
        </div>
      )}

      {/* ⁘[ COFFEE PROGRAM TAB ]⁘ */}
      {tab === "coffee" && (
        <div className="space-y-6">
          {/* bean origins */}
          <ListEditor label={t.beanOrigins} items={cp.beanOrigins} placeholder={t.addOrigin} value={newOrigin} onChange={setNewOrigin}
            onAdd={() => addToList("beanOrigins", newOrigin, () => setNewOrigin(""))}
            onRemove={(i) => removeFromList("beanOrigins", i)} t={t} />

          {/* brewing methods */}
          <ListEditor label={t.brewingMethods} items={cp.brewingMethods} placeholder={t.addMethod} value={newMethod} onChange={setNewMethod}
            onAdd={() => addToList("brewingMethods", newMethod, () => setNewMethod(""))}
            onRemove={(i) => removeFromList("brewingMethods", i)} t={t} />

          {/* milk options */}
          <ListEditor label={t.milkOptions} items={cp.milkOptions} placeholder={t.addMilk} value={newMilk} onChange={setNewMilk}
            onAdd={() => addToList("milkOptions", newMilk, () => setNewMilk(""))}
            onRemove={(i) => removeFromList("milkOptions", i)} t={t} />

          {/* equipment */}
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{t.equipment}</p>
            {cp.equipment.map((e, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <span className="text-sm text-text-primary flex-1">{e.name} <span className="text-text-muted">({e.type})</span></span>
                <button onClick={() => setCp((p) => ({ ...p, equipment: p.equipment.filter((_, j) => j !== i) }))} className="text-error text-xs">{t.remove}</button>
              </div>
            ))}
            <div className="flex gap-2">
              <input placeholder={t.equipmentName} value={newEquip.name} onChange={(e) => setNewEquip((f) => ({ ...f, name: e.target.value }))} className="input text-sm flex-1" />
              <input placeholder={t.equipmentType} value={newEquip.type} onChange={(e) => setNewEquip((f) => ({ ...f, type: e.target.value }))} className="input text-sm w-32" />
              <button onClick={() => { if (newEquip.name) { setCp((p) => ({ ...p, equipment: [...p.equipment, newEquip] })); setNewEquip({ name: "", type: "" }); } }} className="btn-secondary text-sm py-2 px-3">{t.add}</button>
            </div>
          </div>

          {/* signature drinks */}
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{t.signatureDrinks}</p>
            {cp.signatureDrinks.map((d, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <span className="text-sm text-brand-300 flex-1">{d.name} <span className="text-text-muted text-xs">— {d.description}</span></span>
                <button onClick={() => setCp((p) => ({ ...p, signatureDrinks: p.signatureDrinks.filter((_, j) => j !== i) }))} className="text-error text-xs">{t.remove}</button>
              </div>
            ))}
            <div className="flex gap-2">
              <input placeholder={t.drinkName} value={newDrink.name} onChange={(e) => setNewDrink((f) => ({ ...f, name: e.target.value }))} className="input text-sm flex-1" />
              <input placeholder={t.drinkDescription} value={newDrink.description} onChange={(e) => setNewDrink((f) => ({ ...f, description: e.target.value }))} className="input text-sm flex-1" />
              <button onClick={() => { if (newDrink.name) { setCp((p) => ({ ...p, signatureDrinks: [...p.signatureDrinks, newDrink] })); setNewDrink({ name: "", description: "" }); } }} className="btn-secondary text-sm py-2 px-3">{t.add}</button>
            </div>
          </div>

          {/* other fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{t.waterFiltration}</p>
              <input value={cp.waterFiltration} onChange={(e) => setCp((p) => ({ ...p, waterFiltration: e.target.value }))} className="input text-sm" />
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{t.roastPolicy}</p>
              <input value={cp.roastPolicy} onChange={(e) => setCp((p) => ({ ...p, roastPolicy: e.target.value }))} className="input text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
              <input type="checkbox" checked={cp.roastsInHouse} onChange={(e) => setCp((p) => ({ ...p, roastsInHouse: e.target.checked }))} className="accent-brand-500" />
              {t.roastsInHouse}
            </label>
            <input placeholder={t.daysFromRoast} value={cp.daysFromRoast} onChange={(e) => setCp((p) => ({ ...p, daysFromRoast: e.target.value }))} className="input text-sm w-32" type="number" />
          </div>

          <button onClick={saveCoffeeProgram} disabled={saving} className="btn-primary w-full">{saving ? t.savingChanges : t.editCoffeeProgram}</button>
        </div>
      )}

      {/* ⁘[ PHOTOS TAB ]⁘ */}
      {tab === "photos" && (
        <div className="text-center py-12 text-text-muted">
          <p className="text-lg mb-2">Photo management coming soon</p>
          <p className="text-sm">Upload and manage your establishment photos</p>
        </div>
      )}
    </div>
  );
}

// ⁘[ LIST EDITOR HELPER ]⁘

function ListEditor({ label, items, placeholder, value, onChange, onAdd, onRemove, t }: {
  label: string; items: string[]; placeholder: string; value: string;
  onChange: (v: string) => void; onAdd: () => void; onRemove: (i: number) => void;
  t: { add: string; remove: string };
}) {
  return (
    <div>
      <p className="text-text-muted text-xs uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item, i) => (
          <span key={i} className="badge-brand text-[10px] flex items-center gap-1">
            {item}
            <button onClick={() => onRemove(i)} className="text-error/70 hover:text-error ml-1">&times;</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }}
          className="input text-sm flex-1" />
        <button onClick={onAdd} className="btn-secondary text-sm py-2 px-3">{t.add}</button>
      </div>
    </div>
  );
}
