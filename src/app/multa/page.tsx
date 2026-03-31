import { MultaForm } from "@/components/form/MultaForm";
import { BackButton } from "@/components/ui/BackButton";
import { Link } from "lucide-react";

export default function MultaPage() {
  return (
    <main
      className="min-h-screen px-4 py-12"
      style={{ backgroundColor: "#030d08" }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <BackButton />
        </div>
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-6 inline-block text-xl font-bold text-white"
          >
            Recurre<span style={{ color: "#00c853" }}>Ya</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Analiza tu multa</h1>
          <p className="mt-2 text-sm text-slate-400">
            El análisis previo es gratuito · Solo pagas si decides recurrir
          </p>
        </div>
        <MultaForm />
      </div>
    </main>
  );
}
