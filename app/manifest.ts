import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Curio — учись чему угодно",
    short_name: "Curio",
    description: "Превратит любую тему в персональный курс с упражнениями. Как Duolingo, только для всего.",
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
