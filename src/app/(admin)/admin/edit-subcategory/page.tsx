'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from './EditSubcategoryPage.module.css'
import ChangeButton from "../admin-components/ChangeButton/ChangeButton";
import { Subcategory } from "@/src/interfaces";
import HTag from "@/src/components/shared/HTag/HTag";
import { getSubcategory } from "@/src/api/getSubcategory";

export default function EditSubcategoryPage() {
    
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [newData, setNewData] = useState<Subcategory | undefined>(undefined);
    const [name, setName] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!id) return;

        async function loadData(subcategoryId: string) {
            const res = await getSubcategory(subcategoryId);
            if (!res.success) {
                console.error('Failed to load subcategoryData:', res.error);
                return;
            }
            setName(res.data.subcategoryName);
            setNewData(res.data);
        }

        loadData(id);
    }, [id]);

    return (
        <div className={styles.wrapper}>
            <HTag className={styles.h1} tag="h1" direction="fromRight">Изменение подкатегории { name}</HTag>
            
            <HTag className={styles.h3} tag="h3" direction="fromLeft">Введите новое название для подкатегории</HTag>
            <div className={styles.actionWrapper}>
                <input name="name" className={styles.nameInput} value={newData?.subcategoryName ?? ''}
                    onChange={(e) =>
                        setNewData(prev =>
                        prev
                            ? { ...prev, subcategoryName: e.target.value }
                            : { subcategoryName: e.target.value } as Subcategory
                        )
                    }
                />
                <ChangeButton className={styles.button} targetId={id ?? ''} entityType="subcategory" action="edit" newData={newData}>Отправить изменения</ChangeButton>
            </div>
        </div>
    );
}
