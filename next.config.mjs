import { config } from "dotenv";

config();

const publicUrl = new URL(process.env.NEXT_PUBLIC_FE_URL || "http://localhost:3000");

/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                hostname: publicUrl.hostname,
                pathname: "/media/**",
                port: publicUrl.port || "",
                protocol: publicUrl.protocol.replace(":", ""),
            },
        ],
    },
    swcMinify: true,
    webpack: config => {
        const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.(".svg"));

        if (fileLoaderRule) {
            config.module.rules.push({
                ...fileLoaderRule,
                resourceQuery: /url/, // *.svg?url
                test: /\.svg$/i,
            });

            config.module.rules.push({
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
                test: /\.svg$/i,
                use: ["@svgr/webpack"],
            });

            fileLoaderRule.exclude = /\.svg$/i;
        }

        return config;
    },
};

export default nextConfig
