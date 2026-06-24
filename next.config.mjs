const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repositoryBasePath = "/ogv-riskgraph-static-demo";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: isGitHubPages ? repositoryBasePath : "",
  assetPrefix: isGitHubPages ? `${repositoryBasePath}/` : ""
};

export default nextConfig;
