import { ResultadoContent } from "@/components/form/ResultadoContent";
import { Link } from "lucide-react";

export default function ResultadoPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-6 inline-block text-xl font-bold text-white"
          >
            RecurreYa
          </Link>
        </div>
        <ResultadoContent />
      </div>
    </main>
  );
}
