import { JSX } from "react";
import styles from './Payment.module.css';
import HTag from "@/src/components/shared/HTag/HTag";
import { parseToHTML } from "@/src/helpers";


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
            <HTag className={styles.h3} tag="h3" direction="fromLeft">Банковские сервисы</HTag>
            <div className={styles.sectionWrapper}>
                <span>Система онлайн-банкинга «Сбербанк Онлайн»</span>
            </div>
            <HTag className={styles.h3} tag="h3" direction="fromLeft">Безналичный расчёт</HTag>
            <div className={styles.sectionWrapper}>
                <span>
                    После оформления заказа будет сформирован счёт на оплату, который Вы можете распечатать и оплатить. Денежные средства поступят на наш счёт в течение 2-3 рабочих дней после оплаты заказа.Оплата заказов клиентами — юридическими лицами возможна только по безналичному расчёту. Все необходимые для бухгалтерии документы (оригинал счёта на оплату, счёт-фактура, накладная) выдаются вместе с заказом при получении.
                </span>
            </div>
            <div className={styles.withLine}>
                <h3>РЕКВИЗИТЫ ДЛЯ БЕЗНАЛИЧНОЙ ОПЛАТЫ:</h3>
                <p>{parseToHTML("/bold/Полное наименование организации://bold// /n/Общество с ограниченной ответственностью «АВАНГАРД», Экспертно-оценочная компания")}</p>
                <p>{parseToHTML("/bold/Сокращенное наименование организации://bold// /n/ООО «АВАНГАРД», Экспертно-оценочная компания")}</p>
                <p>{parseToHTML("/bold/Юридический адрес://bold// /n/636017, Томская область, г. Северск, ул. Калинина 75, 6")}</p>
                <p>{parseToHTML("/bold/Фактический адрес://bold// /n/634050, Томская область, г. Томск, ул. Интернационалистов 2а, офис 5")}</p>
                <p>{parseToHTML("/bold/Телефон://bold// /n/+7 (3822) 233-800,/n/ +7 (953) 919 38-00")}</p>
                <p>{parseToHTML("/bold/Email://bold// /n/expert233800@mail.ru")}</p>
                <p>{parseToHTML("/bold/ОГРН://bold// /n/1157024001045")}</p>
                <p>{parseToHTML("/bold/ИНН://bold// /n/7024040541")}</p>
                <p>{parseToHTML("/bold/КПП://bold// /n/702401001")}</p>
                <p>{parseToHTML("/bold/Директор://bold// /n/Ставский Евгений Геннадьевич")}</p>
                <p>{parseToHTML("/bold/Банковские реквизиты://bold//")}</p>
                <p>{parseToHTML("Р/счет 40702810674860000147")}</p>
                <p>{parseToHTML("ПАО Сбербанк")}</p>
                <p>{parseToHTML("Кор/счет 30101810800000000606")}</p>
                <p>{parseToHTML("БИК 046902606")}</p>
            </div>
        </div>
    );
}
