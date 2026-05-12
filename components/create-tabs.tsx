"use client";
import * as React from "react";
import { Sparkles, Camera } from "lucide-react";
import { TopicForm } from "./topic-form";
import { PhotoUpload } from "./photo-upload";
import { useT } from "./locale-provider";
import { cn } from "@/lib/utils";

type Tab = "topic" | "photo";

export function CreateTabs() {
  const t = useT();
  const [tab, setTab] = React.useState<Tab>("topic");

  return (
    <div>
      <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-zinc-100 max-w-sm mx-auto mb-6">
        <TabButton current={tab} value="topic" onClick={setTab} icon={<Sparkles className="h-4 w-4" />}>
          From topic
        </TabButton>
        <TabButton current={tab} value="photo" onClick={setTab} icon={<Camera className="h-4 w-4" />} badge={t.fromPhotoTabBadge}>
          From photo
        </TabButton>
      </div>

      {tab === "topic" ? <TopicForm /> : <PhotoUpload />}
    </div>
  );
}

function TabButton({
  current,
  value,
  onClick,
  icon,
  children,
  badge,
}: {
  current: Tab;
  value: Tab;
  onClick: (v: Tab) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  badge?: string;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={cn(
        "relative flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold transition-all",
        active ? "bg-white text-brand-700 shadow-sm" : "text-zinc-500 hover:text-zinc-700",
      )}
    >
      {icon}
      {children}
      {badge && (
        <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-brand-500 text-white rounded-full leading-none">
          {badge}
        </span>
      )}
    </button>
  );
}
