'use client';

import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";
import styles from './PopularService.module.css';
import classNames from "classnames";
import ServicePreview from "../ServicePreview/ServicePreview";
import { StaticImageData } from "next/image";

export interface PopularServiceProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    title: string,
    description: string,
    src: string,
    img: string | StaticImageData,
    className?: string,
}

export default function PopularService({ title, description, src, img, className, ...props }: PopularServiceProps) {
    const [displayDescription, setDisplayDescription] = useState('');
    
    useEffect(() => {
        const maxLength = window.innerWidth > 1200 ? 85 : 35;
        let cuttedDescription = description.split(' ');
        const initialLength = cuttedDescription.length;
        cuttedDescription = cuttedDescription.slice(0, maxLength);
        if (initialLength > cuttedDescription.length ) cuttedDescription.push('...');
        setDisplayDescription(cuttedDescription.join(' '));
    }, [description]);

    return (
        <div className={classNames(styles.wrapper, className)}  {...props}>
            <div className={styles.about}>
                <div className={styles.title}>{title}</div>
                <div className={styles.description}>{displayDescription}</div>
            </div>
            <div/>
            <ServicePreview className={styles.image} src={src} title='Подробнее' img={img} />
        </div>
    );
}