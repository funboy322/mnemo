import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Kaggle submission thumbnail — Quiet "before / after" variant (560×280).
 *
 * Left: textbook page mock (warm cream, ink lines). Middle: a small
 * mono caps "gemma 4 →" tag as the visual hinge. Right: a course path
 * mock with flat lesson circles. Bottom: line-art knot mark + wordmark
 * + mono caps subtitle.
 *
 * Quiet rules followed: one accent color (green), 1px rule borders, no
 * shadows, no emojis, no icons.
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
          background: "#fbfaf6",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Main split row */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "26px 28px 0",
            gap: "12px",
          }}
        >
          {/* LEFT — textbook page mock */}
          <div
            style={{
              width: "180px",
              height: "180px",
              background: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #ebe6dc",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "9.5px",
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#9a948a",
                display: "flex",
              }}
            >
              Chapter 4
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#16140f",
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
                display: "flex",
              }}
            >
              Photosynthesis
            </div>
            {/* Inline diagram block — leaf SVG */}
            <div
              style={{
                marginTop: "4px",
                height: "44px",
                background: "#e7f3ec",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" style={{ display: "flex" }}>
                <path
                  d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3c.5.12 1 .18 1.5.18C19 19.88 22 12.88 22 6.88c0 0-3-1.88-5-1.88-2 0-3.5 1-5 3z"
                  fill="#0d8a4a"
                />
              </svg>
            </div>
            {/* Paragraph lines */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
              {[100, 92, 96, 70].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: "3px",
                    width: `${w}%`,
                    background: "#ebe6dc",
                    borderRadius: "2px",
                  }}
                />
              ))}
            </div>
          </div>

          {/* MIDDLE — Gemma chip + arrow */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "10.5px",
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#0d8a4a",
                display: "flex",
              }}
            >
              Gemma 4
            </div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: 400,
                color: "#16140f",
                lineHeight: 1,
                display: "flex",
              }}
            >
              →
            </div>
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "9px",
                color: "#9a948a",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              reads · plans
            </div>
          </div>

          {/* RIGHT — course path mock */}
          <div
            style={{
              width: "210px",
              height: "180px",
              background: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #ebe6dc",
              padding: "14px 12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "9.5px",
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#9a948a",
                display: "flex",
              }}
            >
              5 lessons · beginner
            </div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#16140f",
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
                display: "flex",
              }}
            >
              Plant Energy Factory
            </div>
            {/* Lesson nodes zigzag */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
                paddingTop: "2px",
              }}
            >
              <Node state="completed" offset={-40} />
              <Node state="completed" offset={24} />
              <Node state="current" offset={-16} />
              <Node state="locked" offset={32} />
            </div>
          </div>
        </div>

        {/* Bottom: brand strip with rule divider */}
        <div
          style={{
            margin: "0 28px",
            paddingTop: "12px",
            paddingBottom: "16px",
            borderTop: "1px solid #ebe6dc",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="22" height="22" viewBox="0 0 32 32" style={{ display: "flex" }}>
              <path
                d="M 5 26 L 5 6 L 16 20 L 27 6 L 27 26"
                fill="none"
                stroke="#16140f"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="27" cy="6" r="2" fill="#0d8a4a" />
            </svg>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#16140f",
                letterSpacing: "-0.02em",
                display: "flex",
              }}
            >
              mnemo
            </div>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#0d8a4a",
                fontSize: "16px",
                marginLeft: "6px",
                display: "flex",
              }}
            >
              photograph
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#5b574e",
                fontWeight: 500,
                display: "flex",
              }}
            >
              a page. get a course.
            </span>
          </div>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#9a948a",
              display: "flex",
            }}
          >
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

function Node({
  state,
  offset,
}: {
  state: "completed" | "current" | "locked";
  offset: number;
}) {
  const fill = state === "completed" ? "#e7f3ec" : state === "current" ? "#0d8a4a" : "#fbfaf6";
  const border = state === "completed" ? "#0d8a4a" : state === "current" ? "#0d8a4a" : "#ebe6dc";
  const iconColor = state === "current" ? "#ffffff" : state === "completed" ? "#0d8a4a" : "#9a948a";
  return (
    <div
      style={{
        display: "flex",
        transform: `translateX(${offset}px)`,
      }}
    >
      <div
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "999px",
          background: fill,
          border: `1.5px solid ${border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {state === "completed" && (
          <svg width="11" height="11" viewBox="0 0 24 24" style={{ display: "flex" }}>
            <path
              d="M5 12l5 5L20 7"
              stroke={iconColor}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {state === "current" && (
          <svg width="9" height="9" viewBox="0 0 24 24" style={{ display: "flex" }}>
            <path d="M8 5v14l11-7L8 5z" fill={iconColor} />
          </svg>
        )}
        {state === "locked" && (
          <svg width="9" height="11" viewBox="0 0 16 18" style={{ display: "flex" }}>
            <path
              d="M3 7h10v9H3zM5 7V4a3 3 0 0 1 6 0v3"
              stroke={iconColor}
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
