import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';


export interface MainProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
    children: ReactNode,
    className?: string
}

export default function Main({ children, className, ...props }: MainProps) {
    return (
        <main className={className} {...props}>
            {children}
        </main>
    );
}