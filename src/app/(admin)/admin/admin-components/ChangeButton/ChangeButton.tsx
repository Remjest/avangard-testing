"use client";

import { ButtonHTMLAttributes, DetailedHTMLProps, JSX, ReactNode } from "react";
import { deleteService } from "@/src/api/deleteService";
import { deleteSubcategory } from "@/src/api/deleteSubcategory";
import { useRouter } from "next/navigation";
import { editSubcategory } from "@/src/api/editSubcategory";
import { Service, Subcategory } from "@/src/interfaces";

export interface ChangeButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    action: 'delete' | 'edit',
    targetId: string,
    newData?: Service | Subcategory,
    entityType: "subcategory" | "service",
    className?: string,
    children: ReactNode,
}

export default function ChangeButton({ action, targetId, newData, entityType, className, children }: ChangeButtonProps): JSX.Element {
    
    const router = useRouter();
    
    const handleDeleteButton = async (targetId: string, entityType: "subcategory" | "service") => {
        if (entityType === "subcategory") {
            const isConfirmed = window.confirm("Вы действительно хотите удалить подкатегорию? Она будет удалена со всеми услугами, входящими в нее. Ее нельзя будет восстановить.");
            if (isConfirmed) {
                const { success } = await deleteSubcategory(targetId);
                if (success) router.refresh();
                else window.alert("При попытке удаления произошла ошибка.");
            }
        }
        if (entityType === "service") {
            const isConfirmed = window.confirm("Вы действительно хотите удалить услугу? Ее нельзя будет восстановить.");
            if (isConfirmed) {
                const { success } = await deleteService(targetId);
                if (success) router.refresh();
                else window.alert("При попытке удаления произошла ошибка.");
            }
        }
    };

    const handleEditButton = async (targetId: string, entityType: "subcategory" | "service", newData: Service | Subcategory) => {
        if (entityType === "subcategory") {
            const isConfirmed = window.confirm("Вы действительно хотите изменить подкатегорию? Вернуть изменения будет нельзя.");
            if (isConfirmed) {
                const { success } = await editSubcategory(targetId, newData as Subcategory);
                if (success) {
                    window.alert("Изменения сохранены!");
                    router.push("/admin");
                }
                else window.alert("При попытке изменения произошла ошибка.");
            }
        }
    };

    return (
        <button className={className} onClick={() => {
            if (action === 'delete') handleDeleteButton(targetId, entityType);
            if (action === 'edit' && newData) handleEditButton(targetId, entityType, newData);
        }} >{children}</button>
    );
}