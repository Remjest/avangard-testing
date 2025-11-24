import { getServices } from "@/src/api/services"; 
import { NextResponse } from "next/server";

const staticPages = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/contacts', priority: 0.9, changefreq: 'monthly' },
    { path: '/payment', priority: 0.7, changefreq: 'monthly' },
    { path: '/services', priority: 0.8, changefreq: 'daily' },
    { path: '/expertise', priority: 0.8, changefreq: 'daily' },
];

export const dynamic = "force-dynamic";

export async function GET() {
    const domain = process.env.MAIN_DOMAIN;

    const servicesRes = await getServices('1');
    const services = servicesRes.success ? servicesRes.data : [];

    const expertiseRes = await getServices('2');
    const expertise = expertiseRes.success ? expertiseRes.data : [];

    const staticUrls = staticPages.map(p => `
        <url>
        <loc>${domain}${p.path}</loc>
        <changefreq>${p.changefreq}</changefreq>
        <priority>${p.priority}</priority>
        </url>`).join('');

    const dynamicUrls = [
        ...services.map(s => `
        <url>
            <loc>${domain}/services/${s.alias}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
        </url>`),

        ...expertise.map(e => `
        <url>
            <loc>${domain}/expertise/${e.alias}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
        </url>`),
    ].join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticUrls}
        ${dynamicUrls}
    </urlset>`;

    return new NextResponse(xml, {
        headers: {
        "Content-Type": "application/xml"
        }
    });
}
