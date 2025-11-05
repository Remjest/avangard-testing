import { createContext, PropsWithChildren, useState } from "react";


export interface AdminMenuContext {
    currentPathName?: string,
    activeCategory: number,
    setCategory?: (newCategory: number) => void,
}

export const MenuContext = createContext<AdminMenuContext>({activeCategory: 2 });

export default function MenuProvider ({ children }: PropsWithChildren<AdminMenuContext>) {
    const [newCategory, setCategoryState] = useState<number>(2);
    const setCategory = (newCategory: number) => {
        setCategoryState(newCategory);
    };

    return <MenuContext value={{ activeCategory: newCategory, setCategory }}>
        {children}
    </MenuContext>;
}