import type { Payload } from "payload";
import type { InitOptions } from "payload/config";

import dotenv from "dotenv";
import path from "path";
import payload from "payload";

import { seed as seedData } from "./cms/seed";

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

let cached = (global as any).payload;

if (!cached) {
    cached = (global as any).payload = { client: null, promise: null };
}

interface Args {
    initOptions?: Partial<InitOptions>;
    seed?: boolean;
}

export const getPayloadClient = async ({ initOptions, seed }: Args = {}): Promise<Payload> => {
    if (!process.env.DATABASE_URI) {
        throw new Error("DATABASE_URI environment variable is missing");
    }

    if (!process.env.PAYLOAD_SECRET) {
        throw new Error("PAYLOAD_SECRET environment variable is missing");
    }

    if (cached.client) {
        return cached.client;
    }

    if (!cached.promise) {
        cached.promise = payload.init({
            local: !initOptions?.express,
            secret: process.env.PAYLOAD_SECRET,
            ...(initOptions || {}),
        });
    }

    try {
        // process.env.PAYLOAD_DROP_DATABASE = seed ? 'true' : 'false'
        cached.client = await cached.promise;

        if (seed) {
            await seedData(payload);
        }
    } catch (e: unknown) {
        cached.promise = null;
        throw e;
    }

    return cached.client;
};
