"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";

const MUNICIPIOS_ESPANA = [
  "A Coruña",
  "Albacete",
  "Alcalá de Henares",
  "Alcorcón",
  "Algeciras",
  "Alicante",
  "Almería",
  "Badajoz",
  "Badalona",
  "Barcelona",
  "Bilbao",
  "Burgos",
  "Cádiz",
  "Cartagena",
  "Castellón de la Plana",
  "Córdoba",
  "Elche",
  "Fuenlabrada",
  "Getafe",
  "Gijón",
  "Granada",
  "Hospitalet de Llobregat",
  "Huelva",
  "Jaén",
  "Jerez de la Frontera",
  "Las Palmas de Gran Canaria",
  "Leganés",
  "León",
  "Lleida",
  "Logroño",
  "Lugo",
  "Madrid",
  "Málaga",
  "Marbella",
  "Móstoles",
  "Murcia",
  "Oviedo",
  "Palma",
  "Pamplona",
  "Sabadell",
  "Salamanca",
  "San Sebastián",
  "Santa Cruz de Tenerife",
  "Santander",
  "Sevilla",
  "Tarragona",
  "Terrassa",
  "Toledo",
  "Valencia",
  "Valladolid",
  "Vigo",
  "Vitoria-Gasteiz",
  "Zaragoza",
];

interface MunicipioSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function MunicipioSelect({
  value,
  onChange,
  error,
}: MunicipioSelectProps) {
  const [query, setQuery] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = MUNICIPIOS_ESPANA.filter((m) =>
    m.toLowerCase().includes(query.toLowerCase()),
  ).slice(0, 8);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Primera letra mayúscula automática
    const formatted = val.charAt(0).toUpperCase() + val.slice(1);
    setQuery(formatted);
    onChange(formatted);
    setOpen(true);
  };

  const handleSelect = (municipio: string) => {
    setQuery(municipio);
    onChange(municipio);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInput}
        onFocus={() => setOpen(query.length > 0)}
        placeholder="Ej: Madrid, Barcelona..."
        className={cn(
          "w-full rounded-lg border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition",
          "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          error ? "border-red-500" : "border-white/10",
        )}
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-[#0d1530] shadow-lg">
          {filtered.map((municipio) => (
            <button
              key={municipio}
              type="button"
              onClick={() => handleSelect(municipio)}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white first:rounded-t-lg last:rounded-b-lg"
            >
              {municipio}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
