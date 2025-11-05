"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from './PostServicePage.module.css'
import HTag from "@/src/components/shared/HTag/HTag";
import ImgTag from "@/src/components/shared/ImgTag/ImgTag";
import Price from "@/src/components/shared/Price/Price";
import { parseToHTML } from "@/src/helpers";
import Important from "@/src/components/shared/Important/Important";
import { Service } from "@/src/interfaces";
import { getPage } from "@/src/api/page";
import { SubmitHandler, useForm } from "react-hook-form";
import classNames from "classnames";
import { getShortsByCategory } from "@/src/api/shortsByCategory";
import { postImage } from "@/src/api/postImage";
import { postService } from "@/src/api/postService";
import { getAllSubcategories } from "@/src/api/allSubcategories";

export default function EditServicePage() {
    const router = useRouter();

    const [mainImg, setMainImg] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [subcategories, setSubcategories] = useState<{id: string, name: string}[] | null>(null);

    useEffect(() => {
        const loadSubcategories = async () => {
            const res = await getAllSubcategories();
            if (!res.success) {
                console.error('Failed to load subcategoriesId:', res.error);
                return;
            }
            setSubcategories(res.data);
        }
        loadSubcategories();
    }, []);

    type FormValues = Service & {
        mainImage: FileList | null;
        previewImage: FileList | null;
        subcategoryId: string;
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValues>();
    
    const onSubmit: SubmitHandler<FormValues> = async (newData, e) => {
        e?.preventDefault();

        const { subcategoryId, mainImage, previewImage, ...serviceData } = newData;

        const allServicesData = await Promise.all([getShortsByCategory(1), getShortsByCategory(2)]);
        if (!allServicesData[0].success || !allServicesData[1].success) {
            window.alert("При попытке изменения произошла внутрянняя ошибка. Проверьте подключение к интернету.");
            return;
        }
        const unpackedServices = [...allServicesData[0].data, ...allServicesData[1].data];

        for (const service of unpackedServices) {
            if (service.serviceId !== newData.serviceId) {
                if (service.alias === newData.alias) {
                    console.error("Вы ввели уже использующийся относительный путь! Попробуйте изменить его или удалить услугу с таким же путем.")
                    window.alert("Вы ввели уже использующийся относительный путь! Попробуйте изменить его или удалить услугу с таким же путем.");
                    return;
                }
            }
        }

        let newPicLinkMain: string | undefined = newData.picLinkMain;
        let newPicLinkPreview: string | undefined = newData.picLinkPreview;

        if (mainImage && mainImage[0]) {
            const uploadMain = await postImage(mainImage[0]);
            if (uploadMain.success) newPicLinkMain = uploadMain.data;
            else {
                console.error(uploadMain.error)
                window.alert("Ошибка загрузки основного изображения!");
                return;
            }
        } else return;

        if (previewImage && previewImage[0]) {
            let uploadPreview = await postImage(previewImage[0]);
            if (uploadPreview.success) newPicLinkPreview = uploadPreview.data;
            else {
                window.alert("Ошибка загрузки превью - будет использовано основное изображение.");
                if (newPicLinkMain) {
                    newPicLinkPreview = newPicLinkMain;
                } else return;
            }
        } else {
            if (newPicLinkMain) {
                newPicLinkPreview = newPicLinkMain;
            } else return;
        }

        const editData: Service = {
            ...serviceData,
            picLinkMain: newPicLinkMain,
            picLinkPreview: newPicLinkPreview,
        };

        const { success } = await postService(subcategoryId, editData);
        if (success) {
            router.push("/admin");
        }
        else { 
            window.alert("При попытке изменения произошла ошибка.");
        }
    };

    return (
        <div className={styles.wrapper}>
            <HTag className={styles.h1} tag="h2" direction="fromRight">Добавление новой услуги</HTag>
            <form className={styles.actionWrapper} onSubmit={handleSubmit(onSubmit)}>
                <label className={styles.tip}>
                    {parseToHTML('/bold/Справка по тегам форматирования://bold//')} <br /> <br />
                    Вы можете использовать специальные теги для оформления текста прямо внутри поля ввода.<br /><br />

                    /bold/…//bold// — делает текст жирным. <br /><span className={styles.tipGreen}>Пример:</span> /bold/Это важно!//bold// → {parseToHTML('/bold/Это важно!//bold//')}<br /><br />

                    /italic/…//italic// — делает текст курсивным. <br /><span className={styles.tipGreen}>Пример:</span> /italic/Пример текста//italic// → {parseToHTML('/italic/Пример текста//italic//')}<br /><br />

                    /n/ — перенос строки. <br /><span className={styles.tipGreen}>Пример: </span>• Первая строка /n/• Вторая строка → {parseToHTML('/n/• Первая строка /n/• Вторая строка')}<br /><br />
                    Чтобы отделить текст одной или несколькими строками, введите несколько тэгов подряд. <br /> <span className={styles.tipGreen}>Пример:</span> Первая строка /n//n/ Вторая строка → {parseToHTML('/n/Первая строка /n//n/ Вторая строка')}
                    <br /><br />

                    Теги всегда пишутся со слэшами и должны закрываться: /bold/текст//bold//, /italic/текст//italic//. <span className={styles.tipRed}>Исключение</span> — /n/, он не требует закрытия. <br /><br />

                    Теги можно вкладывать друг в друга, главное — закрывать их в правильном порядке.<br />
                    <span className={styles.tipGreen}>Пример:</span> /bold/Жирный и /italic/курсивный//italic// текст//bold// → {parseToHTML('/bold/Жирный и /italic/курсивный//italic// текст//bold//')}<br /><br />
                    Тэги можно использовать не во всех полях услуги: мы подписали, где тэги будут обрабатываться, а где нет. <br />Вы всегда можете проверить, правильно ли обработались тэги — просто посмотрите на получившуюся услугу снизу. 
                </label>

                <label className={styles.label}>К какой подкатегории будет принадлежать услуга?</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>Обязательное поле</span><br />
                </label>
                
                <div className={styles.radioGroup}>
                    {subcategories && subcategories.map((subcategory) => {
                        return (
                            <label key={subcategory.id} className={styles.radioLabel}>
                                <input 
                                    type="radio"
                                    value={subcategory.id}
                                    {...register("subcategoryId", { required: 'Выберите подкатегорию' })}
                                />
                                {subcategory.name}
                            </label>
                        )
                    })}
                </div>
                {errors.subcategoryId && <div className={styles.err}> {errors.subcategoryId.message} </div>}

                <label className={styles.label}>Введите МЕТА заголовок страницы (SEO)</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>ТЭГИ: не обрабатываются</span><br /><br />
                    <span className={styles.tipGreen}>МЕТА-заголовок (meta title)</span> — это строка, которая отображается в названии вкладки браузера и в результатах поиска.<br />
                    <span className={styles.tipRed}>Очень важно</span> кратко и точно описать содержание страницы, чтобы повысить кликабельность в поисковых системах.<br />
                    Например: Независимая оценка ущерба после ДТП в Томске | ООО «Авангард» <br /><br />
                    <span className={styles.tipGreen}>Необязательное, </span><span className={styles.tipRed}>но очень рекомендуемое поле </span><br /><br />
                </label>
                <input type="text"
                    placeholder="Введите МЕТА заголовок"
                    className={styles.input}
                    {...register("metaTitle")}
                    
                />

                <label className={styles.label}>Введите МЕТА описание страницы (SEO)</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>ТЭГИ: не обрабатываются</span><br /><br />
                    <span className={styles.tipGreen}>МЕТА-описание (meta description)</span> — короткий текст, который поисковики показывают под заголовком страницы.<br />
                    <span className={styles.tipRed}>Очень важно</span> сделать его информативным и привлекательным — это влияет на то, перейдут ли пользователи на сайт.<br />
                    Например: ООО «Авангард» - Мы проводим любой вид независимой оценки и экспертизы имущества. Помогаем клиентам отстоять их интересы и получить достойную компенсацию в г. Томске и Области<br /><br />
                    <span className={styles.tipGreen}>Необязательное, </span><span className={styles.tipRed}>но очень рекомендуемое поле </span><br /><br />
                </label>
                <textarea
                    placeholder="Введите МЕТА описание"
                    className={styles.textarea}
                    {...register("metaDescription")}
                    
                />

                <label className={styles.label}>Введите МЕТА ключевые слова страницы (SEO)</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>ТЭГИ: не обрабатываются</span><br /><br />
                    <span className={styles.tipGreen}>МЕТА ключевые слова (meta keywords)</span> — это список слов и фраз, описывающих содержание страницы.<br />
                    Сегодня поисковые системы почти не используют их напрямую, но они <span className={styles.tipRed}>могут помочь</span> внутренней оптимизации сайта и системам аналитики.<br /><br />
                    <span className={styles.tipGreen}>Необязательное, </span><span className={styles.tipRed}>но очень рекомендуемое поле </span><br /><br />
                </label>
                <textarea
                    placeholder="Введите ключевые слова"
                    className={styles.textarea}
                    {...register("metaKeywords")}
                    
                />

                <label className={styles.label}>Введите относительный путь к услуге на сайте</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>ТЭГИ: не обрабатываются </span><br /><br />
                    <span className={styles.tipRed}>Обязательное поле </span><br /><br />
                    Это должна быть строчка на английском, маленькими буквами, одно или несколько слов через дефис. Например: road-accident, dtp и т. д.<br />
                    Она не должна быть информативной для пользователя, используется лишь для навигации по сайту.<br />
                    <span className={styles.tipRed}>Важно!</span> Услуги с относительными путями popular1, popular2, ..., popular5 будут видны на главной странице в разделе "Популярные услуги".
                    
                </label>
                <input type="text"
                    placeholder="Введите относительный путь"
                    className={styles.input}
                    {...register("alias", { required:'Заполните поле' })}
                    
                />
                {errors.title && <div className={styles.err}> {errors.title.message} </div>}

                <label className={styles.label}>Введите название для услуги</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>ТЭГИ: не обрабатываются </span><br /><br />
                    <span className={styles.tipRed}>Обязательное поле </span><br /><br />
                    Не нужно писать, что услуга оказывается в Томске. Это автоматически добавится в заголовок.
                </label>
                <input type="text"
                    placeholder="Введите новое название"
                    className={styles.input}
                    {...register("title", { required:'Заполните поле' })}
                    
                />
                {errors.title && <div className={styles.err}> {errors.title.message} </div>}

                <label className={styles.label}>Введите основной текст</label>
                <label className={styles.tip}>
                    <span className={styles.tipGreen}>ТЭГИ: обрабатываются </span><br /><br />
                    <span className={styles.tipRed}>Обязательное поле </span><br />
                </label>
                <textarea
                    placeholder="Введите основной текст"
                    className={styles.textarea}
                    {...register("mainText", { required:'Заполните поле' })}
                    
                />
                {errors.mainText && <div className={styles.err}> {errors.mainText.message} </div>}
                
                <label className={styles.label}>Выберите изображение для отображения на странице</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>ТЭГИ: не обрабатываются </span><br /><br />
                    <span className={styles.tipRed}>Обязательное поле </span><br /><br />
                    <span className={styles.tipRed}>ВАЖНО! </span> Изображение будет корректно отображаться, если соотношение его сторон будет приблизительно 5 / 3.
                </label>
                <input
                    className={styles.hiddenInput}
                    type="file"
                    id="imgInput"
                    accept="image/*"
                    {...register("mainImage", {
                        required:'Выберите изображение',
                        onChange: (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            if (mainImg) URL.revokeObjectURL(mainImg);
                            setMainImg(URL.createObjectURL(file));
                        }
                        },
                    })}
                />

                <label htmlFor="imgInput" className={styles.uploadLabel}>
                    {mainImg ? "Изменить изображение" : "Загрузить изображение"}
                </label>
                <ImgTag className={classNames(styles.preview)} src={mainImg ? mainImg : '/default.jpg'} alt="Здесь будет ваше изображение" width={800} height={600} />
                {errors.mainImage && <div className={styles.err}>{errors.mainImage.message}</div>}

                <label className={styles.label}>Выберите изображение для отображения на превью</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>ТЭГИ: не обрабатываются </span><br /><br />
                    <span className={styles.tipGreen}>Необязательное поле </span><br /><br />
                    Если превью не будет загружено, вместо него будет отображаться главное изображение.<br /><br />
                    <span className={styles.tipRed}>ВАЖНО! </span> Изображение будет корректно отображаться, если соотношение его сторон будет приблизительно 5 / 3.
                </label>
                <input
                    className={styles.hiddenInput}
                    type="file"
                    id="previewInput"
                    accept="image/*"
                    {...register("previewImage", {
                        onChange: (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            if (preview) URL.revokeObjectURL(preview);
                            setPreview(URL.createObjectURL(file));
                        }
                        },
                    })}
                />
                <label htmlFor="previewInput" className={styles.uploadLabel}>
                    {preview ? "Изменить изображение" : "Загрузить изображение"}
                </label>
                <ImgTag className={classNames(styles.preview)} src={preview ? preview : '/default.jpg'} alt="Здесь будет ваше превью" width={800} height={600} />
                {errors.previewImage && <div className={styles.err}>{errors.previewImage.message}</div>}

                <label className={styles.label}>Введите подзаголовок</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>ТЭГИ: не обрабатываются </span><br /><br />
                    <span className={styles.tipGreen}>Необязательное поле </span><br /><br />
                    <span className={styles.tipRed}>ВАЖНО! </span> Подзаголовок и дополнительный текст будут отображаться на странице, если введены ОБА этих поля.<br />
                </label>
                <input type="text"
                    placeholder="Введите подзаголовок"
                    className={styles.input}
                    {...register("subtitle")}
                />

                <label className={styles.label}>Введите дополнительный текст</label>
                <label className={styles.tip}>
                    <span className={styles.tipGreen}>ТЭГИ: обрабатываются </span><br /><br />
                    <span className={styles.tipGreen}>Необязательное поле </span><br />
                </label>
                <textarea
                    placeholder="Введите дополнительный текст"
                    className={styles.textarea}
                    {...register("subText")}
                />

                <label className={styles.label}>Введите важную информацию</label>
                <label className={styles.tip}>
                    <span className={styles.tipGreen}>ТЭГИ: обрабатываются </span><br /><br />
                    <span className={styles.tipGreen}>Необязательное поле </span><br />
                </label>
                <textarea
                    placeholder="Введите важную информацию"
                    className={styles.textarea}
                    {...register("important")}
                />

                <label className={styles.label}>Введите справочную информацию</label>
                <label className={styles.tip}>
                    <span className={styles.tipGreen}>ТЭГИ: обрабатываются </span><br /><br />
                    <span className={styles.tipGreen}>Необязательное поле </span><br />
                </label>
                <textarea
                    placeholder="Введите справочную информацию"
                    className={styles.textarea}
                    {...register("extraText")}
                />

                <label className={styles.label}>Введите цену</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>ТЭГИ: не обрабатываются </span><br /><br />
                    <span className={styles.tipRed}>Обязательное поле </span><br /><br />
                    Вы можете написать цену как вам захочется. Например: "от 3000 ₽", "ИНДИВИДУАЛЬНО" и т. д.
                </label>
                <input type="text"
                    placeholder="Введите цену"
                    className={styles.input}
                    {...register("price", { required:'Заполните поле' })}
                    
                />
                {errors.title && <div className={styles.err}> {errors.title.message} </div>}

                <button className={styles.button} type="submit">Отправить изменения</button>
                <label className={styles.label}>Как все будет на странице можете посмотреть ниже</label>
            </form>
            <HTag className={styles.h1} tag="h1" direction="fromRight">{watch("title")} в Томске</HTag>
            <div className={styles.mainWrapper}>
                <ImgTag className={styles.image} src={mainImg ? mainImg : '/default.jpg'} alt="Здесь будет ваше изображение" width={800} height={600} />
                <HTag className={styles.mainTitle} tag="h1" direction="fromRight">{watch("title")}</HTag>
                <span className={styles.mainText}>{parseToHTML(watch("mainText"))}</span>
                <HTag className={styles.subTitle} tag="h2" direction="fromLeft">{watch("subtitle")}</HTag>
                <span className={styles.subText}>{parseToHTML(watch("subText"))}</span>

            </div>
            <Important className={styles.important}>{parseToHTML(watch("important"))}</Important>
            <div className={styles.withLine}>
                {parseToHTML(watch("extraText"))}
            </div>
            <Price price={watch("price") || ''} size="bigger" />
        </div>
    );
}
