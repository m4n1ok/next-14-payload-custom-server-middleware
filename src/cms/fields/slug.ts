import { SlugField } from "@nouance/payload-better-fields-plugin";

interface ISlugFieldOpts {
    useFields?: string[];
}

export const slugField = (opts?: ISlugFieldOpts) => {
    return SlugField(
        {
            name: "slug",
            admin: {
                position: "sidebar",
            },
            localized: true,
        },
        {
            useFields: opts?.useFields || ["title"],
        },
    );
};
