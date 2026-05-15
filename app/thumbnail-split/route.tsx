import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Kaggle submission thumbnail — "before / after" variant (560×280).
 *
 * Tells the photo→course story in one frame:
 *   [textbook page]  →[Gemma 4]→  [course path of circular lesson nodes]
 *
 * Visit /thumbnail-split → right-click → "Save image as..." → upload to Kaggle.
 *
 * Design choices:
 * - Left card mimics a textbook page (diagonal lines = paragraph rivers,
 *   a small "diagram" rectangle, and a title bar). Conveys "real-world
 *   input" without needing an external asset URL.
 * - Right card mimics the actual app's lesson path: 4 circular nodes in
 *   a Duolingo-style zigzag with the title strip on top.
 * - Centre Gemma chip is the visual hinge — same green as the brand.
 */
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #f4faf6 0%, #e6f5ec 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Main split row — takes most of the height */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 0",
            gap: "10px",
          }}
        >
          {/* LEFT — textbook page mock */}
          <div
            style={{
              width: "190px",
              height: "180px",
              background: "white",
              borderRadius: "10px",
              border: "1.5px solid #e4e4e7",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              transform: "rotate(-2deg)",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 800, color: "#27272a", letterSpacing: "-0.01em", display: "flex" }}>
              Chapter 4 · Photosynthesis
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              <div style={{ height: "5px", width: "100%", background: "#e4e4e7", borderRadius: "2px" }} />
            </div>
            {/* Faux diagram */}
            <div
              style={{
                background: "#dcfce7",
                border: "1.5px solid #86efac",
                borderRadius: "6px",
                height: "52px",
                marginTop: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" style={{ display: "flex" }}>
                <path
                  d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3c.5.12 1 .18 1.5.18C19 19.88 22 12.88 22 6.88c0 0-3-1.88-5-1.88-2 0-3.5 1-5 3z"
                  fill="#16a34a"
                />
              </svg>
            </div>
            {/* Faux paragraph lines */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginTop: "4px" }}>
              {[100, 92, 96, 70].map((w, i) => (
                <div key={i} style={{ height: "4px", width: `${w}%`, background: "#e4e4e7", borderRadius: "2px" }} />
              ))}
            </div>
          </div>

          {/* MIDDLE — Gemma chip + arrow */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                padding: "5px 11px",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #0a7c47 0%, #12b76a 100%)",
                color: "white",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "flex",
                boxShadow: "0 4px 10px rgba(18, 183, 106, 0.35)",
              }}
            >
              Gemma 4
            </div>
            {/* Arrow */}
            <div
              style={{
                fontSize: "32px",
                fontWeight: 900,
                color: "#12b76a",
                lineHeight: 1,
                display: "flex",
              }}
            >
              →
            </div>
            <div style={{ fontSize: "9px", color: "#52525b", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", display: "flex" }}>
              reads · plans
            </div>
          </div>

          {/* RIGHT — course path mock */}
          <div
            style={{
              width: "210px",
              height: "180px",
              background: "white",
              borderRadius: "10px",
              border: "1.5px solid #e4e4e7",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              padding: "12px 10px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#0a7c47",
                letterSpacing: "-0.01em",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" style={{ display: "flex" }}>
                <path
                  d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3c.5.12 1 .18 1.5.18C19 19.88 22 12.88 22 6.88c0 0-3-1.88-5-1.88-2 0-3.5 1-5 3z"
                  fill="#16a34a"
                />
              </svg>
              Plant Energy Factory
            </div>
            {/* Lesson nodes in a Duolingo-style zigzag */}
            <div
              style={{
                flex: 1,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                paddingTop: "2px",
              }}
            >
              <LessonNode color="#facc15" offset={-44} shape="star" border="#eab308" />
              <LessonNode color="#facc15" offset={28} shape="star" border="#eab308" />
              <LessonNode color="#12b76a" offset={-20} shape="play" border="#0a7c47" current />
              <LessonNode color="#e4e4e7" offset={36} shape="lock" border="#d4d4d8" muted />
            </div>
          </div>
        </div>

        {/* Bottom brand strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 24px 14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "7px",
                background: "linear-gradient(135deg, #0a7c47 0%, #12b76a 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 900,
                fontStyle: "italic",
                lineHeight: 1,
              }}
            >
              M
            </div>
            <div style={{ fontSize: "22px", fontWeight: 900, color: "#18181b", letterSpacing: "-0.02em", display: "flex" }}>
              mnemo
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#52525b", marginLeft: "6px", display: "flex" }}>
              · Photograph any page. Get a course.
            </div>
          </div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#71717a", letterSpacing: "0.08em", textTransform: "uppercase", display: "flex" }}>
            Gemma 4 · Apache 2.0
          </div>
        </div>
      </div>
    ),
    {
      width: 560,
      height: 280,
    },
  );
}

function LessonNode({
  color,
  offset,
  shape,
  border,
  current,
  muted,
}: {
  color: string;
  offset: number;
  shape: "star" | "play" | "lock";
  border: string;
  current?: boolean;
  muted?: boolean;
}) {
  // Inline SVG icons — Satori can't always find an emoji font for ⭐/▶/🔒
  // at edge runtime (twemoji CDN fetch sometimes times out). Inline SVGs
  // render deterministically with no network dependency.
  const iconFill = muted ? "#a1a1aa" : "white";
  return (
    <div
      style={{
        display: "flex",
        transform: `translateX(${offset}px)`,
      }}
    >
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "999px",
          background: color,
          border: `2.5px solid ${border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: current ? "0 0 0 4px rgba(18, 183, 106, 0.18)" : "none",
        }}
      >
        {shape === "star" && (
          <svg width="14" height="14" viewBox="0 0 24 24" style={{ display: "flex" }}>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={iconFill}
            />
          </svg>
        )}
        {shape === "play" && (
          <svg width="12" height="12" viewBox="0 0 24 24" style={{ display: "flex", marginLeft: "2px" }}>
            <path d="M8 5v14l11-7L8 5z" fill={iconFill} />
          </svg>
        )}
        {shape === "lock" && (
          <svg width="12" height="12" viewBox="0 0 24 24" style={{ display: "flex" }}>
            <path
              d="M17 8h-1V6a4 4 0 00-8 0v2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V10a2 2 0 00-2-2zm-7-2a2 2 0 014 0v2h-4V6z"
              fill={iconFill}
            />
          </svg>
        )}
      </div>
    </div>
  );
}
