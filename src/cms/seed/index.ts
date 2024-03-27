import type {
    Article,
    Category,
    CommunityAsset,
    Customer,
    CustomerQuote,
    Faq,
    Media,
    Page,
    Persona,
    Pricing,
    Promo,
    Tool,
    UseCase,
} from "@cms/payload-types";
import type { Payload } from "payload";

import path from "path";

const medias: Media[] = [];
const categories: Category[] = [];
const customers: Customer[] = [];
const customerQuotes: CustomerQuote[] = [];
const communityAssets: CommunityAsset[] = [];
const faqs: Faq[] = [];
const promos: Promo[] = [];
const pricing: Pricing[] = [];
const articles: Article[] = [];
const personas: Persona[] = [];
const useCases: UseCase[] = [];
const tools: Tool[] = [];
const pages: Page[] = [];

export const seed = async (payload: Payload): Promise<void> => {
    payload.logger.info("Seeding data...");

    if (process.env.PAYLOAD_SEED_DEFAULT_USERS === "true") {
        payload.logger.info("Seeding default users...");

        await payload.create<"users">({
            collection: "users",
            data: {
                email: process.env.PAYLOAD_SEED_DEFAULT_ADMIN_USER_EMAIL || "dev@elevenlabs.io",
                password: process.env.PAYLOAD_SEED_DEFAULT_ADMIN_USER_PASSWORD || "apex-dully-ride",
                role: "admin",
            },
        });

        await payload.create<"users">({
            collection: "users",
            data: {
                email: process.env.PAYLOAD_SEED_DEFAULT_MANAGER_USER_EMAIL || "dev+manager@elevenlabs.io",
                password: process.env.PAYLOAD_SEED_DEFAULT_MANAGER_USER_PASSWORD || "apex-dully-ride",
                role: "manager",
            },
        });

        await payload.create<"users">({
            collection: "users",
            data: {
                email: process.env.PAYLOAD_SEED_DEFAULT_EDITOR_USER_EMAIL || "dev+editor@elevenlabs.io",
                password: process.env.PAYLOAD_SEED_DEFAULT_EDITOR_USER_PASSWORD || "apex-dully-ride",
                role: "editor",
            },
        });

        await payload.create<"users">({
            collection: "users",
            data: {
                email: process.env.PAYLOAD_SEED_DEFAULT_VIEWER_USER_EMAIL || "dev+viewer@elevenlabs.io",
                password: process.env.PAYLOAD_SEED_DEFAULT_VIEWER_USER_PASSWORD || "apex-dully-ride",
                role: "viewer",
            },
        });
    }

    await seedPlaceholderMedias(payload);

    await seedCategories(payload, ["Customer stories", "Resources", "Product", "Safety", "Research", "Company"]);

    await seedCustomers(payload, ["RE:Anime", "Customer 2", "Customer 3", "Customer 4", "Customer 5"]);

    await seedCustomerQuotes(payload, [
        "I have found ElevenLabs extremely useful in helping me create an audio book utilizing a clone of my own voice. The clone was super easy to create using audio clips from a previous audio book I recorded.",
        "The variety of voices and the realness that expresses everything that is asked of it.",
        "I like that ElevenLabs uses cutting-edge AI and deep learning to create incredibly natural-sounding speech synthesis and text-to-speech. The voices generated are lifelike and emotive.",
        "Absolutely loving ElevenLabs for their spot-on voice generations! Their pronunciation of Bahasa Indonesia is just fantastic.",
        "The clone was super easy to create using audio clips from a previous audio book I recorded.",
    ]);

    await seedCommunityAssets(payload, ["Asset 1", "Asset 2", "Asset 3", "Asset 4", "Asset 5"]);

    // @ts-expect-error
    await seedFaqs(payload, [
        {
            question: "Question 1",
            answer: richTextExample,
        },
        {
            question: "Question 2",
            answer: richTextExample,
        },
        {
            question: "Question 3",
            answer: richTextExample,
        },
    ] as Faq[]);

    // @ts-expect-error
    await seedPromos(payload, [
        {
            title: "Promo 1",
            description: richTextExample,
            image: medias[1].id,
        },
        {
            title: "Promo 2",
            description: richTextExample,
            image: medias[1].id,
        },
        {
            title: "Promo 3",
            description: richTextExample,
            image: medias[1].id,
        },
    ] as Promo[]);

    // @ts-expect-error
    await seedPricing(payload, [
        {
            name: "Free",
            price: 0,
            currency: "$",
            priceLabel: "Forever",
            description: pricingFreeDescription,
            link: {
                url: "https://area17.com",
                type: "custom",
                label: "Sign up",
            },
        },
        {
            name: "Starter",
            label: "First month 80% off",
            price: 1,
            discountedPrice: 5,
            currency: "$",
            priceLabel: "Month",
            description: pricingStarterDescription,
            link: {
                url: "https://area17.com",
                type: "custom",
                label: "Sign up",
            },
        },
        {
            name: "Enterprise",
            description: pricingEnterpriseDescription,
            link: {
                url: "https://area17.com",
                type: "custom",
                label: "Contact sales",
            },
        },
    ] as Pricing[]);

    await seedArticles(payload, [
        {
            title: "Article 1",
            shortDescription: "Article 1 description",
            publishedAt: "2024-03-10",
            categories: [categories[0].id, categories[1].id],
            cover: medias[1].id,
        },
        {
            title: "Article 2",
            shortDescription: "Article 2 description",
            publishedAt: "2024-03-02",
            categories: [getRandomId(categories)],
            cover: medias[1].id,
        },
        {
            title: "Article 3",
            shortDescription: "Article 3 description",
            publishedAt: "2024-01-10",
            categories: [getRandomId(categories)],
            cover: medias[1].id,
        },
        {
            title: "Article 4",
            shortDescription: "Article 4 description",
            publishedAt: "2023-12-10",
            categories: [getRandomId(categories)],
            cover: medias[1].id,
        },
    ] as Article[]);

    await seedTools(payload, [
        {
            title: "Tool 1",
            shortDescription: "Tool 1 description",
            heroAsset: {
                assetType: "image",
                image: medias[1].id,
            },
        },
        {
            title: "Tool 2",
            shortDescription: "Tool 2 description",
            heroAsset: {
                assetType: "image",
                image: medias[1].id,
            },
        },
        {
            title: "Tool 3",
            shortDescription: "Tool 3 description",
            heroAsset: {
                assetType: "image",
                image: medias[1].id,
            },
        },
    ] as Tool[]);

    await seedPersonas(payload, [
        {
            title: "Persona 1",
            featured_article: getRandomId(articles),
            cover: medias[1].id,
        },
        {
            title: "Persona 2",
            featured_article: getRandomId(articles),
            cover: medias[1].id,
        },
        {
            title: "Persona 3",
            featured_article: getRandomId(articles),
            cover: medias[1].id,
        },
    ] as Persona[]);

    await seedTools(payload, [
        {
            title: "TTS",
            pageTitle: "Text to speech",
            shortDescription: "Harness the power of AI for lifelike, context-aware speech synthesis",
            heroAsset: {
                assetType: "image",
                image: medias[1].id,
            },
            links: [
                {
                    link: {
                        url: "https://area17.com",
                        label: "Get started free",
                        appearance: "primary",
                        type: "custom",
                    },
                },
            ],
            blocks: [
                {
                    title: "Text to speech in action",
                    blockType: "asset-slider",
                    assetSliderItem: [
                        { relationTo: "community-assets", value: communityAssets[0].id },
                        { relationTo: "community-assets", value: communityAssets[1].id },
                        { relationTo: "community-assets", value: communityAssets[2].id },
                    ],
                },
                {
                    title: "The most advanced, human-like and intelligent AI speech synthesis",
                    blockType: "tool-features",
                    toolFeatureItems: [
                        {
                            title: "Clone your own",
                            description: "Discover 100’s of unique voices that are designed for depth and authenticity",
                            tool: tools[0].id,
                        },
                        {
                            title: "Wide Range of Voices",
                            description: "Discover 100’s of unique voices that are designed for depth and authenticity",
                            tool: tools[1].id,
                        },
                    ],
                },
                {
                    blockType: "section",
                    backgroundColor: "gray",
                    blocks: [
                        {
                            title: "Start generating speech",
                            blockType: "pricing",
                            pricing: [pricing[0].id, pricing[1].id, pricing[2].id],
                        },
                    ],
                },
                {
                    blockType: "tools",
                    tools: [tools[0].id, tools[1].id],
                },
            ],
            recirculationBlocks: [
                {
                    articles: [articles[0].id, articles[1].id, articles[2].id],
                    blockType: "articles",
                },
                {
                    solutions: [
                        { relationTo: "personas", value: personas[0].id },
                        { relationTo: "personas", value: personas[1].id },
                        { relationTo: "personas", value: personas[2].id },
                    ],
                    blockType: "solutions",
                },
            ],
            faq: {
                faqs: [faqs[0].id, faqs[1].id],
            },
        },
    ] as Tool[]);

    const featuresHighlightBlock = {
        title: "The most advanced, best-in-class latency API in the industry",
        blockType: "features-highlight",
        featureItem: [
            {
                title: "Human-like voices",
                description:
                    "Change your voice but preserve all the emotions expressed in your original speech. Nothing is lost in voice changing.",
                links: [
                    {
                        link: {
                            type: "custom",
                            url: "https://area17.com",
                            label: "Read more",
                        },
                    },
                ],
                assetType: "image",
                image: medias[1].id,
            },
            {
                title: "High quality output",
                description:
                    "Every inflection, pause and modulation is captured from your speech and reproduced with high fidelity. ",
                links: [
                    {
                        link: {
                            type: "custom",
                            url: "https://area17.com",
                            label: "Read more",
                        },
                    },
                ],
                assetType: "image",
                image: medias[1].id,
            },
            {
                title: "Trusted security",
                description:
                    "Our voice changer ensures consistent quality across different types of content, ensuring your voice sounds just the way you want it, every time.",
                links: [
                    {
                        link: {
                            type: "custom",
                            url: "https://area17.com",
                            label: "Read more",
                        },
                    },
                ],
                assetType: "image",
                image: medias[1].id,
            },
        ],
    };

    await seedPersonas(payload, [
        {
            title: "Content creators",
            color: "blue",
            pageTitle: "Unleashing the future of content creation with AI technologies",
            cover: medias[1].id,
            blocks: [
                {
                    title: "Focus on the storytelling,\nWe’ll handle the magic",
                    blockType: "tool-features",
                    toolFeatureItems: [
                        {
                            title: "Clone your own",
                            description: "Discover 100’s of unique voices that are designed for depth and authenticity",
                            tool: tools[0].id,
                        },
                        {
                            title: "Wide Range of Voices",
                            description: "Discover 100’s of unique voices that are designed for depth and authenticity",
                            tool: tools[1].id,
                        },
                    ],
                },
                featuresHighlightBlock,
                { promo: getRandomId(promos), blockType: "promo" },
                {
                    title: "",
                    blockType: "customer-quotes",
                    customerQuotes: [
                        customerQuotes[0].id,
                        customerQuotes[1].id,
                        customerQuotes[2].id,
                        customerQuotes[3].id,
                    ],
                },
            ],
            heroBlocks: [
                {
                    blockType: "customers",
                    customers: [customers[0].id, customers[1].id, customers[2].id, customers[3].id],
                },
                {
                    articles: [articles[0].id, articles[1].id, articles[2].id],
                    blockType: "articles",
                },
                {
                    solutions: [
                        { relationTo: "personas", value: personas[0].id },
                        { relationTo: "personas", value: personas[1].id },
                        { relationTo: "personas", value: personas[2].id },
                    ],
                    blockType: "solutions",
                },
            ],
            featured_article: getRandomId(articles),
        },
    ] as Persona[]);

    await seedUseCases(payload, [
        {
            title: "Use case 1",
            heroBlocks: [
                {
                    title: "Trusted by leading artists and content creators",
                    blockType: "customers",
                    customers: [customers[3].id, customers[2].id, customers[1].id],
                },
            ],
            cover: medias[1].id,
            blocks: [
                {
                    title: "Test title block",
                    blockType: "title",
                },
                {
                    title: "Test article block",
                    articles: [getRandomId(articles)],
                    blockType: "articles",
                },
                {
                    title: "Test solution block",
                    solutions: [{ relationTo: "personas", value: getRandomId(personas) }],
                    blockType: "solutions",
                },
                {
                    promo: getRandomId(promos),
                    blockType: "promo",
                },
                {
                    title: "Test customer quotes block",
                    blockType: "customer-quotes",
                    customerQuotes: [getRandomId(customerQuotes)],
                },
                {
                    faqs: [faqs[0].id, faqs[1].id],
                    title: "Test FAQ block",
                    blockType: "faqs",
                },
                {
                    blockType: "section",
                    blocks: [
                        {
                            title: "Test features highlight block in a section block",
                            blockType: "features-highlight",
                            featureItem: [
                                {
                                    title: "Test feature 1",
                                    links: [
                                        {
                                            link: {
                                                url: "https://test.com",
                                                type: "custom",
                                                label: "Test feature 1 link label",
                                            },
                                        },
                                    ],
                                    description: "Test feature 1 description",
                                    assetType: "image",
                                    image: medias[1].id,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            title: "Use case 2",
            cover: medias[1].id,
            heroBlocks: [
                {
                    title: "Trusted by leading artists and content creators",
                    blockType: "customers",
                    customers: [customers[0].id, customers[1].id, customers[2].id],
                },
            ],
        },
        {
            title: "Use case 3",
            cover: medias[1].id,
            heroBlocks: [
                {
                    title: "Trusted by leading artists and content creators",
                    blockType: "customers",
                    customers: [customers[1].id, customers[2].id, customers[3].id],
                },
            ],
        },
        {
            title: "Audiobook",
            cover: medias[1].id,
            shortDescription:
                "Harness the power of ElevenLabs' AI voices to create captivating and diverse YouTube content, making your videos stand out in the crowded digital landscape.",
            color: "blue",
            pageTitle: "Audiobook narration powered by AI",
            links: [
                {
                    link: {
                        url: "https://area17.com",
                        label: "Start for free",
                        appearance: "primary",
                        type: "custom",
                    },
                },
            ],
            blocks: [
                {
                    title: "In action",
                    blockType: "asset-slider",
                    assetSliderItem: [
                        { relationTo: "community-assets", value: communityAssets[0].id },
                        { relationTo: "community-assets", value: communityAssets[1].id },
                        { relationTo: "community-assets", value: communityAssets[2].id },
                    ],
                },
                featuresHighlightBlock,
                {
                    title: "Focus on the storytelling,\nWe’ll handle the magic",
                    blockType: "tool-features",
                    toolFeatureItems: [
                        {
                            title: "Voice cloning",
                            description: "Discover 100’s of unique voices that are designed for depth and authenticity",
                            tool: tools[0].id,
                        },
                        {
                            title: "Wide Range of Voices",
                            description: "Discover 100’s of unique voices that are designed for depth and authenticity",
                            tool: tools[1].id,
                        },
                    ],
                },
                {
                    blockType: "section",
                    backgroundColor: "gray",
                    blocks: [
                        {
                            title: "Start creating audio for your videos",
                            blockType: "pricing",
                            pricing: [pricing[0].id, pricing[1].id, pricing[2].id],
                        },
                    ],
                },
                { promo: getRandomId(promos), blockType: "promo" },
                {
                    title: "",
                    blockType: "customer-quotes",
                    customerQuotes: [
                        customerQuotes[0].id,
                        customerQuotes[1].id,
                        customerQuotes[2].id,
                        customerQuotes[3].id,
                    ],
                },
            ],
            heroBlocks: [
                {
                    blockType: "customers",
                    customers: [customers[0].id, customers[1].id, customers[2].id, customers[3].id],
                },
            ],
        },
    ] as UseCase[]);

    await seedPages(payload, [
        {
            title: "Developers",
            pageTitle: "START, SCALE, GROWTH",
            cover: medias[1].id,
            shortDescription: "Elevate your projects with the fastest & most powerful text to speec & voice API.",
            links: [
                {
                    link: {
                        url: "https://area17.com",
                        label: "Get started",
                        appearance: "primary",
                        type: "custom",
                    },
                },
                {
                    link: {
                        url: "https://area17.com",
                        label: "Documentation",
                        appearance: "secondary",
                        type: "custom",
                    },
                },
            ],
            blocks: {
                developers: [
                    {
                        blockType: "section",
                        anchorLabel: "highlights",
                        blocks: [
                            {
                                title: "In action",
                                blockType: "asset-slider",
                                assetSliderItem: [
                                    { relationTo: "community-assets", value: communityAssets[0].id },
                                    { relationTo: "community-assets", value: communityAssets[1].id },
                                    { relationTo: "community-assets", value: communityAssets[2].id },
                                ],
                            },
                        ],
                    },
                    {
                        blockType: "section",
                        anchorLabel: "features",
                        backgroundColor: "black",
                        blocks: [
                            {
                                title: "Kickstart your development with our guides",
                                blockType: "tool-features",
                                toolFeatureItems: [
                                    {
                                        title: "Voices",
                                        description:
                                            "Discover 100’s of unique voices that are designed for depth and authenticity",
                                        tool: getRandomId(tools),
                                    },
                                    {
                                        title: "Text to speech",
                                        description:
                                            "Create voiceovers for your videos, audiobooks, or create AI chatbots for free.",
                                        tool: getRandomId(tools),
                                    },
                                ],
                            },
                            featuresHighlightBlock,
                        ],
                    },
                    {
                        blockType: "section",
                        anchorLabel: "pricing",
                        blocks: [
                            {
                                title: "Start using the API",
                                blockType: "pricing",
                                pricing: [pricing[0].id, pricing[1].id, pricing[2].id],
                            },
                            {
                                blockType: "promo",
                                promo: getRandomId(promos),
                            },
                        ],
                    },
                    {
                        blockType: "section",
                        anchorLabel: "resources",
                        backgroundColor: "gray",
                        blocks: [
                            {
                                blockType: "customers",
                                customers: [customers[0].id, customers[1].id, customers[2].id, customers[3].id],
                            },
                            {
                                articles: [articles[0].id, articles[1].id, articles[2].id],
                                blockType: "articles",
                            },
                            {
                                title: "See how our technology can support you",
                                solutions: [
                                    { relationTo: "personas", value: personas[0].id },
                                    { relationTo: "use-cases", value: useCases[0].id },
                                    { relationTo: "personas", value: personas[2].id },
                                    { relationTo: "personas", value: personas[3].id },
                                ],
                                blockType: "solutions",
                            },
                        ],
                    },
                    {
                        blockType: "section",
                        blocks: [
                            {
                                title: "Frequently asked questions",
                                blockType: "faqs",
                                faqs: [faqs[0].id, faqs[1].id],
                            },
                        ],
                    },
                ],
            },
            template: "developers",
        },
        {
            title: "Blog",
        },
        {
            title: "Pricing",
        },
        {
            title: "About",
        },
        {
            title: "Careers",
        },
        {
            title: "Safety",
        },
        {
            title: "Privacy policy",
        },
    ] as Page[]);
};

const richTextExample = {
    root: {
        type: "root",
        format: "",
        indent: 0,
        version: 1,
        children: [
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "Test ",
                        type: "text",
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 1,
                        mode: "normal",
                        style: "",
                        text: "richtext",
                        type: "text",
                        version: 1,
                    },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
            },
        ],
        direction: "ltr",
    },
};

const pricingFreeDescription = {
    root: {
        children: [
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "✓ Speech Synthesis",
                        type: "text",
                        version: 1,
                    },
                    {
                        type: "linebreak",
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "✓ 10,000 characters per month",
                        type: "text",
                        version: 1,
                    },
                    {
                        type: "linebreak",
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "✓ 128kbps audio outputs",
                        type: "text",
                        version: 1,
                    },
                    {
                        type: "linebreak",
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "✓ API access",
                        type: "text",
                        version: 1,
                    },
                    {
                        type: "linebreak",
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "×  Dubbing PRO",
                        type: "text",
                        version: 1,
                    },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
            },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
    },
};

const pricingStarterDescription = {
    root: {
        children: [
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "✓ Speech Synthesis",
                        type: "text",
                        version: 1,
                    },
                    {
                        type: "linebreak",
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "✓ 30,000 characters per month",
                        type: "text",
                        version: 1,
                    },
                    {
                        type: "linebreak",
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "✓ 128kbps audio outputs",
                        type: "text",
                        version: 1,
                    },
                    {
                        type: "linebreak",
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "✓ API access",
                        type: "text",
                        version: 1,
                    },
                    {
                        type: "linebreak",
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "✓ Dubbing PRO",
                        type: "text",
                        version: 1,
                    },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
            },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
    },
};

const pricingEnterpriseDescription = {
    root: {
        children: [
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "✓ Custom quotas",
                        type: "text",
                        version: 1,
                    },
                    {
                        type: "linebreak",
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "✓ Pro voice conning",
                        type: "text",
                        version: 1,
                    },
                    {
                        type: "linebreak",
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "✓ Volume based discounts",
                        type: "text",
                        version: 1,
                    },
                    {
                        type: "linebreak",
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "✓ Enterprise-level SLAs",
                        type: "text",
                        version: 1,
                    },
                    {
                        type: "linebreak",
                        version: 1,
                    },
                    {
                        type: "linebreak",
                        version: 1,
                    },
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "For businesses that require a custom plan tailored to their needs.",
                        type: "text",
                        version: 1,
                    },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
            },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
    },
};

const getRandomId = (collection: any) => collection[Math.floor(Math.random() * collection.length)].id;

async function create(payload: Payload, data: any) {
    return await payload
        .create(data)
        .then(res => {
            payload.logger.info(`Seeded record: ${res.id}`);
            return res;
        })
        .catch(e => {
            payload.logger.error(e);
            throw e;
        });
}

async function seedPlaceholderMedias(payload: Payload) {
    try {
        const avatar = (await create(payload, {
            collection: "media",
            filePath: path.resolve(__dirname, `./placeholders/avatars/avatar.jpg`),
            overwriteExistingFiles: true,
            data: {},
        })) as Media;
        medias.push(avatar);

        const story = (await create(payload, {
            collection: "media",
            filePath: path.resolve(__dirname, `./placeholders/customer-story/customer-story-1.jpg`),
            overwriteExistingFiles: true,
            data: {},
        })) as Media;
        medias.push(story);

        const video = (await create(payload, {
            collection: "media",
            filePath: path.resolve(__dirname, `./placeholders/video/bun33s.mp4`),
            overwriteExistingFiles: true,
            data: {},
        })) as Media;
        medias.push(video);
    } catch (e) {
        payload.logger.error(`Failed to seed media`);
    }
}
async function seedCustomers(payload: Payload, customerNames: string[]) {
    for (const value of customerNames) {
        try {
            const res = (await create(payload, {
                collection: "customers",
                data: {
                    name: value,
                    _status: "published",
                    image: medias[0].id,
                },
                locale: "en",
            })) as Customer;
            customers.push(res);
        } catch (e) {
            payload.logger.error(`Failed to seed customer: ${value}`);
        }
    }
}

async function seedCategories(payload: Payload, categoriesTitles: string[]) {
    for (const value of categoriesTitles) {
        try {
            const res = (await create(payload, {
                collection: "categories",
                data: {
                    title: value,
                    _status: "published",
                },
                locale: "en",
            })) as Category;
            categories.push(res);
        } catch (e) {
            payload.logger.error(`Failed to seed category: ${value}`);
        }
    }
}

async function seedCustomerQuotes(payload: Payload, quotes: string[]) {
    for (const value of quotes) {
        try {
            const res = (await create(payload, {
                collection: "customer-quotes",
                data: {
                    quote: value,
                    author: "Test author",
                    username: "Test username",
                    _status: "published",
                    avatar: medias[0].id,
                },
                locale: "en",
            })) as CustomerQuote;
            customerQuotes.push(res);
        } catch (e) {
            payload.logger.error(`Failed to seed customer quote: ${value}`);
        }
    }
}

async function seedCommunityAssets(payload: Payload, assetTitles: string[]) {
    for (const value of assetTitles) {
        try {
            const res = (await create(payload, {
                collection: "community-assets",
                data: {
                    label: value,
                    customer: getRandomId(customers),
                    assetType: "image",
                    image: medias[1].id,
                    _status: "published",
                },
                locale: "en",
            })) as CommunityAsset;
            communityAssets.push(res);
        } catch (e) {
            payload.logger.error(`Failed to seed community asset: ${value}`);
        }
    }
}

async function seedFaqs(payload: Payload, seededFaqs: Faq[]) {
    for (const value of seededFaqs) {
        try {
            const res = (await create(payload, {
                collection: "faqs",
                data: { ...value, _status: "published" },
                locale: "en",
            })) as Faq;
            faqs.push(res);
        } catch (e) {
            payload.logger.error(`Failed to seed faq: ${value.question}`);
        }
    }
}

async function seedPromos(payload: Payload, seededPromos: Promo[]) {
    for (const value of seededPromos) {
        try {
            const res = (await create(payload, {
                collection: "promos",
                data: { ...value, _status: "published" },
                locale: "en",
            })) as Promo;
            promos.push(res);
        } catch (e) {
            payload.logger.error(`Failed to seed promo: ${value.title}`);
        }
    }
}

async function seedPricing(payload: Payload, seededPricing: Pricing[]) {
    for (const value of seededPricing) {
        try {
            const res = (await create(payload, {
                collection: "pricing",
                data: { ...value, _status: "published" },
                locale: "en",
            })) as Pricing;
            pricing.push(res);
        } catch (e) {
            payload.logger.error(`Failed to seed pricing: ${value.name}`);
        }
    }
}

async function seedArticles(payload: Payload, seededArticles: Article[]) {
    for (const value of seededArticles) {
        try {
            const res = (await create(payload, {
                collection: "articles",
                data: { ...value, _status: "published" },
                locale: "en",
            })) as Article;
            articles.push(res);
        } catch (e) {
            payload.logger.error(`Failed to seed article: ${value.title}`);
        }
    }
}

async function seedPersonas(payload: Payload, seededPersonas: Persona[]) {
    for (const value of seededPersonas) {
        try {
            const res = (await create(payload, {
                collection: "personas",
                data: { ...value, _status: "published" },
                locale: "en",
            })) as Persona;
            personas.push(res);
        } catch (e) {
            payload.logger.error(`Failed to seed persona: ${value.title}`);
        }
    }
}

async function seedUseCases(payload: Payload, seededUseCases: UseCase[]) {
    for (const value of seededUseCases) {
        try {
            const res = (await create(payload, {
                collection: "use-cases",
                data: { ...value, _status: "published" },
                locale: "en",
            })) as UseCase;
            useCases.push(res);
        } catch (e) {
            payload.logger.error(`Failed to seed use case: ${value.title}`);
        }
    }
}

async function seedTools(payload: Payload, seededTools: Tool[]) {
    for (const value of seededTools) {
        try {
            const res = (await create(payload, {
                collection: "tools",
                data: { ...value, _status: "published" },
                locale: "en",
            })) as Tool;
            tools.push(res);
        } catch (e) {
            payload.logger.error(`Failed to seed tool: ${value.title}`);
        }
    }
}

async function seedPages(payload: Payload, seededPages: Page[]) {
    for (const value of seededPages) {
        try {
            const res = (await create(payload, {
                collection: "pages",
                data: { ...value, _status: "published" },
                locale: "en",
            })) as Page;
            pages.push(res);
        } catch (e) {
            payload.logger.error(`Failed to seed page: ${value.title}`);
        }
    }
}
