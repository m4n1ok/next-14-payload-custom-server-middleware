import type React from "react";

interface IPageParams {
    params: {
        locale: string;
    };
}

export default async function Layout({
    children,
    params: { locale },
}: Readonly<
    {
        children: React.ReactNode;
    } & IPageParams
>) {

    return (
        <html className="" lang={locale}>
            <body>
                    <main id='main'>
                        <div className=''>{children}</div>
                    </main>
            </body>
        </html>
    );
}
