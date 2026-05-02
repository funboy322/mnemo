"use client";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 py-20 text-center">
      <div className="text-7xl mb-4">😬</div>
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
        Что-то пошло не так
      </h1>
      <p className="mt-2 text-zinc-600 max-w-md">
        {error.message || "Неизвестная ошибка. Попробуй ещё раз."}
      </p>
      {error.digest && (
        <p className="mt-1 text-xs text-zinc-400 font-mono">id: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-brand-500 text-white font-bold uppercase tracking-wide btn-3d btn-3d-brand"
        >
          Повторить
        </button>
        <a
          href="/"
          className="inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-white border-2 border-zinc-200 text-zinc-800 font-bold"
        >
          На главную
        </a>
      </div>
    </div>
  );
}
