import type { Field } from "payload/types";
interface AssetFieldOpts {
    defaultType?: string;
    withAudio?: boolean;
    withCode?: boolean;
    withImage?: boolean;
    withVideo?: boolean;
}

const assetFields = (opts?: AssetFieldOpts): Field[] => {
    const options = [
        ...(opts?.withImage ?? true
            ? [
                  {
                      label: "Image",
                      value: "image",
                  },
              ]
            : []),
        ...(opts?.withVideo ?? true
            ? [
                  {
                      label: "Video",
                      value: "video",
                  },
              ]
            : []),
        ...(opts?.withAudio ?? false
            ? [
                  {
                      label: "Audio",
                      value: "audio",
                  },
              ]
            : []),
        ...(opts?.withCode ?? false
            ? [
                  {
                      label: "Code",
                      value: "code",
                  },
              ]
            : []),
    ];
    return [
        {
            name: "assetType",
            type: "radio",
            admin: {
                layout: "horizontal",
                hidden: options.length === 1,
            },
            defaultValue: opts?.defaultType || "image",
            label: "Asset type",
            options,
        },
        {
            name: "image",
            type: "upload",
            filterOptions: {
                mimeType: { contains: "image" },
            },
            label: "Image",
            relationTo: "media",
        },
        {
            name: "audio",
            type: "upload",
            admin: {
                condition: (_, siblingData) => siblingData?.assetType === "audio",
            },
            filterOptions: {
                mimeType: { contains: "audio" },
            },
            label: "Audio",
            relationTo: "media",
        },
        {
            name: "video",
            type: "upload",
            admin: {
                condition: (_, siblingData) => siblingData?.assetType === "video",
            },
            filterOptions: {
                mimeType: { contains: "video" },
            },
            label: "Video",
            relationTo: "media",
        },
        {
            name: "code",
            type: "code",
            admin: {
                language: "html",
                condition: (_, siblingData) => siblingData?.assetType === "code",
            },
            label: "Code",
        },
    ];
};

export default assetFields;
