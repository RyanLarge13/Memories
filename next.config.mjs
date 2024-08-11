/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "storage.googleapis.com",
        protocol: "https",
        port: "",
        pathname: "/memory-images-bucket/*",
      },
      {
        hostname: "img.clerk.com",
        protocol: "https",
        port: "",
        pathname: "/*",
      },
    ],
  },
};

export default nextConfig;
