import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph + Twitter card image. Renders at request time, cached at the
 * edge. Used by social media unfurls and the Kaggle submission cover.
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
          background: "linear-gradient(135deg, #0a7c47 0%, #12b76a 50%, #32d583 100%)",
          padding: "80px",
          color: "white",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative giant emoji watermark */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-80px",
            fontSize: "560px",
            lineHeight: 1,
            opacity: 0.08,
          }}
        >
          🧠
        </div>

        {/* Brand wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "white",
              color: "#12b76a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "44px",
              fontWeight: 900,
              fontStyle: "italic",
              lineHeight: 1,
            }}
          >
            M
          </div>
          <div
            style={{
              fontSize: "52px",
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
            fontSize: "92px",
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>Learn anything.</div>
          <div style={{ color: "#a6f4c5", marginTop: "8px" }}>From text or a photo.</div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "26px",
            fontWeight: 700,
            opacity: 0.95,
            zIndex: 2,
          }}
        >
          <div
            style={{
              padding: "10px 20px",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.18)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              fontSize: "22px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Powered by Gemma 4
          </div>
          <div style={{ opacity: 0.8 }}>· Open-weights · Apache 2.0</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
