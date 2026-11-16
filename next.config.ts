import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Logos, banners y avatares de gdg.community.dev (Cloudinary de Bevy).
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/startup-grind/**" }],
  },
};

export default nextConfig;
