'use client';

import classNames from 'classnames';
import styles from './Sidebar.module.css';
import { DetailedHTMLProps, HTMLAttributes, useState } from 'react';
import Logo from './logo.png';
import Menu from '../../blocks/Menu/Menu';
import AdminMenu from '../../../app/(admin)/admin/admin-components/adminMenu/adminMenu';
import Link from 'next/link';
import ImgTag from '../../shared/ImgTag/ImgTag';
import Phone from './phone.png';
import WhatsApp from './whatsapp.png';
import Tg from './tg.png';
import Open from './open.png';
import Close from './close.png';


export interface SidebarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    menu: 'client' | 'admin',
    className?: string
}

export default function Sidebar({ menu, className, ...props }: SidebarProps) {

    const [opened, setOpened] = useState<boolean>(false);
    
    return (
        <>
            <div onClick={() => setOpened(false)}
                className={classNames(styles.hovering, {
                [styles.hoveringNone] : opened === false
            })}></div>
            <div className={styles.open} onClick={() => setOpened(true)}>
                <ImgTag src={Open} />
            </div>
            <div className={classNames(styles.sidebar, className, {
                [styles.sidebarOpened] : opened === true
            })} {...props}>
                <div className={styles.wrapper}>
                    <div className={styles.navigation}>
                        <Link href='/' className={styles.logo}><ImgTag src={Logo} /></Link>
                        <div onClick={() => setOpened(false)}>
                            <ImgTag src={Close} className={styles.close} />
                        </div>
                    </div>
                    {menu === 'client' && <Menu />}
                    {menu === 'admin' && <AdminMenu />}
                    {menu === 'client' && 
                        <>
                            <div className={styles.about}>
                                <span className="bold">ООО «Авангард»</span> — профессиональная экспертно-оценочная компания, предлагающая вам широкий спектр услуг по проведению независимой оценки и экспертизы в Томске.
                            </div>
                            <div className={styles.contacts}>
                                <Link className={styles.whatsAppButton} href="https://t.me/avangard70ru?text=Здравствуйте!" target="_blank" rel="noopener noreferrer" >
                                    <ImgTag className={styles.noBorder} src={Tg} />
                                </Link>
                                <Link className={styles.whatsAppButton} href="https://wa.me/79539193800?text=Здравствуйте!" target="_blank" rel="noopener noreferrer" >
                                    <ImgTag className={styles.noBorder} src={WhatsApp} />
                                </Link>
                                <Link className={styles.phoneButton} href="tel:83822233800">
                                    <ImgTag className={styles.noBorder} src={Phone} />
                                </Link>
                            </div>
                        </>
                    }
            </div>
            </div>
        </>
    );
}