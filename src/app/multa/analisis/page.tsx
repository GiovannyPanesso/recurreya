import { Suspense } from "react";
import { AnalisisContent } from "@/components/form/AnalisisContent";
import { Link, Loader2 } from "lucide-react";

export default function AnalisisPage() {
  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{ backgroundColor: "#030d08" }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-6 inline-block text-xl font-bold text-white"
          >
            RecurreYa
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center gap-4 py-24">
              <Loader2 size={40} className="animate-spin text-blue-500" />
              <p className="text-slate-400">Cargando...</p>
            </div>
          }
        >
          <AnalisisContent />
        </Suspense>
      </div>
    </main>
  );
}
