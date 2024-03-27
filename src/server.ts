import dotenv from "dotenv";
import next from "next";
import nextBuild from "next/dist/build";
import nodemailerSendgrid from "nodemailer-sendgrid";
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

import express from "express";

import { getPayloadClient } from "./getPayload";

const app = express();
const PORT = process.env.PORT || 3000;
const BUILD_PORT = process.env.BUILD_PORT || 3003;

const sendGridAPIKey = process.env.SENDGRID_API_KEY;

const start = async (): Promise<void> => {
    const payload = await getPayloadClient({
        initOptions: {
            express: app,
            onInit: newPayload => {
                newPayload.logger.info(`Payload Admin URL: ${newPayload.getAdminURL()}`);
            },
        },
        seed: process.env.PAYLOAD_SEED === "true",
    });

    if (process.env.NEXT_BUILD) {
        app.listen(BUILD_PORT, async () => {
            payload.logger.info(`Next.js is now building...`);
            await nextBuild(path.join(__dirname, "../"), false, false, false, false, false, false, "default");
            process.exit();
        });

        return;
    }

    const nextApp = next({
        dev: process.env.NODE_ENV !== "production",
        hostname: "localhost",
        port: 3000,
    });

    const nextHandler = nextApp.getRequestHandler();

    // app.use(nextIntlMiddleware);
    app.get("*", (req, res) => nextHandler(req, res));

    await nextApp.prepare().then(() => {
        // app.use(async (req, res) => {
        //     await nextHandler(req, res);
        // });

        payload.logger.info("Next.js started");

        app.listen(PORT, () => {
            payload.logger.info(`Next.js App URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`);
        });
    });
};

start().catch(e => {
    throw new Error(e);
});
