'use client';

import { DetailedHTMLProps, HTMLAttributes, JSX, useContext, useEffect } from "react";
import Home from './icons/home.svg';
import Services from './icons/user.svg';
import Expertise from './icons/doc.svg';
import styles from './adminMenu.module.css';
import MenuProvider, { AdminMenuContext, MenuContext } from "./adminMenu.context";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FirstLevelMenuItem } from "@/src/interfaces";
import classNames from "classnames";
import Button from "@/src/components/shared/Button/Button";

export interface AdminMenuProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export default function AdminMenu(): JSX.Element {
    return (
        <MenuProvider activeCategory={0}>
            <FirstLevel />
        </MenuProvider>
    );
}

function FirstLevel(props: AdminMenuProps) {
    const firstLevelMenu: FirstLevelMenuItem[] = [
        { route: 'admin', name: 'Все услуги', icon: <Home className={styles.nostroke}/>, id: 2, isNested: false },
        { route: 'admin/post-service', name: 'Добавить новую услугу', icon: <Services className={styles.nofill}/>, id: 0, isNested: false},
        { route: 'admin/post-subcategory', name: 'Добавить новую подкатегорию', icon: <Expertise className={styles.nofill}/>, id: 1, isNested: false},
    ];
    
    const pagePath = usePathname();
    const router = useRouter();
    
    const { activeCategory, setCategory } = useContext<AdminMenuContext>(MenuContext);

    useEffect(() => {
        const currentCategory = firstLevelMenu.find(category => {
            if (category.route === 'admin') {
                return pagePath === '/admin';
            }
            return pagePath.includes(category.route);
        });
        
        if (currentCategory && setCategory) {
            setCategory(currentCategory.id);
        }
    }, [pagePath, setCategory]);

    const handleLogout = () => {
        const isConfirmed = window.confirm("Вы точно хотите выйти?");

        if (isConfirmed) {
            localStorage.removeItem("token");
            router.push("/admin-login");
        }
        
    };

    const buildFirstLevel = () => {
        return (
            <div className={styles.firstLevelContainer} {...props}>
                {firstLevelMenu.map(category => {
                    const route = `/${category.route}`;
                    return (
                        <div key={category.name}>
                            <Link 
                                href={route} 
                                className={classNames(styles.firstLevel, {
                                    [styles.firstLevelActive]: category.id === activeCategory
                                })}
                            >
                                {category.icon}
                                <span>{category.name}</span>
                            </Link>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={styles.wrapper}>
            {buildFirstLevel()}
            <Button onClick={handleLogout}>
                Выйти
            </Button>
        </div>
    );
}