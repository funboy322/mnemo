import Link from "next/link";
import { getServerT } from "@/lib/i18n";

export default async function NotFound() {
  const t = await getServerT();
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 py-20 text-center">
      <div className="text-7xl mb-4">🤔</div>
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
        {t.notFoundTitle}
      </h1>
      <p className="mt-2 text-zinc-600 max-w-md">{t.notFoundBody}</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-brand-500 text-white font-bold uppercase tracking-wide btn-3d btn-3d-brand"
      >
        {t.goHome}
      </Link>
    </div>
  );
}
