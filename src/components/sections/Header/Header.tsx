'use client';

import classNames from 'classnames';
import styles from './Header.module.css';
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './logo.png';
import Open from './open.svg';
import Close from './close.svg';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar/Sidebar';
import Link from 'next/link';
import ImgTag from '../../shared/ImgTag/ImgTag';

export interface HeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
    menu: 'admin' | 'client'
    className?: string,
}

export default function Header({ menu, className, ...props }: HeaderProps) {
    
    const [isOpened, setIsOpened] = useState<boolean>(false);

    const pathname = usePathname();

    useEffect(() => {
        setIsOpened(false);
    }, [pathname]);

    const variants = {
        opened: {
            opacity: 1,
            x: 0,
            transition: {
                stiffness: 20
            }
        },
        closed: {
            opacity: 0,
            x: '100%',
        }
    };

    return (
        <>
            <header className={classNames(styles.header, className)} {...props}>
                <Link href='/' className={styles.logo}><ImgTag src={Logo}/></Link>
                <Link href='/' className={styles.title}><div>ООО «АВАНГАРД»</div></Link>
                <div className={styles.menuOpen} onClick={() => setIsOpened(true)}><Open /></div>
                <motion.div
                    variants={variants}
                    initial='closed'
                    animate={isOpened ? 'opened' : 'closed'}
                    className={styles.mobileMenu}>
                    <Sidebar menu={menu} className={styles.sidebar} />
                    <Close className={styles.menuClose} onClick={() => setIsOpened(false)}/>
                </motion.div>
            </header>
        </>
    );
}