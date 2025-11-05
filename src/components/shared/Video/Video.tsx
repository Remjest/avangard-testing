import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import styles from './Video.module.css';
import classNames from "classnames";

export interface VideoProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    className?: string,
}

export default function Video({ className, ...props} : VideoProps ) {

    return (
        <div className={classNames(styles.wrapper, className)}  {...props}>
            <video
                className={styles.video}
                src='/video.mp4'
                loop
                preload="metadata"
                controls
            />
        </div>
    );
}