import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "André Menezes — Portfólio",
    short_name: "André",
    description: "Portfólio de André Menezes, Endpoint Engineer.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d1430",
    theme_color: "#0d1430",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
