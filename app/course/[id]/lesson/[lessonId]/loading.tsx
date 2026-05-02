export default function LessonLoading() {
  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto w-full">
      <div className="h-6 w-24 rounded-full bg-zinc-200 animate-pulse mb-6" />
      <div className="rounded-card bg-white border-2 border-zinc-200 p-6 sm:p-8">
        <div className="h-3 w-16 rounded-full bg-brand-100 animate-pulse mb-3" />
        <div className="h-8 w-2/3 rounded-lg bg-zinc-200 animate-pulse" />
        <div className="h-4 w-full rounded bg-zinc-100 animate-pulse mt-4" />
        <div className="h-4 w-5/6 rounded bg-zinc-100 animate-pulse mt-2" />
        <div className="h-12 w-full rounded-2xl bg-zinc-200 animate-pulse mt-8" />
      </div>
    </div>
  );
}
