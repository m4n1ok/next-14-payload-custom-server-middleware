import type { AfterChangeHook } from "payload/dist/collections/config/types";
import type { CollectionConfig, Field, Tab } from "payload/types";

import { slugField } from "@cms/fields/slug";

interface IBaseCollection {
    config?: Partial<CollectionConfig>;
    contentFields?: Field[];
    frontendParentPath?: string;
    frontendParentPathUseCollectionSlug?: boolean;
    heroFields?: Field[];
    sidebarFields?: Field[];
    slug: string;
    slugFields?: string[];
    tabs?: Tab[];
}

/**
 * BaseCollection
 *
 * Used to create others collections
 * Define different tabs for the admin panel and default fields (title, shortDescription, slug)
 *
 * @param opts
 * @constructor
 */
const BaseCollection = (opts: IBaseCollection): CollectionConfig => {
    const revalidateHook: AfterChangeHook = ({ doc, req: { payload } }) => {
        if (doc._status === "published") {
            // TODO: Implement revalidation based on path?
            // revalidate({ slug: doc.slug, collection: opts.slug, payload }).catch(error => {
            //     payload.logger.error("Failed to revalidate collection", error);
            // });
        }
        return doc;
    };

    const tabs: Tab[] = [
        {
            fields: [
                {
                    name: "title",
                    type: "text",
                    label: "Title",
                    localized: true,
                    required: true,
                },
                {
                    name: "pageTitle",
                    type: "text",
                    label: "Page title",
                    localized: true,
                },
                {
                    name: "shortDescription",
                    type: "textarea",
                    label: "Short description",
                    localized: true,
                },
                ...(opts.heroFields || []),
            ],
            label: "Hero",
        },
    ];
    if (opts.contentFields) {
        tabs.push({
            fields: opts.contentFields,
            label: "Content",
        });
    }

    const sidebarFields = (opts.sidebarFields || []).map(field => {
        field.admin = {
            ...field.admin,
            position: "sidebar",
        };
        return field;
    });

    const getItemUrl = (data: Record<string, any>, opts: IBaseCollection, localePrefix: string) => {
        if (opts.frontendParentPath ?? false) {
            return localePrefix + `/${opts.frontendParentPath}/${data.slug}`;
        }

        if (opts.frontendParentPathUseCollectionSlug ?? false) {
            return localePrefix + `/${opts.slug}/${data.slug}`;
        }

        return localePrefix + `/${data.slug}`;
    };

    const getPreviewUrl = (data: Record<string, any>, opts: IBaseCollection, localePrefix: string) => {
        const itemUrl = getItemUrl(data, opts, localePrefix);

        return `/next/preview?url=${itemUrl}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`;
    };

    return {
        slug: opts.slug,
        admin: {
            ...(opts.config?.admin || {}),
            livePreview: opts.config?.admin?.livePreview || {
                url: ({ data, locale }) => {
                    return getItemUrl(data, opts, `/${locale.code}`);
                },
            },
            preview:
                opts.config?.admin?.preview ||
                ((data, { locale }) => {
                    return getPreviewUrl(data, opts, `/${locale}`);
                }),
            useAsTitle: opts.config?.admin?.useAsTitle || "title",
        },
        fields: [
            {
                type: "tabs",
                tabs: [...tabs, ...(opts.tabs || [])],
            },
            // Sidebar fields
            ...slugField({ useFields: opts.slugFields }),
            ...sidebarFields,
        ],
        hooks: {
            ...(opts.config?.hooks || {}),
            afterChange: [...(opts.config?.hooks?.afterChange || []), revalidateHook],
        },
        timestamps: true,
        versions: {
            drafts: true,
        },
    };
};

export default BaseCollection;
