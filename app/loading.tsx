import { getServerT } from "@/lib/i18n";

export default async function Loading() {
  const t = await getServerT();
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 py-20">
      <div className="h-12 w-12 rounded-full border-4 border-zinc-200 border-t-brand-500 animate-spin" />
      <p className="mt-4 text-sm font-bold text-zinc-500 uppercase tracking-wider">{t.loadingLabel}</p>
    </div>
  );
}
