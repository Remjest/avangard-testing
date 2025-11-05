import { DetailedHTMLProps, HTMLAttributes} from "react";
import styles from './Important.module.css';
import classNames from "classnames";

interface ImportantProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    children?: React.ReactNode;
    className?: string,
}

export default function Important({ children, className, ...props }: ImportantProps) {
    return (
        <div className={classNames(styles.important, className)} {...props}>
            <div className={styles.line}></div>
            <div className={styles.title}>ВАЖНО!</div>
            <div className={styles.mainText}>
                {children}
            </div>
        </div>
    );
}