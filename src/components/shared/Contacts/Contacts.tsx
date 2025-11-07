import { DetailedHTMLProps, HTMLAttributes} from "react";
import styles from './Contacts.module.css';
import classNames from "classnames";

export interface ContactsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    title?: string,
    points: string[],
    className?: string,
}

export default function Contacts({ title, points, className, ...props} : ContactsProps ) {

    return (
        <div className={classNames(styles.wrapper, className)} {...props}>
            <h3 className={styles.title}>{title}</h3>
            <ul className={styles.list}>
                { points.map(p => <li key={p}>{p}</li>)}
            </ul>
        </div>
    );
}