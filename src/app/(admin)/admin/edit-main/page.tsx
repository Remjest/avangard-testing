"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from './EditMainPage.module.css';
import gStyles from './../../../(site)/Global.module.css';
import HTag from "@/src/components/shared/HTag/HTag";
import ImgTag from "@/src/components/shared/ImgTag/ImgTag";
import Price from "@/src/components/shared/Price/Price";
import { parseToHTML } from "@/src/helpers";
import Important from "@/src/components/shared/Important/Important";
import { Main } from "@/src/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import classNames from "classnames";
import { postImage } from "@/src/api/postImage";
import Video from "@/src/components/shared/Video/Video";
import { postVideo } from "@/src/api/postVideo";
import Hero from "@/src/components/blocks/Hero/Hero";
import Info from "@/src/components/shared/Info/Info";
import { getMainPage } from "@/src/api/mainPage";
import { editMainPage } from "@/src/api/editMain";
import React from "react";

export default function EditServicePage() {
    const router = useRouter();

    const [data, setData] = useState<Main | undefined>(undefined);
    const [video, setVideo] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [icons, setIcons] = useState<string[]>([]);

    type FormValues = Main & {
        videoFile: FileList | null;
        previewImage: FileList | null;
        icons: FileList[];
    };

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormValues>();

    const watchAll = watch();

    useEffect(() => {

        async function loadData() {
            const res = await getMainPage();
            if (!res.success) {
                console.error('Failed to load subcategoryData:', res.error);
                return;
            }
            setData(res.data);
            reset(res.data);
        }

        loadData();

    }, [reset]);
    
    const onSubmit: SubmitHandler<FormValues> = async (newData, e) => {
        e?.preventDefault();
        
        const { videoFile, previewImage, icons, ...mainData } = newData;

        let newVideoLink = newData.about.videoURL;
        let newPropertyValuationImage = newData.propertyValuation.imageURL;
        const newIconsLinks = newData.workPrinciples.map(principle => principle.iconURL);

        if (videoFile && videoFile[0]) {
            const uploadVideo = await postVideo(videoFile[0]);
            if (uploadVideo.success) {
                newVideoLink = uploadVideo.data;
                console.log(newVideoLink);
            }
            else window.alert("Ошибка загрузки видео - будет использовано старое.");
        }

        if (previewImage && previewImage[0]) {
            const uploadPreview = await postImage(previewImage[0]);
            if (uploadPreview.success) newPropertyValuationImage = uploadPreview.data;
            else window.alert("Ошибка загрузки превью - будет использовано старое изображение.");
        }
        
        for (let i = 0; i < icons.length; i++) {
            const icon = icons[i];

            if (icon && icon[0]) {
                const uploadIcon = await postImage(icon[0]);

                if (uploadIcon.success) {
                    newIconsLinks[i] = uploadIcon.data;
                } else {
                    window.alert(`Ошибка загрузки иконки ${i} - будет использовано старое изображение.`);
                }
            }
        }

        const editData: Main = {
            ...data,
            ...mainData,
            about: {
                ...data?.about,
                ...mainData.about,
                videoURL: newVideoLink
            },
            propertyValuation: {
                ...data?.propertyValuation,
                ...mainData.propertyValuation,
                imageURL: newPropertyValuationImage
            },
            workPrinciples: newIconsLinks.map((link, i) => {
                const newPrinciple = {
                    ...data?.workPrinciples[i],
                    ...mainData.workPrinciples[i],
                    iconURL: link
                };
                return newPrinciple;
            })
        };
        
        
        const isConfirmed = window.confirm("Вы действительно хотите изменить главную страницу? Вернуть изменения будет нельзя.");
        if (!isConfirmed) return;

        const { success } = await editMainPage(editData);
        if (success) {
            router.push("/admin");
        }
        else window.alert("При попытке изменения произошла ошибка.");
    };

    return (
        <div className={styles.wrapper}>
            <HTag className={styles.h1} tag="h2" direction="fromRight">Редактирование услуги</HTag>
            <form className={styles.actionWrapper} onSubmit={handleSubmit(onSubmit)}>
                <label className={styles.tip}>
                    {parseToHTML('/bold/Справка по тегам форматирования://bold//')} <br /> <br />
                    Вы можете использовать специальные теги для оформления текста прямо внутри поля ввода.<br /><br />

                    /bold/…//bold// — делает текст жирным. <br /><span className={styles.tipGreen}>Пример:</span> /bold/Это важно!//bold// → {parseToHTML('/bold/Это важно!//bold//')}<br /><br />

                    /italic/…//italic// — делает текст курсивным. <br /><span className={styles.tipGreen}>Пример:</span> /italic/Пример текста//italic// → {parseToHTML('/italic/Пример текста//italic//')}<br /><br />

                    /link source='https://...' /текст//link// — добавляет ссылку.  
                    Внутри укажите текст, который будет кликабельным. <br />
                    <span className={styles.tipGreen}>Пример:</span>  
                    /link source="https://google.com"/ Перейти на сайт //link// → {parseToHTML('/link source="https://google.com"/ Перейти на сайт //link//')}<br /><br />

                    /n/ — перенос строки. <br /><span className={styles.tipGreen}>Пример: </span>• Первая строка /n/• Вторая строка → {parseToHTML('/n/• Первая строка /n/• Вторая строка')}<br /><br />
                    Чтобы отделить текст одной или несколькими строками, введите несколько тэгов подряд. <br /> <span className={styles.tipGreen}>Пример:</span> Первая строка /n//n/ Вторая строка → {parseToHTML('/n/Первая строка /n//n/ Вторая строка')}
                    <br /><br />

                    Теги всегда пишутся со слэшами и должны закрываться: /bold/текст//bold//, /italic/текст//italic//, /link source='...' /текст//link//.<br /><span className={styles.tipRed}>Исключение</span> — /n/, он не требует закрытия. <br /><br />

                    Теги можно вкладывать друг в друга, главное — закрывать их в правильном порядке.<br />
                    <span className={styles.tipGreen}>Пример:</span> /bold/Жирный и /italic/курсивный текст со /link source="https://google.com"/ ссылкой //link// //italic// //bold// → {parseToHTML('/bold/Жирный и /italic/курсивный текст со /link source="https://google.com"/ ссылкой //link////italic// //bold//')}<br /><br />
                    Тэги можно использовать не во всех полях услуги: мы подписали, где тэги будут обрабатываться, а где нет. <br />Вы всегда можете проверить, правильно ли обработались тэги — просто посмотрите на получившуюся услугу снизу. <br /><br />
                    Также вы можете использовать невидимые символы для создания отступов нужной вам длины. Можете скопировать этот символ из скобок: [ㅤ]
                </label>

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
                    {...register("metaTitle", {
                        maxLength: {
                            value: 255,
                            message: "Длина должна быть меньше 255 символов"
                        }
                    })}
                />
                {errors.metaTitle && <div className={styles.err}> {errors.metaTitle.message} </div>}

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
                    {...register("metaDescription", {
                        maxLength: {
                            value: 400,
                            message: "Длина должна быть меньше 400 символов"
                        }
                    })}
                />
                {errors.metaDescription && <div className={styles.err}> {errors.metaDescription.message} </div>}

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
                    {...register("metaKeywords", {
                        maxLength: {
                            value: 255,
                            message: "Длина должна быть меньше 255 символов"
                        }
                    })}
                />
                {errors.metaKeywords && <div className={styles.err}> {errors.metaKeywords.message} </div>}

                
                <label className={styles.bigLabel}>РАЗДЕЛ: О КОМПАНИИ</label>

                <label className={styles.label}>Введите информацию о компании</label>
                <label className={styles.tip}>
                    <span className={styles.tipGreen}>ТЭГИ: обрабатываются </span><br /><br />
                    <span className={styles.tipGreen}>Обязательное поле </span><br />
                </label>
                {data?.about.info.map((_, i) => {
                    return (
                        <React.Fragment key={i}>
                            <textarea
                                placeholder={`Текст ${i + 1}`}
                                className={styles.textarea}
                                {...register(`about.info.${i}`, {
                                    required: 'Заполните поле',
                                    maxLength: {
                                        value: 1000,
                                        message: "Длина должна быть меньше 1000 символов"
                                    }
                                })}
                            />
                            {errors.about?.info?.[i] && <div className={styles.err}> {errors.about.info[i]?.message} </div>}
                        </React.Fragment>
                    );
                })}

                <label className={styles.label}>Введите важную информацию</label>
                <label className={styles.tip}>
                    <span className={styles.tipGreen}>ТЭГИ: обрабатываются </span><br /><br />
                    <span className={styles.tipGreen}>Необязательное поле </span><br />
                </label>
                <textarea
                    placeholder="Введите важную информацию"
                    className={styles.textarea}
                    {...register("about.important", {
                        maxLength: {
                            value: 1000,
                            message: "Длина должна быть меньше 1000 символов"
                        }
                    })}
                />
                {errors.about?.important && <div className={styles.err}> {errors.about?.important.message} </div>}
                
                <label className={styles.label}>Выберите видео</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>ТЭГИ: не обрабатываются </span><br /><br />
                    <span className={styles.tipRed}>Обязательное поле </span><br />
                </label>
                <input
                    className={styles.hiddenInput}
                    type="file"
                    id="videoInput"
                    accept="video/*"
                    {...register("videoFile", {
                        onChange: (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            if (video) URL.revokeObjectURL(video);
                            setVideo(URL.createObjectURL(file));
                        }
                        },
                    })}
                />
                <label htmlFor="videoInput" className={styles.uploadLabel}>
                    {video ? "Изменить видео" : "Загрузить видео"}
                </label>
                {video ?
                    <Video className={classNames(styles.preview)} videoUrl={video} /> :
                    (data && data.about.videoURL) ?
                        <Video className={classNames(styles.preview)} videoUrl={`${process.env.NEXT_PUBLIC_DOMAIN}${data.about.videoURL}`} /> :
                        <ImgTag className={classNames(styles.preview)} src='/default.jpg' alt="Здесь будет ваше видео" width={800} height={600} />
                }
                {errors.videoFile && <div className={styles.err}>{errors.videoFile.message}</div>}


                {/* <label className={styles.bigLabel}>РАЗДЕЛ: ОЦЕНКА НЕДВИЖИМОСТИ</label>

                <label className={styles.label}>Введите информацию об услуге</label>
                <label className={styles.tip}>
                    <span className={styles.tipGreen}>ТЭГИ: обрабатываются </span><br /><br />
                    <span className={styles.tipRed}>Обязательное поле </span><br />
                </label>
                <textarea
                    placeholder="Введите  информацию об услуге"
                    className={styles.textarea}
                    {...register("propertyValuation.info", {
                        required: 'Заполните поле',
                        maxLength: {
                            value: 2000,
                            message: "Длина должна быть меньше 2000 символов"
                        }
                    })}
                />
                {errors.propertyValuation?.info && <div className={styles.err}> {errors.propertyValuation.info.message} </div>}

                <label className={styles.label}>Введите цену</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>ТЭГИ: не обрабатываются </span><br /><br />
                    <span className={styles.tipGreen}>Необязательное поле </span><br /><br />
                    Вы можете написать цену как вам захочется. Например: "от 3000 ₽", "ИНДИВИДУАЛЬНО" и т. д.
                </label>
                <input type="text"
                    placeholder="Введите цену"
                    className={styles.input}
                    {...register("propertyValuation.price", {
                        maxLength: {
                            value: 255,
                            message: "Длина должна быть меньше 255 символов"
                        }
                    })}
                    
                />
                {errors.propertyValuation?.price && <div className={styles.err}> {errors.propertyValuation.price.message} </div>}

                <label className={styles.label}>Выберите изображение для отображения на превью</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>ТЭГИ: не обрабатываются </span><br /><br />
                    <span className={styles.tipGreen}>Необязательное поле </span><br /><br />
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
                <ImgTag className={classNames(styles.preview)} src={preview ? preview  : data?.propertyValuation.imageURL ? `${process.env.NEXT_PUBLIC_DOMAIN}${data.propertyValuation.imageURL}` : '/default.jpg'} alt="Здесь будет ваше превью" width={800} height={600} />
                {errors.previewImage && <div className={styles.err}>{errors.previewImage.message}</div>} */}

                
                <label className={styles.bigLabel}>РАЗДЕЛ: ПРИНЦИПЫ РАБОТЫ НАШЕЙ КОМПАНИИ</label>

                <label className={styles.label}>Введите принципы компании</label>
                <label className={styles.tip}>
                    <span className={styles.tipRed}>ТЭГИ: необрабатываются </span><br /><br />
                    <span className={styles.tipRed}>Обязательное поле</span><br />
                </label>
                {data?.workPrinciples.map((_, i) => {
                    return (
                        <React.Fragment key={i}>
                            <label className={styles.label}>Принцип №{ i+1 }</label>
                            
                            <textarea
                                placeholder={`Текст ${i + 1}`}
                                className={styles.textarea}
                                {...register(`workPrinciples.${i}.text`, {
                                    required: 'Заполните поле',
                                    maxLength: {
                                        value: 250,
                                        message: "Длина должна быть меньше 2000 символов"
                                    }
                                })}
                            />
                            {errors.workPrinciples?.[i]?.text && <div className={styles.err}> {errors.workPrinciples[i]?.text.message} </div>}

                            
                            <input
                                className={styles.hiddenInput}
                                type="file"
                                id={`iconInput-${i}`}
                                accept="image/*"
                                {...register(`icons.${i}`, {
                                    onChange: (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (icons[i]) URL.revokeObjectURL(icons[i]);
                                        const newIcon = URL.createObjectURL(file);
                                        setIcons(prev => {
                                            const updated = [...prev];
                                            updated[i] = newIcon;
                                            return updated;
                                        });
                                    }
                                    },
                                })}
                            />
                            <label htmlFor={`iconInput-${i}`} className={styles.uploadLabel}>
                                {icons[i] ? "Изменить изображение" : "Загрузить изображение"}
                            </label>
                            <ImgTag className={classNames(styles.icon)} src={icons[i] ? icons[i]  : data?.workPrinciples[i].iconURL ? `${process.env.NEXT_PUBLIC_DOMAIN}${data?.workPrinciples[i].iconURL}` : '/default.jpg'} alt="Здесь будет иконка" width={50} height={50} />
                            {errors.icons?.[i] && <div className={styles.err}>{errors.icons?.[i].message}</div>}
                        </React.Fragment>
                    );
                })}


                <label className={styles.label}>Введите преимущества компании</label>
                
                {data?.advantages.map((_, i) => {
                    return (
                        <React.Fragment key={i}>
                            <label className={styles.label}>Пункт {i + 1}</label>
                            <label className={styles.tip}>
                                <span className={styles.tipRed}>ТЭГИ: необрабатываются</span><br /><br />
                                <span className={styles.tipRed}>Обязательное поле</span><br />
                            </label>
                            <textarea
                                placeholder={`Заголовок ${i + 1}`}
                                className={styles.textarea}
                                {...register(`advantages.${i}.header`, {
                                    required: true,
                                    maxLength: {
                                        value: 250,
                                        message: "Длина должна быть меньше 250 символов"
                                    }
                                })}
                            />
                            {errors.workPrinciples?.[i]?.text && <div className={styles.err}> {errors.workPrinciples[i]?.text.message} </div>}

                            <label className={styles.tip}>
                                <span className={styles.tipGreen}>ТЭГИ: обрабатываются</span><br /><br />
                                <span className={styles.tipRed}>Обязательное поле</span><br />
                            </label>
                            <textarea
                                placeholder={`Текст ${i + 1}`}
                                className={styles.textarea}
                                {...register(`advantages.${i}.description`, {
                                    required: true,
                                    maxLength: {
                                        value: 250,
                                        message: "Длина должна быть меньше 250 символов"
                                    }
                                })}
                            />
                            {errors.advantages?.[i]?.header && <div className={styles.err}> {errors.advantages[i]?.header.message} </div>}
                        </React.Fragment>
                    );
                })}
                
                <button className={styles.button} type="submit">Отправить изменения</button>
                <label className={styles.label}>Как все будет на странице можете посмотреть ниже</label>
            </form>



            <Hero />
            <div className={styles.wrapper}>
                <HTag className={styles.h1} tag="h2" direction="fromRight">О КОМПАНИИ</HTag>
                <div className={gStyles.sectionWrapper}>
                    <div className={styles.fourGrid}>
                        {watchAll?.about?.info?.map((point, idx) =>
                            <Info key={idx}>{parseToHTML(point)}</Info>
                        )}
                    </div>
                    <Video videoUrl={video || `${process.env.NEXT_PUBLIC_DOMAIN}${data?.about.videoURL}`} />
                    <Important>
                        {parseToHTML(watchAll?.about?.important || "")}
                    </Important>
                </div>
                {/* <HTag className={styles.h1} tag="h2" direction="fromRight">ОЦЕНКА НЕДВИЖИМОСТИ</HTag>
                <div className={styles.textWrapper}>
                    <div className={styles.bigText}>
                        {parseToHTML(watchAll?.propertyValuation?.info || "")}
                    </div>
                    <div className={styles.home}>
                        <ImgTag
                            className={styles.homeImg}
                            src={
                                preview
                                    ? preview
                                    : watchAll?.propertyValuation?.imageURL
                                        ? `${process.env.NEXT_PUBLIC_DOMAIN}${watchAll.propertyValuation.imageURL}`
                                        : '/default.jpg'
                            }
                        />

                        <Price price={watchAll?.propertyValuation?.price || ""} size="lower"/>
                    </div>
                </div> */}
                <HTag className={styles.h1} tag="h2" direction="fromRight">ПРИНЦИПЫ РАБОТЫ НАШЕЙ КОМПАНИИ</HTag>
                <div className={gStyles.sectionWrapper}>
                    <div className={styles.fourGrid}>
                        {watchAll?.workPrinciples?.map((principle, i) => (
                            <Info 
                                key={i} 
                                image={
                                    icons[i] ||
                                    (principle.iconURL ? `${process.env.NEXT_PUBLIC_DOMAIN}${principle.iconURL}` : "/default.jpg")
                                }
                            >
                                {parseToHTML(principle.text || "")}
                            </Info>
                        ))}
                    </div>
                </div>
                <HTag className={styles.h1} tag="h2" direction="fromRight">ПРЕИМУЩЕСТВА СОТРУДНИЧЕСТВА С НАМИ</HTag>
                <div className={gStyles.sectionWrapper}>
                    <div className={styles.fourGrid}>
                        {watchAll?.advantages?.map((advantage, i) => (
                            <Info key={i} title={advantage.header}>
                                {parseToHTML(advantage.description || "")}
                            </Info>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


