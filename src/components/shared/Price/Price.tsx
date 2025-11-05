import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import styles from './Price.module.css';
import classNames from "classnames";

export interface PriceProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    price: string
    size: "lower" | "bigger",
    className?: string,
}

export default function Price({ price, size, className, ...props} : PriceProps ) {

    return (
        <div className={classNames(styles.wrapper, className, {
            [styles.lower]: size === 'lower',
            [styles.bigger] : size === 'bigger'
        })}  {...props}>
            <div className={styles.lineLeft} />
            <div className={styles.title}>Стоимость услуги</div>
            <div className={styles.lineRight}/>
            
            <div className={styles.price}>{price}</div>
        </div>
    );
}