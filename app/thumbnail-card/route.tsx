import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Kaggle submission card thumbnail (560×280, 2:1 ratio).
 *
 * Visit /thumbnail-card → right-click → "Save image as..." → upload to Kaggle.
 *
 * Variant 1: wordmark + tagline + Gemma badge on the same green gradient as
 * the OG image. Clean and brand-forward. For "what is this product" judges
 * can absorb in <1 second.
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
          background: "linear-gradient(135deg, #0a7c47 0%, #12b76a 50%, #32d583 100%)",
          padding: "36px 44px",
          color: "white",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative SVG watermark — inline so we never hit emoji-CDN
            timeouts at edge render time. */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "-30px",
            display: "flex",
            opacity: 0.12,
          }}
        >
          <svg width="240" height="240" viewBox="0 0 24 24" style={{ display: "flex" }}>
            <path
              d="M13 3a3 3 0 013 3v.17A3 3 0 0118 9v1a3 3 0 011.5 5.2A3 3 0 0117 19a3 3 0 01-4 1.83A3 3 0 017 19a3 3 0 01-2.5-3.8A3 3 0 016 10V9a3 3 0 012-2.83V6a3 3 0 013-3h2zm-1 4a1 1 0 100 2 1 1 0 000-2zm-2 4a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z"
              fill="white"
            />
          </svg>
        </div>

        {/* Brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "9px",
              background: "white",
              color: "#12b76a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 900,
              fontStyle: "italic",
              lineHeight: 1,
            }}
          >
            M
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}
          >
            mnemo
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            marginTop: "auto",
            fontSize: "44px",
            fontWeight: 900,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>Learn anything.</div>
          <div style={{ color: "#a6f4c5", marginTop: "4px" }}>From text or a photo.</div>
        </div>

        {/* Footer badge */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 2,
          }}
        >
          <div
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.18)",
              border: "2px solid rgba(255, 255, 255, 0.32)",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Powered by Gemma 4
          </div>
          <div style={{ fontSize: "13px", opacity: 0.85, fontWeight: 600, display: "flex" }}>
            · Open-weights · Apache 2.0
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
