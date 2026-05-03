"use client";
import Link from "next/link";
import { HeartCrack, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useT } from "../locale-provider";

export function OutOfHearts({ courseId, onRetry }: { courseId: string; onRetry: () => void }) {
  const t = useT();
  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-md w-full text-center animate-pop">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-red-100 mb-4">
          <HeartCrack className="h-14 w-14 text-red-500" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900">{t.outOfHeartsTitle}</h1>
        <p className="text-zinc-600 mt-2">{t.outOfHeartsBody}</p>

        <Button onClick={onRetry} size="lg" className="w-full mt-8">
          <RotateCcw className="h-5 w-5" />
          {t.retryLesson}
        </Button>
        <Button asChild variant="outline" size="md" className="w-full mt-3">
          <Link href={`/course/${courseId}`}>{t.backToCourse}</Link>
        </Button>
      </div>
    </div>
  );
}
