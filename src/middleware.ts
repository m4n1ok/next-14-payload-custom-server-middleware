import {NextRequest, NextResponse} from "next/server";



export function middleware(request: NextRequest) {
    console.log("middleware running...");
    // return i18NMiddleware(request);
    const res = NextResponse.next();
    res.headers.set("test-middleware", "set by middleware");
    return res
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        "/((?!api|_next|_vercel|media|next|̵admin|.*\\..*).*)",
    ],
};
