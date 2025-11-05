import { DetailedHTMLProps, HTMLAttributes, ReactNode} from "react";
import styles from './Info.module.css';
import classNames from "classnames";
import Image, { StaticImageData } from "next/image";

export interface InfoProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    title?: string,
    image?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    className?: string,
    children: ReactNode,
}

export default function Info({ title, image: ImageComp, className, children, ...props} : InfoProps ) {

    return (
        <div className={classNames(styles.wrapper, className, {
            [styles.withImage]: ImageComp,
            [styles.withoutImage]: !ImageComp,
        })}>
            {title && <h3 className={styles.title} {...props}>{title}</h3>}
            <div className={classNames(styles.text, {
                [styles.bigger]: ImageComp,
                [styles.lower]: !ImageComp,
            })}>{children}</div>
            {ImageComp && <ImageComp className={styles.image}/>}
        </div>
    );
}