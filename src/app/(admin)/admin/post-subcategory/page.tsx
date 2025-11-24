'use client';

import styles from './PostSubcategoryPage.module.css';
import HTag from "@/src/components/shared/HTag/HTag";
import { useForm, SubmitHandler } from "react-hook-form";
import { postSubcategory } from "@/src/api/postSubcategory";
import { useRouter } from 'next/navigation';

type newData = {
    name: string,
    categoryId: string,
};

export default function PostSubcategoryPage() {

    const router = useRouter();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<newData>();

    const onSubmit: SubmitHandler<newData> = async (data, e) => {
        e?.preventDefault();
        const formattedName = data.name.trim();
        const res = await postSubcategory(formattedName, data.categoryId);
        if (!res.success) console.error(res.error);
        else {
            window.alert("Подкатегория добавлена!");
            router.push("/admin");
        }
    };

    return (
        <div className={styles.wrapper}>
            <HTag className={styles.h1} tag="h1" direction="fromRight">Добавление новой подкатегории</HTag>
            
            <form className={styles.actionWrapper} onSubmit={handleSubmit(onSubmit)}>
                <label className={styles.label}>Введите название для подкатегории</label>
                <input type="text"
                    placeholder="Введите новое название"
                    className={styles.nameInput}
                    {...register("name", { required:'Заполните поле' })}
                    
                />
                {errors.name && <div className={styles.err}> {errors.name.message} </div>}

                <label className={styles.label}>К какой категории будет принадлежать подкатегория?</label>
                <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                        <input 
                            type="radio"
                            value="1"
                            {...register("categoryId", { required: 'Выберите категорию' })}
                        />
                        Услуги
                    </label>
                    
                    <label className={styles.radioLabel}>
                        <input 
                            type="radio"
                            value="2"
                            {...register("categoryId", { required: 'Выберите категорию' })}
                        />
                        Экспертизы
                    </label>
                </div>
                {errors.categoryId && <div className={styles.err}>{errors.categoryId.message}</div>}
                <button className={styles.button} type="submit">Отправить изменения</button>
            </form>
        </div>
    );
}
