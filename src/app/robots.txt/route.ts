import { NextResponse } from 'next/server';

export async function GET() {

    const content = `User-agent: *
Allow: /

Disallow: /api/
Disallow: /_next/
Disallow: /admin
Disallow: /admin/
Disallow: /admin-login

Sitemap: ${process.env.NEXT_PUBLIC_MAIN_DOMAIN}/sitemap.xml
`;

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}