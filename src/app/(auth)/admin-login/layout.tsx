import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ReactNode } from "react";
import "../../globals.css";
import classNames from "classnames";

const montserrat = Montserrat({
  variable: "--main-font",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Вход для Администратора",
};

export interface MainLayoutProps {
    children: ReactNode
}

export default function MainLayout({children} : MainLayoutProps) {
    return (
        <html lang="ru">
            <body className={classNames(montserrat.variable)}>
                {children}
            </body>
        </html>
    );
}