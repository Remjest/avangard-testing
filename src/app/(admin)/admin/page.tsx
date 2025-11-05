import styles from './Admin.module.css'
import HTag from "@/src/components/shared/HTag/HTag";
import { getAllData } from "@/src/api/allData";
import React from "react";
import Link from "next/link";
import DeleteButton from "./admin-components/ChangeButton/ChangeButton";
import Edit from './icons/edit.svg';
import Delete from './icons/delete.svg';


export const dynamic = "force-dynamic";

export default async function AdminPage() {

    const res = await getAllData(false);
    if (!res.success) console.error('Failed to load adminAllData:', res.error);
    const allData = res.success ? res.data : null;

    return (
        <>
            <HTag className={styles.h1} tag="h1" direction="fromRight">Панель администратора</HTag>
            
            {!allData && <p>Не удалось загрузить информацию</p>}
            {allData && allData.map((category) => {
                return (<div key={category.categoryId} className={styles.categoryContainer}>
                    <div className={styles.categoryTitle}>{category.categoryName}</div>
                    <div className={styles.subcategoriesContainer}>
                        {category.subcategories && (category.subcategories.length !== 0) && category.subcategories.map((subcategory) => {
                            return (
                                <React.Fragment key={subcategory.subcategoryId}>
                                    <div className={styles.subcategory}>
                                        <span>{subcategory.subcategoryName}</span>
                                        <div />
                                        <Link href={{ pathname: 'admin/edit-subcategory', query: { id: subcategory.subcategoryId } }}><Edit className={styles.button}/></Link>
                                        <DeleteButton className={styles.button} targetId={subcategory.subcategoryId.toString()} entityType="subcategory" action="delete"><Delete/></DeleteButton>
                                    </div>
                                    {subcategory.services && (subcategory.services.length !== 0) && 
                                        <div className={styles.servicesContainer}>
                                            {subcategory.services.map((service) =>
                                                <div key={service.serviceId} className={styles.service}>
                                                    <span>{service.title}</span>
                                                    <div />
                                                    <Link href={{ pathname: 'admin/edit-service', query: { id: service.serviceId } }}><Edit className={styles.button}/></Link>
                                                    <DeleteButton className={styles.button} targetId={service.serviceId.toString()} entityType="service" action="delete"><Delete/></DeleteButton>
                                                </div>)}
                                        </div>
                                    }
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>)
            })}
        </>
    );
}
