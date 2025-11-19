import { DetailedHTMLProps, HTMLAttributes} from "react";
import styles from './PopularService.module.css';
import classNames from "classnames";
import ServicePreview from "../ServicePreview/ServicePreview";
import { StaticImageData } from "next/image";

export interface PopularServiceProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    title: string,
    src: string,
    img: string | StaticImageData,
    className?: string,
}

export default function PopularService({ title, src, img, className, ...props} : PopularServiceProps ) {

    return (
        <div className={classNames(styles.wrapper, className)}  {...props}>
            <div className={styles.title}>{title}</div>
            <div/>
            <ServicePreview className={styles.image} src={src} title='Подробнее' img={img} />
        </div>
    );
}