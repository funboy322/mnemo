import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Kaggle submission thumbnail (560×280) — Quiet direction.
 *
 * Bone background, line-art knot mark + wordmark, italic-moment headline,
 * single mono caps footer with rule divider. Visit /thumbnail-card →
 * right-click → save → upload to Kaggle.
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
          padding: "36px 44px",
          color: "#16140f",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="34" height="34" viewBox="0 0 32 32" style={{ display: "flex" }}>
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
              fontSize: "26px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            mnemo
          </div>
        </div>

        {/* Hero with italic moment */}
        <div
          style={{
            marginTop: "auto",
            fontSize: "54px",
            fontWeight: 500,
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>Learn</div>
          <div style={{ display: "flex" }}>
            <span
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#0d8a4a",
              }}
            >
              anything.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "18px",
            paddingTop: "12px",
            borderTop: "1px solid #ebe6dc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "11px",
            fontFamily: "ui-monospace, monospace",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#9a948a",
          }}
        >
          <span style={{ display: "flex" }}>Powered by Gemma 4</span>
          <span style={{ display: "flex" }}>Apache 2.0</span>
        </div>
      </div>
    ),
    {
      width: 560,
      height: 280,
    },
  );
}
