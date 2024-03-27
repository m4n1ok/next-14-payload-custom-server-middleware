import type { GeneratedTypes } from "payload";
import type { Options } from "payload/dist/collections/operations/local/find";

import { getPayloadClient } from "@/getPayload";
import { defaultLocale } from "@/i18n";
import { cache } from "react";

type Collection = keyof GeneratedTypes["collections"];

interface IFetchOpts extends Omit<Options<Collection>, "collection"> {}

const fetchDocs = cache(async <T extends Collection>(collection: T, opts?: IFetchOpts) => {
    const payload = await getPayloadClient();

    return (
        (await payload.find({
            ...opts,
            collection,
            locale: opts?.locale || defaultLocale,
            where: {
                ...opts?.where,
                _status: {
                    equals: opts?.draft ? "draft" : "published",
                },
            },
        })) || []
    );
});

export default fetchDocs;
