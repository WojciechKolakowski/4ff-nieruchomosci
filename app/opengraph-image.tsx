import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(120deg, #36442b 0%, #3a4127 48%, #4a5b3a 100%)",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#c9a227", marginBottom: 24 }}>
          BIURO NIERUCHOMOŚCI PABIANICE
        </div>
        <div style={{ display: "flex", fontSize: 78, color: "#f7f2e6", lineHeight: 1.1, maxWidth: 900 }}>
          4FF Nieruchomości
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#efe8d6", marginTop: 28, maxWidth: 820 }}>
          Twój dom, Twoja swoboda, nasza odpowiedzialność
        </div>
      </div>
    ),
    { ...size }
  );
}
