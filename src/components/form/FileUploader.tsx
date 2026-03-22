"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image, X, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { MultaSchemaType } from "@/lib/validations/multa";

interface FileUploaderProps {
  onDataExtracted: (data: Partial<MultaSchemaType>) => void;
  onSkip: () => void;
}

export function FileUploader({ onDataExtracted, onSkip }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extracted, setExtracted] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setExtracted(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDropRejected: (rejections) => {
      const reason = rejections[0]?.errors[0]?.code;
      if (reason === "file-too-large") {
        setError("El archivo no puede superar los 10MB");
      } else if (reason === "file-invalid-type") {
        setError("Solo se aceptan imágenes (JPG, PNG, WEBP) o PDF");
      } else {
        setError("Archivo no válido");
      }
    },
  });

  const handleExtract = async () => {
    if (!file) return;
    setIsExtracting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/extraer", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al procesar el archivo");
      }

      const data = await res.json();
      setExtracted(true);
      onDataExtracted(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    setExtracted(false);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      {!file && (
        <div
          {...getRootProps()}
          className={cn(
            "cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition",
            isDragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-white/10 hover:border-white/20 hover:bg-white/3",
          )}
        >
          <input {...getInputProps()} />
          <Upload size={32} className="mx-auto mb-3 text-slate-500" />
          <p className="text-sm font-medium text-slate-300">
            {isDragActive
              ? "Suelta el archivo aquí"
              : "Arrastra tu multa aquí o haz clic para seleccionar"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            JPG, PNG, WEBP o PDF · Máximo 10MB
          </p>
        </div>
      )}

      {/* Archivo seleccionado */}
      {file && (
        <div className="rounded-xl border border-white/10 bg-white/3 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              {file.type === "application/pdf" ? (
                <FileText size={20} />
              ) : (
                <Image size={20} />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-white">
                {file.name}
              </p>
              <p className="text-xs text-slate-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {!isExtracting && !extracted && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-slate-500 transition hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {extracted && (
            <div className="mt-3 rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-400">
              ✓ Datos extraídos correctamente. Revisa el formulario.
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Acciones */}
      <div className="flex gap-3">
        {file && !extracted && (
          <button
            type="button"
            onClick={handleExtract}
            disabled={isExtracting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Extrayendo datos...
              </>
            ) : (
              <>
                <Upload size={16} />
                Extraer datos automáticamente
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onSkip}
          className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-400 transition hover:border-white/20 hover:text-white"
        >
          {extracted ? "Continuar" : "Rellenar manualmente"}
        </button>
      </div>
    </div>
  );
}
