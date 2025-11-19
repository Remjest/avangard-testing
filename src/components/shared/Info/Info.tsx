import { DetailedHTMLProps, HTMLAttributes, ReactNode} from "react";
import styles from './Info.module.css';
import classNames from "classnames";
import ImgTag from "../ImgTag/ImgTag";

export interface InfoProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    title?: string,
    image?: string;
    className?: string,
    children: ReactNode,
}

export default function Info({ title, image, className, children, ...props} : InfoProps ) {

    return (
        <div className={classNames(styles.wrapper, className, {
            [styles.withImage]: image,
            [styles.withoutImage]: !image,
        })}>
            {title && <h3 className={styles.title} {...props}>{title}</h3>}
            <div className={classNames(styles.text, {
                [styles.bigger]: image,
                [styles.lower]: !image,
            })}>{children}</div>
            {image && <ImgTag width={50} height={50} src={image} className={styles.image}/>}
        </div>
    );
}