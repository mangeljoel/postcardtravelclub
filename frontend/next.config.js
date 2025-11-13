/* eslint-disable comma-dangle */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = () => {
  return withBundleAnalyzer({
    swcMinify: false,
    images: {
      // domains: ["images.postcard.travel", "postcard.notion.site", "lh3.googleusercontent.com"],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // Allows all domains
        },
      ],
    },
  });
};
