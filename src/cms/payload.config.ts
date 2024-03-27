import Articles from "@cms/collections/Articles";
import Users from "@cms/collections/Users";

import {webpackBundler} from "@payloadcms/bundler-webpack";
import {mongooseAdapter} from "@payloadcms/db-mongodb";

import seoPlugin from "@payloadcms/plugin-seo";
import {lexicalEditor} from "@payloadcms/richtext-lexical";
import path from "path";
import {buildConfig} from "payload/config";
import {defaultLocale, locales} from "@/i18n";

const linkableCollections = [Articles.slug];

export default buildConfig({
    admin: {
        bundler: webpackBundler(),
        user: Users.slug,
        webpack: config => {
            return {
                ...config,
                resolve: {
                    ...(config.resolve || {}),
                    alias: {
                        ...(config.resolve?.alias ? config.resolve.alias : {}),
                        "@": path.resolve(__dirname, "../"),
                        "@cms": path.resolve(__dirname, "../cms/"),
                        "@ui": path.resolve(__dirname, "../ui/"),
                    },
                },
            };
        },
    },
    collections: [
        Articles,
        Users
    ],
    db: mongooseAdapter({
        url: process.env.DATABASE_URI ?? false,
    }),
    editor: lexicalEditor({}),
    graphQL: {
        disable: true,
    },
    localization: {
        defaultLocale,
        fallback: true,
        locales,
    },
    plugins: [
        seoPlugin({
            collections: linkableCollections,
        }),
    ],
    typescript: {
        outputFile: path.resolve(__dirname, "payload-types.ts"),
    },
});
