import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph + Twitter card image — Quiet direction.
 *
 * Bone background, line-art knot mark, "Learn anything." with italic
 * "{em}anything.{/em}" in the place where Quiet wants the serif accent.
 * No gradient blob, no big watermark — restraint is the message.
 */
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fbfaf6",
          padding: "80px",
          color: "#16140f",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Brand row — line-art M + wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <svg width="68" height="68" viewBox="0 0 32 32" style={{ display: "flex" }}>
            <path
              d="M 5 26 L 5 6 L 16 20 L 27 6 L 27 26"
              fill="none"
              stroke="#16140f"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="27" cy="6" r="2.2" fill="#0d8a4a" />
          </svg>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#16140f",
            }}
          >
            mnemo
          </div>
        </div>

        {/* Hero with italic moment */}
        <div
          style={{
            marginTop: "auto",
            fontSize: "120px",
            fontWeight: 500,
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
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

        <p
          style={{
            marginTop: "24px",
            fontSize: "26px",
            color: "#5b574e",
            maxWidth: "780px",
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          Type a topic or photograph a page. Get a five-lesson course in seconds.
        </p>

        {/* Footer — single rule line + mono caps */}
        <div
          style={{
            marginTop: "40px",
            borderTop: "1px solid #ebe6dc",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "16px",
            fontFamily: "ui-monospace, monospace",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#9a948a",
          }}
        >
          <span style={{ display: "flex" }}>Powered by Gemma 4</span>
          <span style={{ display: "flex" }}>Open Weights · Apache 2.0</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
