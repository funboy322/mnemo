import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 py-20 text-center">
      <div className="text-7xl mb-4">🤔</div>
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
        Страница не найдена
      </h1>
      <p className="mt-2 text-zinc-600 max-w-md">
        Возможно, ссылка устарела или курс удалён. Можно начать новый.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-brand-500 text-white font-bold uppercase tracking-wide btn-3d btn-3d-brand"
      >
        На главную
      </Link>
    </div>
  );
}
