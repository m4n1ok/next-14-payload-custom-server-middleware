import type { Field, GlobalConfig, Tab } from "payload/types";

interface IBaseGlobal {
    config?: Partial<GlobalConfig>;
    contentFields?: Field[];
    heroFields?: Field[];
    sidebarFields?: Field[];
    slug: string;
    tabs?: Tab[];
}

/**
 * BaseGlobal
 *
 * Used to create others globals
 * Define different tabs for the admin panel and default fields (title, shortDescription)
 *
 * @param opts
 * @constructor
 */
const BaseGlobal = (opts: IBaseGlobal): GlobalConfig => {
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

    return {
        slug: opts.slug,
        fields: [
            {
                type: "tabs",
                tabs: [...tabs, ...(opts.tabs || [])],
            },
            // Sidebar fields
            ...sidebarFields,
        ],
        hooks: {
            ...(opts.config?.hooks || {}),
        },
        versions: {
            drafts: true,
        },
        ...(opts.config || {}),
    };
};

export default BaseGlobal;
