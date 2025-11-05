import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import Image, { StaticImageData } from "next/image";
import styles from './ImgTag.module.css';
import classNames from "classnames";

export interface ImgTagProps {
    src: string | StaticImageData,
    alt?: string,
    className?: string,
    width?: number,
    height?: number,
}

export default function ImgTag({src, alt = 'Error to load image', width=800, height=600, className, ...props} : ImgTagProps ) {

    return (
        <Image className={classNames(styles.image, className)} src={src} alt={alt} {...props} width={width} height={height} />
    );
}