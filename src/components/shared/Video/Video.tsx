import { DetailedHTMLProps, HTMLAttributes } from "react";
import styles from './Video.module.css';
import classNames from "classnames";

export interface VideoProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    videoUrl: string
    className?: string,
}

export default function Video({ videoUrl, className, ...props }: VideoProps) {
    
    const url = `${process.env.NEXT_PUBLIC_DOMAIN}/videos/${videoUrl}`;

    return (
        <div className={classNames(styles.wrapper, className)}  {...props}>
            <video
                className={styles.video}
                src={url}
                loop
                poster='./videoPreview.png'
                preload="metadata"
                controls
            />
        </div>
    );
}