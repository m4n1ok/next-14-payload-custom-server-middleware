import type { GeneratedTypes } from "payload";
import type { Options } from "payload/dist/collections/operations/local/find";

import { getPayloadClient } from "@/getPayload";
import { defaultLocale, locales } from "@/i18n";
import { notFound } from "next/navigation";

type Collection = keyof GeneratedTypes["collections"];

interface IFetchOpts extends Omit<Options<Collection>, "collection"> {
    notFoundRedirect?: boolean;
}

export const fetchDocBySlug = async <T extends Collection>(collection: T, slug: string, fetchOpts?: IFetchOpts) => {
    const payload = await getPayloadClient();
    payload.logger.debug("fetchDocBySlug", { collection, slug, fetchOpts });
    const { notFoundRedirect = true, ...opts } = fetchOpts || {};

    const locale = opts?.locale ? (locales.includes(opts?.locale) ? opts?.locale : defaultLocale) : defaultLocale;

    const { docs: items } = await payload.find({
        ...(opts || {}),
        collection,
        locale,
        limit: 1,
        depth: opts.depth || 5,
        where: {
            ...opts?.where,
            slug: {
                equals: decodeURIComponent(slug),
            },
            or: [
                {
                    _status: {
                        in: "published" + (opts?.draft ? ",draft" : ""),
                    },
                },
                {
                    _status: {
                        exists: false,
                    },
                },
            ],
        },
    });

    if (!items.length && notFoundRedirect) {
        return notFound();
    }

    return items[0] || null;
};

export const fetchDocByID = async <T extends Collection>(collection: T, id: string, opts?: IFetchOpts) => {
    const payload = await getPayloadClient();
    payload.logger.debug("fetchDocByID", { collection, id, opts });
    const item = await payload.findByID({
        ...(opts || {}),
        id,
        collection,
    });

    if (!item) {
        return notFound();
    }

    return item;
};
