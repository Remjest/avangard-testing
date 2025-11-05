
import { NestedCategories } from "@/src/interfaces";
import { notFound } from "next/navigation";
import { JSX } from "react";
import styles from './ServicePage.module.css';
import HTag from "@/src/components/shared/HTag/HTag";
import { parseToHTML } from "@/src/helpers";
import ImgTag from "@/src/components/shared/ImgTag/ImgTag";
import Important from "@/src/components/shared/Important/Important";
import Price from "@/src/components/shared/Price/Price";
import { getByAlias } from "@/src/api/alias";
import { getShortsByCategory } from "@/src/api/shortsByCategory";
import classNames from "classnames";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ category: string, service: string }> }) {
    
    const { service }: { service: string } = await params;
    const { category }: { category: string } = await params;

    const res = await getByAlias(service);
    if (!res.success) {
        console.error('Failed to load metadata:', res.error);
        return;
    };
    const page = res.data;

    return {
        keywords: page?.metaKeywords,
        title: page?.metaTitle,
        description: page?.metaDescription,
        openGraph: {
            title: page.metaTitle,
            description: page.metaDescription,
            url: `${process.env.NEXT_PUBLIC_DOMAIN}/${category}/${service}`,
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_DOMAIN}${page.picLinkPreview.trim()}`,
                    width: 1200,
                    height: 630,
                }
            ],
        },
    };
}


export async function generateStaticParams() {
    const categories: NestedCategories[] = ['services', 'expertise'];

    const allParams = [];
    
    for (const category of categories) {
        const res = await getShortsByCategory(categories.indexOf(category) + 1);
        
        if (!res.success) {
            console.error('Failed to generate static params to pages:', res.error);
            continue;
        }
        
        const shorts = res.data;
        
        if (shorts) {
            const categoryParams = shorts.map((short) => ({
                category: category,
                service: short.alias
            }));
            
            allParams.push(...categoryParams);
        }
    }
    
    return allParams;
}



export default async function ServicePage({ params }: { params: Promise<{ category: string, service: string }>}): Promise<JSX.Element> {
    
    const { category }: { category: string } = await params;
    
    const { service }: { service: string } = await params;

    const categories: NestedCategories[] = ['services', 'expertise'];
    
    if (!categories.includes(category as NestedCategories)) {
        notFound();
    }


    const res = await getByAlias(service);
    if (!res.success) console.error('Failed to load page:', res.error);
    const pageData = res.success ? res.data : null;

    if (!pageData) {
        notFound();
    }

    return (
        <div className={styles.wrapper}>
            <HTag className={styles.h1} tag="h1" direction="fromRight">{pageData.title} в Томске</HTag>
            <div className={classNames(styles.mainWrapper, {
                [styles.withSub]: pageData.subtitle && pageData.subText,
                [styles.withoutSub]: !(pageData.subtitle && pageData.subText)
            })}>
                <ImgTag className={styles.image} src={`${process.env.NEXT_PUBLIC_DOMAIN}${pageData.picLinkMain}`} width={800} height={600}/>
                <HTag  className={styles.mainTitle} tag="h1" direction="fromRight">{pageData.title}</HTag>
                <span className={styles.mainText}>{parseToHTML(pageData.mainText)}</span>
                {pageData.subtitle && pageData.subText && 
                    <>
                        <HTag className={styles.subTitle} tag="h2" direction="fromLeft">{pageData.subtitle}</HTag>
                        <span className={styles.subText}>{parseToHTML(pageData.subText)}</span>
                    </>
                }

            </div>
            {pageData.important && <Important className={styles.important}>{parseToHTML(pageData.important)}</Important>}
            {pageData.extraText && <div className={styles.withLine}>
                {parseToHTML(pageData.extraText)}
            </div>}
            <Price price={pageData.price} size="bigger"/>
        </div>
    )
}