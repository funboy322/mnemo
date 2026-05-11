import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mnemo — learn anything",
    short_name: "Mnemo",
    description: "Turn any topic into a personal course of bite-size lessons. Like Duolingo, for everything.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#12b76a",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    categories: ["education", "productivity"],
  };
}
