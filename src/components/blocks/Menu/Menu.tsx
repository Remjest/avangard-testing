'use client';

import { DetailedHTMLProps, HTMLAttributes, JSX, useContext, useEffect, useState } from "react";
import Home from './icons/home.svg';
import Services from './icons/user.svg';
import Expertise from './icons/doc.svg';
import Roadacc from './icons/book.svg';
import Contacts from './icons/phone.svg';
import Payment from './icons/pay.svg';
import styles from './Menu.module.css';
import MenuProvider, { IMenuContext, MenuContext } from "./menu.context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from 'framer-motion';
import { Category, FirstLevelMenuItem, Subcategory } from "@/src/interfaces";
import { getMenu } from "@/src/api/menu";
import classNames from "classnames";

export interface MenuProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export default function Menu(props: MenuProps): JSX.Element {
    
    return (
        <MenuProvider activeCategory={0}>
            <FirstLevel {...props} />
        </MenuProvider>
        );
}

function FirstLevel( props: MenuProps) {

    const firstLevelMenu: FirstLevelMenuItem[] = [
        { route: '', name: 'Главная', icon: <Home className={styles.nostroke}/>, id: 2, isNested: false },
        { route: 'services', name: 'Услуги оценки', icon: <Services className={styles.nofill}/>, id: 0, isNested: true},
        { route: 'expertise', name: 'Наши экспертизы', icon: <Expertise className={styles.nofill}/>, id: 1, isNested: true},
        { route: 'roadaccident', name: 'Юридическая помощь при дтп', icon: <Roadacc className={styles.nostroke}/>, id: 3 , isNested: false},
        { route: 'contacts', name: 'Контакты', icon: <Contacts className={styles.nostroke}/>, id: 4, isNested: false },
        { route: 'payment', name: 'Способы оплаты', icon: <Payment className={styles.nostroke} />, id: 5, isNested: false },
    ];
    
    const pagePath = usePathname();
    
    const { activeCategory, activeSubcategory, setCategory, setSubcategory } = useContext<IMenuContext>(MenuContext);

    const [menuData, setMenuData] = useState<Category[] | null>(null);

    useEffect(() => {
        const loadMenu = async () => {
            const res = await getMenu();
            if (res.success) {
                setMenuData(res.data);
            }
            else {
                console.error('Failed to load menu:', res.error);
                setMenuData(null);
            }
        };

        loadMenu();
    }, []);

    useEffect(() => {
        const currentCategory = firstLevelMenu.find(category => {
            if (category.route === '') {
                return pagePath === '/';
            }
            return pagePath.includes(category.route);
        });
        
        if (currentCategory && setCategory) {
            setCategory(currentCategory.id);
        }

        if (currentCategory && menuData && menuData[currentCategory.id]) {
            const categoryData = menuData[currentCategory.id];
            
            const activeSubcat = categoryData.subcategories?.find(subcat => 
                subcat.services?.some(service => {
                    const servicePath = `/${currentCategory.route}/${service.alias}`;
                    return pagePath.includes(servicePath);
                })
            );
            
            if (activeSubcat && setSubcategory && activeSubcat.subcategoryId !== activeSubcategory) {
                setSubcategory(activeSubcat.subcategoryId);
            }
        }
    }, [pagePath]);
    
    const variantsFirst = {
        visible: {
            height:'auto',
            marginTop: 23,
        },
        hidden: {
            height: 0,
            marginTop: 0,
        }
    };

    const variantsSecond = {
        visible: {
            marginTop: 22,
            height: 'auto',
            transition: {
                when: 'beforeChildren',
                staggerChildren: 0.05
            }
        },
        hidden: {
            paddingTop: 0,
            height: 0,
        }
    };

    const variantsThird = {
        visible: {
            opacity: 1,
        },
        hidden: {
            opacity: 0,
        }
    };

    const buildFirstLevel = (props: MenuProps) => {
        
        return (
            <div className={styles.firstLevelContainer} {...props}>
                {firstLevelMenu.map(category => 
                {
                    const route = `/${category.route}`;
                    return (
                        <div key={category.name} onClick={() => {
                        }}>
                                <Link href={route} className={classNames(styles.firstLevel, {
                                    [styles.firstLevelActive]: category.id === activeCategory
                                }
                                )}>
                                    {category.icon}
                                    <span>{category.name}</span>
                                </Link>
                            {category.isNested && buildSecondLevel(category.id, route)}
                        </div>);
                }
                )}
            </div>
        );
    };

    const buildSecondLevel = (category: number, prewRoute: string) => {

        if (!menuData) {
            return null;
        }

        if (menuData[category]) {
            return (
                menuData[category].subcategories?.length != 0 && <motion.div
                    variants={variantsFirst}
                    initial={category === activeCategory ? 'visible' : 'hidden'}
                    animate={category === activeCategory ? 'visible' : 'hidden'}
                    className={styles.secondLevelContainer}>
                    {menuData[category].subcategories?.map(sbct => {
                        if (!sbct.services || sbct.services.length === 0) {
                            return null;
                        }
                        else if (sbct.services.length === 1) {
                            const linkPath = `${prewRoute}/${sbct.services[0].alias}`;

                            return (
                                <Link href={linkPath} key={sbct.subcategoryId} className={classNames(styles.secondLevel, {
                                    [styles.secondLevelActive] : sbct.subcategoryId === activeSubcategory
                                })}
                                    onClick={() => {
                                        setSubcategory && setSubcategory(sbct.subcategoryId);
                                    }}>
                                    <span>
                                        {sbct.services[0].title}
                                    </span>
                                </Link>
                            );
                        } else {
                            return (
                                <div key={sbct.subcategoryId} className={classNames(styles.secondLevel, {
                                    [styles.secondLevelActive] : sbct.subcategoryId === activeSubcategory
                                })}
                                    onClick={() => {
                                        setSubcategory && setSubcategory(sbct.subcategoryId);
                                    }}>
                                    <span>
                                        {sbct.subcategoryName}
                                    </span>
                                    <motion.div
                                        layout
                                        variants={variantsSecond}
                                        initial={'hidden'}
                                        animate={sbct.subcategoryId === activeSubcategory ? 'visible' : 'hidden'}
                                        className={styles.thirdLevelContainer}>
                                        {buildThirdLevel(sbct, prewRoute)}
                                    </motion.div>
                                </div>
                            );
                        }
                    })}
                </motion.div>
            );
        }
        
    };

    const buildThirdLevel = (subcategory: Subcategory, route: string) => {
        return subcategory.services?.map(service => {
            const linkPath = `${route}/${service.alias}`;
            const isActive = pagePath.includes(linkPath);

            return (
                <motion.div
                    variants={variantsThird}
                    key={service.serviceId}>
                    <Link
                        href={linkPath}
                        className={classNames(styles.thirdLevel, {
                            [styles.thirdLevelActive]: isActive
                        })}
                    >
                        {service.title}
                    </Link>
                </motion.div>
            );
        }) ?? null;
    };

    return (
        <>
            {buildFirstLevel(props)}
        </>
    );
}