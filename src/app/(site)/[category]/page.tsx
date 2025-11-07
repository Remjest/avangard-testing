
import { getServices } from "@/src/api/services";
import HTag from "@/src/components/shared/HTag/HTag";
import ServicePreview from "@/src/components/shared/ServicePreview/ServicePreview";
import { NestedCategories } from "@/src/interfaces";
import { notFound } from "next/navigation";
import { JSX } from "react";
import styles from "./CategoryPage.module.css";

export const revalidate = 300;

export function generateStaticParams() {
    const categories: NestedCategories[] = ['services', 'expertise'];
    
    return categories.map((category) => ({ category: category }));
}


export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }): Promise<JSX.Element> {
    
    const { category }: { category: string } = await params;

    const categories: NestedCategories[] = ['services', 'expertise'];
    const title: string = category === 'services' ? 'Услуги оценки' : 'Наши экспертизы';

    if (!categories.includes(category as NestedCategories)) {
        notFound();
    }

    const res = await getServices((categories.indexOf(category as NestedCategories) +  1).toString());
    if (!res.success) console.error('Failed to load services:', res.error);
    
    const services = res.success ? res.data : null;

    return (
        <div className={styles.wrapper}>
            <HTag className={styles.h1} tag="h1" direction="fromRight">{title}</HTag>
            <div className={styles.servicesWrapper}>
                {services && services?.length !== 0 && services.map((service) => {
                    return <ServicePreview className={styles.service} key={service.serviceId} title={service.title} img={`${process.env.NEXT_PUBLIC_DOMAIN}${service.picLinkPreview}`} src={`/${category}/${service.alias}`}></ServicePreview>;
                })}
            </div>
        </div>
    );
}