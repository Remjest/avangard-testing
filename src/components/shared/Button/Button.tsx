import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import styles from './Button.module.css';
import classNames from "classnames";

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{

    children: ReactNode,
    className?: string,
}

export default function Button({ children, className, ...props} : ButtonProps ) {

    return (
        <button className={classNames(styles.button, className)} {...props}>{children}</button>
    );
}