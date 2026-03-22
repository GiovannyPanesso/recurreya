import { Link } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link href="/" className="text-xl font-bold text-white">
            Recurre<span className="text-blue-500">Ya</span>
          </Link>
        </div>
        <div className="prose prose-invert max-w-none">{children}</div>
      </div>
    </main>
  );
}
