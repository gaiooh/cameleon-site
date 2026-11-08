import type { NextConfig } from "next";

// No GitHub Pages o site fica em "usuario.github.io/cameleon-site", então todos os
// endereços precisam começar com "/cameleon-site". Essa variável só existe no build
// do GitHub (veja .github/workflows/pages.yml); no seu PC o site continua em "/".
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // "export" gera uma pasta "out" só com HTML/CSS/JS prontos, que é o que o
  // GitHub Pages consegue hospedar (ele não roda servidor).
  output: "export",
  basePath,
  // A otimização de imagens do Next precisa de servidor; no site estático a
  // imagem é entregue como está.
  images: { unoptimized: true },
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
