'use client';

import { JSX, useEffect, useState } from "react";
import Hero from "../../components/blocks/Hero/Hero";
import styles from './Home.module.css';
import gStyles from './Global.module.css';
import HTag from "../../components/shared/HTag/HTag";
import Info from "../../components/shared/Info/Info";
import Video from "../../components/shared/Video/Video";

import PopularService from "../../components/shared/PopularService/PopularService";
import Star from './img/star.svg';
import User from './img/user.svg';
import Sec from './img/secur.svg';
import Book from './img/book.svg';
import Home from './img/home.jpg';
import ImgTag from "../../components/shared/ImgTag/ImgTag";
import Price from "../../components/shared/Price/Price";
import { parseToHTML } from "../../helpers";
import Important from "../../components/shared/Important/Important";
import { Service, Subcategory } from "@/src/interfaces";
import API from "@/src/api/API";


export default function HomePage(): JSX.Element{

    const [popular, setPopular] = useState<{ service: Service, category: string | null }[] | null>(null);
    
    useEffect(() => {
    const loadPopular = async () => {
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

            const results = await Promise.all([
                safeFetch(API.services.byAlias + "popular1"),
                safeFetch(API.services.byAlias + "popular2"),
                safeFetch(API.services.byAlias + "popular3"),
                safeFetch(API.services.byAlias + "popular4"),
                safeFetch(API.services.byAlias + "popular5"),
            ]);

            const okResponses = results.filter((r): r is Response => !!r);
            const data = await Promise.all(okResponses.map(r => r.json()));

            const [cat1, cat2] = await Promise.all([
                fetch(API.categories.byId + "1").then(r => r.json()),
                fetch(API.categories.byId + "2").then(r => r.json()),
            ]);

            const withCategory = data.map((service) => {
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
            });

            setPopular(withCategory);
        } catch (err) {
            console.error("Failed to load popular services:", err);
        }
    };

  loadPopular();
}, []);

    const bigText = "/bold/Независимая оценка стоимости недвижимости//bold// (квартиры, дома, земельного участка или участка под строительство) необходима, в случае, если клиенты желают её приобрести, продать или застраховать, при использовании в качестве арендной жилой или нежилой недвижимости, при совершении сделок купли-продажи недвижимых активов и объектв основных средств. Оценка коммерческой или жилой недвижимости /bold/в Томске и Томской области//bold// да и в любом городе часто требуется в случае, если появляется потребность в привлечении акционеров, а также в случае разделения долей собственно.";

    return (
        <>
            <Hero />
            <div className={styles.wrapper}>
                <HTag tag="h2" direction="fromRight">О КОМПАНИИ</HTag>
                <div className={gStyles.sectionWrapper}>
                    <div className={styles.fourGrid}>
                        <Info>{parseToHTML("/bold/ООО «АВАНГАРД»//bold// — экспертно-оценочная компания, предлагающая широкий спектр услуг по проведению независимой оценки и экспертизе в Томской области, в Томске, в Северске, а также в других регионах.")}</Info>
                        <Info>{parseToHTML("Отчетные документы, выдаваемые компанией, принимаются /bold/во всех организациях и учреждениях Российской Федерации.//bold//")}</Info>
                        <Info>{parseToHTML("Мы специализируемся главным образом на проведении экспертиз и оценки /bold/любого вида имущества://bold// движимого и недвижимого. Благодаря /bold/высокому уровню профессиональной подготовки и большому опыту//bold//, мы оказываем услуги качественно и в срок.")}</Info>
                        <Info>{parseToHTML("/bold/Наша компания включена в реестр НОПРИЗ и является членом СРО.//bold// Регистрационный номер члена СРО № П-116-007024040541-0197 в области инженерных изысканий и в области архитектурно-строительного проектирования и их обязательствах Союз «Межрегиональное объединение организаций в области проектирования «Ярд» (СРО-П-116-18012010).")}</Info>
                    </div>
                    <Important>
                        {parseToHTML('/bold/МЫ НЕ ТЯНЕМ ВРЕМЯ — ВЫ НЕ ТЕРЯЕТЕ ДЕНЬГИ!//bold// /n/ /italic/Все заключения и отчёты мы подготавливаем в минимальные сроки//italic//')}
                    </Important>
                    <Video videoUrl={`${process.env.NEXT_PUBLIC_DOMAIN}/videos/main-video.mp4`}/>
                </div>
                {popular && popular.length !== 0 && 
                    <>
                        <HTag tag="h2" direction="fromRight">ПОПУЛЯРНЫЕ УСЛУГИ</HTag>
                        <div className={gStyles.sectionWrapper}>
                            {popular?.map((serviceInfo) => 
                                <PopularService
                                    title={serviceInfo.service.title}
                                    key={serviceInfo.service.serviceId}
                                    src={`${serviceInfo.category}/${serviceInfo.service.alias}`}
                                    img={`${process.env.NEXT_PUBLIC_DOMAIN}${serviceInfo.service.picLinkPreview}`}
                                />
                            )}
                        </div>
                    </>
                }
                <HTag tag="h2" direction="fromRight">ОЦЕНКА НЕДВИЖИМОСТИ</HTag>
                <div className={styles.textWrapper}>
                    <div className={styles.bigText}>
                        <p>{parseToHTML(bigText)}</p>
                        <p>{parseToHTML("Компания OOO «АВАНГАРД» оказывает /bold/полный перечень услуг//bold// по оценке любой недвижимости в Томске:")} </p>
                        <ul className={styles.list}>
                            <li>Оценка недвижимости</li>
                            <li>Оценка жилой недвижимости</li>
                            <li>Оценка коттеджа</li>
                            <li>Оценка квартиры</li>
                            <li>Оценка дачи</li>
                            <li>Оценка офисных помещений</li>
                            <li>Оценка складов</li>
                            <li>Оценка гаражей</li>
                            <li>Оценка незавершенного строительства</li>
                        </ul>
                    </div>
                    <div className={styles.home}>
                        <ImgTag className={styles.homeImg} src={Home} />
                        <Price price="от 3000 ₽" size="lower"/>
                    </div>
                </div>
                <HTag tag="h2" direction="fromRight">ПРИНЦИПЫ РАБОТЫ НАШЕЙ КОМПАНИИ </HTag>
                <div className={gStyles.sectionWrapper}>
                    <div className={styles.fourGrid}>
                        <Info image={Star}
                            >Независимость и беспристрастность.</Info>
                        <Info image={Sec}
                            >Строгое соответствие законодательству.</Info>
                        <Info image={Book}
                            >Высокая квалификация и сертификация экспертов и оценщиков.</Info>
                        <Info image={User}
                            >Конфиденциальность.</Info>
                    </div>
                </div>
                <HTag tag="h2" direction="fromRight">ПРЕИМУЩЕСТВА СОТРУДНИЧЕСТВА С НАМИ</HTag>
                <div className={gStyles.sectionWrapper}>
                    <div className={styles.fourGrid}>
                        <Info title="Качество и оперативность выполнения услуг"
                            >Профессионализм и опыт экспертов и оценщиков, что гарантирует высокое качество услуг и точность результатов.</Info>
                        <Info title="Объективность и независимость"
                            >Независимые эксперты и оценщики действуют в рамках законодательства и предоставляют непредвзятые заключения и отчеты, что особенно важно при решении спорных вопросов.</Info>
                        <Info title="Юридическая значимость"
                            >Заключения и отчеты имеет юридическую силу и рассматриваются любыми инстанциями.</Info>
                        <Info title="СТРАХОВАНИЕ ОТВЕТСТВЕННОСТИ"
                            >{parseToHTML("/bold/25 000 000 руб.//bold// — уровень ответственности члена саморегулируемой организации по обязательствам по договору подряда на подготовку проектной документации, в соответствии с которым указанным членом внесен взнос в компенсационный фонд возмещения вреда./n//n//bold/30 000 000 руб.//bold// — страхование ответственности оценочной организации.")}</Info>
                    </div>
                </div>
            </div>
        </>
    );
}
