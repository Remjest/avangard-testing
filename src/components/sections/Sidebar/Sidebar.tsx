'use client';

import classNames from 'classnames';
import styles from './Sidebar.module.css';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import Logo from './logo.png';
import Menu from '../../blocks/Menu/Menu';
import AdminMenu from '../../../app/(admin)/admin/admin-components/adminMenu/adminMenu';
import Link from 'next/link';
import ImgTag from '../../shared/ImgTag/ImgTag';


export interface SidebarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    menu: 'client' | 'admin',
    className?: string
}

export default function Sidebar({ menu, className, ...props }: SidebarProps) {

    
    return (
        <div className={classNames(styles.sidebar, className)} {...props}>
            <div className={styles.wrapper}>
                <Link href='/'><ImgTag src={Logo} className={styles.logo}/></Link>
                {menu === 'client' && <Menu />}
                {menu === 'admin' && <AdminMenu />}
            </div>
        </div>
    );
}