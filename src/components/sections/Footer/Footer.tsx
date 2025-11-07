import styles from './Footer.module.css';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import Logo from './logo.svg';
import Geo from './geo.svg';
import Time from './time.svg';
import Mail from './mail.svg';
import Num from './num.svg';
import Link from 'next/link';
import classNames from 'classnames';

export interface FooterProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>{
    className?: string,
}

export default function Footer({className,...props}: FooterProps) {
    
    return (
        <footer className={classNames(styles.footer, className)} {...props}>
            <div className={styles.wrapper}>
                <div className={styles.logo}>
                    <Logo className={styles.logoImg}/>
                    <span>ООО «АВАНГАРД»</span>
                </div>
                <div className={styles.border}></div>
                <nav className={styles.nav}>
                    <Link className={styles.point} href={'https://yandex.ru/maps/org/nezavisimaya_ekspertiza_avangard/39409741898/?ll=84.988234%2C56.513045&z=17'} target='_blank'>
                        <Geo/>
                        г. Томск, ул. Интернационалистов 2а, офис 5
                    </Link>
                    
                    <span className={styles.point}>
                        <Time />
                        Пн-пт: 10:00 - 19:00
                    </span>
                    <div className={classNames(styles.point, styles.phone)}>
                        <Num/>
                        <Link href="tel:89539193800">+7 (953) 919-3800</Link>
                        <span>/</span>
                        <Link href="tel:83822233800">+7 (3822) 233-800</Link>
                    </div>
                    <Link className={styles.point} href="mailto:expert233800@mail.ru">
                        <Mail/>
                        expert233800@mail.ru
                    </Link>
                    
                </nav>
            </div>
        </footer>
    );
}