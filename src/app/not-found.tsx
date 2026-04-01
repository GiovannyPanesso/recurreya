import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: "#030d08" }}
    >
      <div className="max-w-md">
        <div className="mb-6 text-8xl font-bold" style={{ color: "#00c853" }}>
          404
        </div>
        <h1 className="mb-4 text-2xl font-bold text-white">
          Página no encontrada
        </h1>
        <p className="mb-8 text-slate-400">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition"
          style={{ backgroundColor: "#00c853", color: "#030d08" }}
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
