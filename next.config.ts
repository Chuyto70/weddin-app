import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [], // Allow images from any domain since we're serving from public folder
  },
  // Enable camera permissions for camera access
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=*, microphone=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
