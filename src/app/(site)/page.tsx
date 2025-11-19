import { JSX } from "react";
import Hero from "../../components/blocks/Hero/Hero";
import styles from './Home.module.css';
import gStyles from './Global.module.css';
import HTag from "../../components/shared/HTag/HTag";
import Info from "../../components/shared/Info/Info";
import Video from "../../components/shared/Video/Video";

import PopularService from "../../components/shared/PopularService/PopularService";
import ImgTag from "../../components/shared/ImgTag/ImgTag";
import Price from "../../components/shared/Price/Price";
import { parseToHTML } from "../../helpers";
import Important from "../../components/shared/Important/Important";
import { Service, Subcategory } from "@/src/interfaces";
import API from "@/src/api/API";
import { getMainPage } from "@/src/api/mainPage";
import { notFound } from "next/navigation";



async function loadMain() {

    const res = await getMainPage();
    if (!res.success) console.error('Failed to load page:', res.error);
    const pageData = res.success ? res.data : null;

    if (pageData) {
        return pageData;
    }
    else return null;
}


export interface PopularInterface {
    service: Service;
    category: "services" | "expertise";
}

async function loadPopular () {
    try {
        // безопасный fetch, чтобы не падать на 404
        const safeFetch = async (url: string) => {
            try {
            const res = await fetch(url);
            return res.ok ? res : null;
            } catch {
            return null;
            }
        };

        const results = await Promise.allSettled([
            safeFetch(API.services.byAlias + "popular1"),
            safeFetch(API.services.byAlias + "popular2"),
            safeFetch(API.services.byAlias + "popular3"),
            safeFetch(API.services.byAlias + "popular4"),
            safeFetch(API.services.byAlias + "popular5"),
        ]);

        const okResponses = results.filter((r): r is PromiseFulfilledResult<Response> =>
            r.status === 'fulfilled' && r.value !== null).map((r) => r.value);
        const data = await Promise.all(okResponses.map(r => r.json()));
        console.log(data);

        const [cat1, cat2] = await Promise.all([
            fetch(API.categories.byId + "1").then(r => r.json()),
            fetch(API.categories.byId + "2").then(r => r.json()),
        ]); // СКАЗАТЬ ДАМИРУ ИСПРАВИТЬ

        const withCategory = data.map((service) => { // ЭТО ВСЕ НЕ НУЖНО ТОГДА
            let categorySlug: "services" | "expertise" | null = null;

            const inCat1 =
                cat1?.subcategories && cat1.subcategories.some((subcategory: Subcategory) =>
                    subcategory.services && subcategory.services.some((s: Service) => s.serviceId === service.serviceId
                    )
            );

            const inCat2 =
                cat2?.subcategories && cat2.subcategories.some((subcategory: Subcategory) =>
                    subcategory.services && subcategory.services.some((s: Service) => s.serviceId === service.serviceId
                    )
                );

            if (inCat1) categorySlug = "services";
            else if (inCat2) categorySlug = "expertise";

            return { service, category: categorySlug };
        }); // ЭТО ВСЕ НЕ НУЖНО ТОГДА

        return withCategory; // просто делаем ретурн сервисов + категорию подставим по айди
    } catch (err) {
        console.error("Failed to load popular services:", err);
    }
}

export default async function HomePage(): Promise<JSX.Element>{


    const pageData = await loadMain();

    if (!pageData) notFound();
    console.log(pageData);

    const popular = await loadPopular();

    console.log(popular);

    return (
        <>
            <Hero />
            <div className={styles.wrapper}>
                <HTag tag="h2" direction="fromRight">О КОМПАНИИ</HTag>
                <div className={gStyles.sectionWrapper}>
                    <div className={styles.fourGrid}>
                        {pageData.about.info.map(point => <Info key={point}>{parseToHTML(point)}</Info>)}
                    </div>
                    {pageData.about.important &&
                        <Important>
                            {parseToHTML(pageData.about.important)}
                        </Important>
                    }
                    <Video videoUrl={`${process.env.NEXT_PUBLIC_DOMAIN}${pageData.about.videoURL}`}/>
                </div>
                {popular && popular.length !== 0 && 
                    <>
                        <HTag tag="h2" direction="fromRight">ПОПУЛЯРНЫЕ УСЛУГИ</HTag>
                        <div className={gStyles.sectionWrapper}>
                        {popular?.map((serviceInfo) => {
                            if (serviceInfo) {
                                return (
                                    <PopularService
                                        title={serviceInfo.service.title}
                                        key={serviceInfo.service.serviceId}
                                        src={`${serviceInfo.category}/${serviceInfo.service.alias}`}
                                        img={`${process.env.NEXT_PUBLIC_DOMAIN}${serviceInfo.service.picLinkPreview}`}
                                    />
                                );
                            }
                            else return null;
                        })}
                        </div>
                    </>
                }
                <HTag tag="h2" direction="fromRight">ОЦЕНКА НЕДВИЖИМОСТИ</HTag>
                <div className={styles.textWrapper}>
                    <div className={styles.bigText}>
                        {parseToHTML(pageData.propertyValuation.info)}
                    </div>
                    <div className={styles.home}>
                        <ImgTag className={styles.homeImg} src={`${process.env.NEXT_PUBLIC_DOMAIN}${pageData.propertyValuation.imageURL}`} />
                        <Price price={pageData.propertyValuation.price} size="lower"/>
                    </div>
                </div>
                <HTag tag="h2" direction="fromRight">ПРИНЦИПЫ РАБОТЫ НАШЕЙ КОМПАНИИ</HTag>
                <div className={gStyles.sectionWrapper}>
                    <div className={styles.fourGrid}>
                        {pageData.workPrinciples.map((principle, i) => <Info key={i} image={`${process.env.NEXT_PUBLIC_DOMAIN}${principle.iconURL}`}>{principle.text}</Info>)}
                    </div>
                </div>
                <HTag tag="h2" direction="fromRight">ПРЕИМУЩЕСТВА СОТРУДНИЧЕСТВА С НАМИ</HTag>
                <div className={gStyles.sectionWrapper}>
                    <div className={styles.fourGrid}>
                        {pageData.advantages.map((advantage, i) => <Info key={i} title={advantage.header}>{parseToHTML(advantage.description)}</Info>)}
                        
                    </div>
                </div>
            </div>
        </>
    );
}
