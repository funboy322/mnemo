export default function CourseLoading() {
  return (
    <div className="px-4 sm:px-6 py-6 sm:py-10 max-w-2xl mx-auto w-full">
      <div className="h-44 rounded-card bg-zinc-100 animate-pulse mb-8" />
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-center">
            <div
              className="h-20 w-20 rounded-full bg-zinc-200 animate-pulse"
              style={{ transform: `translateX(${[0, 60, 30, -30, -60][i]}px)`, animationDelay: `${i * 80}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
