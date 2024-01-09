/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    unoptimized: true,
  },
   eslint: {
     ignoreDuringBuilds: true,
   },
  
  // exports: "out",
  reactStrictMode: false,
  // images: {
  //   domains: ["203.129.224.92", "15.206.219.76", "122.15.104.76"],
  // },
  // devIndicators: {
  //   buildActivity: true,
  // },
  // reactStrictMode: true,
  // swcMinify: true,
};

module.exports = nextConfig;
