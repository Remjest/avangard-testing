import { createContext, PropsWithChildren, useState } from "react";


export interface IMenuContext {
    currentPathName?: string,
    activeCategory: number,
    activeSubcategory?: number,
    setCategory?: (newCategory: number) => void,
    setSubcategory?: (newSubcategory: number | undefined) => void,
}

export const MenuContext = createContext<IMenuContext>({activeCategory: 2 });

export default function MenuProvider ({ children }: PropsWithChildren<IMenuContext>) {
    const [newCategory, setCategoryState] = useState<number>(2);
    const setCategory = (newCategory: number) => {
        setCategoryState(newCategory);
    };

    const [newSubcategory, setSubcategoryState] = useState<number | undefined>(undefined);
    const setSubcategory = (newSubcategory: number | undefined) => {
        setSubcategoryState(newSubcategory);
    };

    return <MenuContext.Provider value={{ activeCategory: newCategory, activeSubcategory: newSubcategory, setCategory, setSubcategory }}>
        {children}
    </MenuContext.Provider>;
}