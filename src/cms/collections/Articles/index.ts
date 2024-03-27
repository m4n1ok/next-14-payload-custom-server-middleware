import type { CollectionConfig } from "payload/types";

import BaseCollection from "@cms/collections/BaseCollection";

const Articles: CollectionConfig = BaseCollection({
    config: {
        admin: {
            group: "Pages",
        },
    },
    slug: "articles",
    frontendParentPath: "blog",
    heroFields: [
    ],
    contentFields: [],
    sidebarFields: [
        {
            name: "publishedAt",
            type: "date",
            label: "Published At",
            required: true,
        },

    ],
});

export default Articles;
