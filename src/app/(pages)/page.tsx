import { defaultLocale } from "@/i18n";

interface IPageParams {
    params: {
        locale?: string;
    };
}
export const dynamic = 'force-dynamic'
export default function Home({ params }: IPageParams) {
    return (
        <div className='flex min-h-screen flex-col items-center justify-between p-24'>
            <h1>Hello world</h1>
        </div>
    );
}
