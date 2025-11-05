import ImgTag from "../ImgTag/ImgTag";
import MenuImg from './menu.svg';
import ExitImg from './exit.svg';
import styles from './NavButton.module.css';
import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export interface NavButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    className?: string,
    purpose: 'exit' | 'menu',
    onClick(): void
}

export default function NavButton({ className, purpose, onClick, ...props }: NavButtonProps) {
    
    const iconSrc = purpose === 'exit' ? ExitImg : MenuImg;
    
    return (
        <button
            className={classNames(styles.button, className)}
            aria-label={purpose}
            onClick={onClick}
            {...props}>
            <ImgTag src={iconSrc} alt={`${purpose} icon`}/>
        </button>
    );
}