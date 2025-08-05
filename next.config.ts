/** @type {import('next').NextConfig} */



const nextConfig = {
  // reactStrictMode: true,
  experimental: {
    useCache: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.FTP_HOST,
        // both port 3001, 3000
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vumbnail.com",
        port: "",
        pathname: "/**",
      },
      // http://localhost:3000/
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: process.env.FTP_HOST,
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "nextdentist.com",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "nextdentist.com",
        port: "",
        pathname: "/**",
      },
      // https://images.doctornextgen.com/
      {
        protocol: "https",
        hostname: "images.doctornextgen.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.nextdentist.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: [
      "localhost",
      "images.nextdentist.com",
      "img.youtube.com",
      "vumbnail.com",
      "nextdentist.com",
    ],
  },
  eslint: {

    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
