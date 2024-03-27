import type { Block, BlockField, Field } from "payload/types";

interface BlocksFieldOpts {
    admin?: BlockField["admin"];
    blocks: Block[];
    label?: BlockField["label"];
    labels?: BlockField["labels"];
    max?: number;
    min?: number;
    name?: string;
}

const blocks = (opts: BlocksFieldOpts): Field => ({
    name: opts.name || "blocks",
    label: opts.label || undefined,
    labels: opts.labels || undefined,
    type: "blocks",
    admin: opts.admin || {},
    blocks: opts.blocks,
    localized: false,
    maxRows: opts.max || 20,
    minRows: opts.min || 1,
});

export default blocks;
