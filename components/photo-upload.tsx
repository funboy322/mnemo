"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useUserId } from "./user-provider";
import { useT, useLocale } from "./locale-provider";
import { Button } from "./ui/button";
import { Loader2, Camera, X, Sparkles, ImageIcon } from "lucide-react";
import type { Language } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { prefetchFirstLesson } from "@/lib/prefetch";
import { StreamingPreview } from "./streaming-preview";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function PhotoUpload() {
  const router = useRouter();
  const userId = useUserId();
  const t = useT();
  const locale = useLocale();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cameraRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [hint, setHint] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  async function handleFile(f: File) {
    setError(null);
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError("Image must be JPEG, PNG, WebP or GIF");
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError(`Image too large — max ${Math.round(MAX_FILE_BYTES / 1024 / 1024)} MB`);
      return;
    }
    setFile(f);
    setPreview(await fileToDataUrl(f));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !userId) return;
    setError(null);
    setLoading(true);
    try {
      const imageDataUrl = preview ?? (await fileToDataUrl(file));
      const res = await fetch("/api/courses/from-image", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId,
          imageDataUrl,
          language: locale as Language,
          level: "beginner",
          depth: 5,
          userHint: hint.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.courseId) {
        throw new Error(data.message || data.error || "Generation failed");
      }
      // Warm lesson 1 in background so first click on Start is instant
      prefetchFirstLesson(data.courseId);
      router.push(`/course/${data.courseId}`);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setError(null);
    setHint("");
    if (inputRef.current) inputRef.current.value = "";
  }

  // While Gemma 4 is reading the photo, show the same staged-loading UI as
  // the text-course generation flow. Looks consistent and gives the user
  // real feedback during the 30-60s wait.
  if (loading) {
    return (
      <div className="space-y-4">
        <StreamingPreview
          topic="your photo"
          depth={5}
          partial={null}
          done={false}
          error={null}
        />
        <p className="text-xs text-zinc-500 text-center">
          Gemma 4's vision is reading the image. Don't close this tab.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />
      {/* Mobile-only direct-to-camera input. `capture="environment"` opens
          the rear camera on iOS/Android. Hidden on desktop where the regular
          file picker is the right affordance. */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />

      {!preview ? (
        <div className="space-y-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) void handleFile(f);
            }}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            className={cn(
              "w-full rounded-card border-2 border-dashed p-8 sm:p-14 text-center transition-all bg-white cursor-pointer",
              dragOver
                ? "border-brand-500 bg-brand-50"
                : "border-zinc-300 hover:border-brand-300",
            )}
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 mb-4">
              <ImageIcon className="h-7 w-7" />
            </div>
            <p className="font-bold text-zinc-900 text-base sm:text-lg">
              Drop a photo, or tap to choose
            </p>
            <p className="text-sm text-zinc-500 mt-2 leading-relaxed max-w-md mx-auto">
              Textbook page, diagram, chart, object — Gemma 4 reads it and builds a course
              grounded in what's there.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-400 font-bold">
              <Camera className="h-3.5 w-3.5" />
              JPEG · PNG · WebP up to 8 MB
            </div>
          </div>

          {/* Mobile-only direct camera button — clearer affordance on phones */}
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="sm:hidden w-full h-12 rounded-2xl bg-zinc-900 text-white font-bold inline-flex items-center justify-center gap-2 active:bg-zinc-800 transition-colors btn-3d"
          >
            <Camera className="h-5 w-5" />
            Use camera
          </button>
        </div>
      ) : (
        <div className="rounded-card bg-white border-2 border-zinc-200 p-4 sm:p-5 shadow-sm">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Selected"
              className="w-full max-h-80 object-contain rounded-2xl bg-zinc-50"
            />
            {!loading && (
              <button
                type="button"
                onClick={reset}
                className="absolute top-2 right-2 h-9 w-9 rounded-full bg-zinc-900/70 text-white flex items-center justify-center hover:bg-zinc-900 transition-colors"
                aria-label="Remove photo"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-wider font-bold text-zinc-400 mb-1.5 px-1">
              Optional hint
            </p>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="e.g. focus on the diagram, ignore the page number"
              disabled={loading}
              maxLength={200}
              className="w-full h-11 px-4 rounded-xl border-2 border-zinc-200 bg-white text-zinc-900 text-sm placeholder:text-zinc-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-200/50 focus:outline-none transition-all"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 font-medium animate-shake">{error}</div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={loading || !file || !userId}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Gemma 4 is reading your photo...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Build course from photo
          </>
        )}
      </Button>

      {loading && (
        <p className="text-sm text-zinc-500 text-center animate-pulse">
          Multimodal generation takes 15–40 seconds.
        </p>
      )}
    </form>
  );
}
