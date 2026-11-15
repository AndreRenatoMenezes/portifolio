import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Andre Renato Silva Braga de Menezes — Portfólio",
    short_name: "Andre",
    description: "Portfólio de Andre Renato Silva Braga de Menezes, Endpoint Engineer.",
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
