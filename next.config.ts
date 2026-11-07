import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 404 para URLs fora de /pt e /en (ex.: arquivos inexistentes), já que o layout raiz é /[lang].
  experimental: { globalNotFound: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
