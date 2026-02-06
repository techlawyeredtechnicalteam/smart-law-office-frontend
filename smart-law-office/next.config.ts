/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      }
    ]
  },
  compiler: {
    styledComponents: true
  },
  transpilePackages: ["@sanity/vision", "sanity"]
};

export default nextConfig;

// // import type { NextConfig } from "next";
// /**
//  * @type {import('next').NextConfig}
//  */

// const nextConfig = {
//   /* config options here */
//   images: {
//     domains: ["cdn.sanity.io"]
//   },
//   compiler: {
//     styledComponents: true,
//   },
//   // output: "export"
//   // images: {
//   //   loader: "custom"
//   //   // loaderFile: "./my-loader.ts"
//   // }
// };

// export default nextConfig;
