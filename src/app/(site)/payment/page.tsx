import { JSX } from "react";
import styles from './Payment.module.css';
import HTag from "@/src/components/shared/HTag/HTag";
import { parseToHTML } from "@/src/helpers";
import ImgTag from "@/src/components/shared/ImgTag/ImgTag";
import Qr from './qr.png';
import Link from "next/link";


export default function PaymentPage(): JSX.Element { 
    

    return (
        <div className={styles.wrapper}>
            <HTag className={styles.h2} tag="h1" direction="fromRight">Способы оплаты</HTag>
            <div className={styles.sectionWrapper}></div>
            <HTag className={styles.h3} tag="h3" direction="fromLeft">Наличный расчёт</HTag>
            <div className={styles.sectionWrapper}>
                <span>
                    Вы можете оплатить заказ наличными при получении услуги.
                </span>
            </div>
            <HTag className={styles.h3} tag="h3" direction="fromLeft">Банковская карта</HTag>
            <div className={styles.sectionWrapper}>
                <span>Оплата банковской картой через терминал в офисе</span>
            </div>
            <HTag className={styles.h3} tag="h3" direction="fromLeft">QR-код</HTag>
            <div className={styles.sectionWrapper}>
                <Link className={styles.link}  href={'http://sberbank.com/sms/shpa/?cs=705093585245&psh=p&did=1762789557712000461'} target="_blank" rel="noopener noreferrer">
                    <ImgTag src={Qr} />
                </Link>
            </div>
            <HTag className={styles.h3} tag="h3" direction="fromLeft">Оплата по счету</HTag>
            <div className={styles.sectionWrapper}>
                <span>
                    Оплата возможна также по безналичному расчёту. Будет сформирован счёт на оплату, который Вы можете распечатать и оплатить. Предоставляем все необходимые документы для бухгалтерии (счёт на оплату, договор, акт оказанных услуг).
                </span>
            </div>
            <div className={styles.withLine}>
                <h3>РЕКВИЗИТЫ ДЛЯ БЕЗНАЛИЧНОЙ ОПЛАТЫ:</h3>
                <p>{parseToHTML("/bold/ООО «АВАНГАРД»//bold//")}</p>
                <p>{parseToHTML("/bold/ИНН://bold// 7024040541")}</p>
                <p>{parseToHTML("/bold/КПП://bold// 702401001")}</p>
                <p>{parseToHTML("/bold/Фактический адрес://bold// /n/634057, Россия, Томская область, г. Томск, ул. Интернационалистов, 2а, офис 5")}</p>

                <p>{parseToHTML("/n//bold/Банковские реквизиты//bold//")}</p>
                <p>{parseToHTML("/bold/Р/счет://bold// 40702810364000007569")}</p>
                <p>{parseToHTML("/n//bold/ПАО Сбербанк//bold//")}</p>
                <p>{parseToHTML("/bold/Кор/счет://bold// 30101810800000000606")}</p>
                <p>{parseToHTML("/bold/БИК://bold// 046902606")}</p>
            </div>
        </div>
    );
}
