import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/nasty-1",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
