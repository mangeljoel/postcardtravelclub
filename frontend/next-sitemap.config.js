/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.SITE_URL || "https://postcard.travel",
  generateRobotsTxt: true, // (optional)
  // ...other options
};
