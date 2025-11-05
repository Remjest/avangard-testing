import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import styles from '../../components/layouts/MainLayout/MainLayout.module.css';
import { ReactNode } from "react";
import classNames from "classnames";
import Header from "../../components/sections/Header/Header";
import Sidebar from "../../components/sections/Sidebar/Sidebar";
import Main from "../../components/sections/Main/Main";
import Footer from "../../components/sections/Footer/Footer";

const montserrat = Montserrat({
  variable: "--main-font",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Независимая оценочная компания | ООО «Авангард»",
  description: "ООО «Авангард» - Мы проводим любой вид независимой оценки и экспертизы имущества. Помогаем клиентам отстоять их интересы и получить достойную компенсацию в г. Томске и Области",
};

export interface MainLayoutProps {
    children: ReactNode
}

export default function MainLayout({children} : MainLayoutProps) {
    return (
        <html lang="ru">
            <body className={classNames(montserrat.variable, styles.layout)}>
                <Header menu='client' className={styles.header} />
                <Sidebar menu='client' className={styles.sidebar} />
                <Main className={styles.main}>
                    {children}
                </Main>
                <Footer className={styles.footer}/>
            </body>
        </html>
    );
}
