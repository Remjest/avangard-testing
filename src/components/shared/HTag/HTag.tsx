import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import styles from './HTag.module.css';
import classNames from "classnames";

export interface HTagProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    tag: 'h1' | 'h2' | 'h3',
    direction: 'fromLeft' | 'fromRight',
    children: ReactNode,
    className?: string,
}

export default function HTag({ tag, direction, children, className, ...props} : HTagProps ) {

    return (
        <>
            {tag === "h1" && <h1 className={classNames(styles.title, styles.h12, className, {
                [styles.left]: direction === 'fromLeft',
                [styles.right]: direction === 'fromRight',
            })} {...props}>{children}</h1>}
            {tag === "h2" && <h2 className={classNames(styles.title, styles.h12, className, {
                [styles.left]: direction === 'fromLeft',
                [styles.right]: direction === 'fromRight',
            })} {...props}>{children}</h2>}
            {tag === "h3" && <h3 className={classNames(styles.title, styles.h3, className, {
                [styles.left]: direction === 'fromLeft',
                [styles.right]: direction === 'fromRight',
            })} {...props}>{children}</h3>}
        </>
    )
}