import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../../globals.css";
import styles from "../../../components/layouts/MainLayout/MainLayout.module.css";
import { ReactNode } from "react";
import classNames from "classnames";
import Sidebar from "@/src/components/sections/Sidebar/Sidebar";
import AuthWrapper from "./admin-components/AuthWrapper/AuthWrapper";
import Footer from "@/src/components/sections/Footer/Footer";
import Header from "@/src/components/sections/Header/Header";

const montserrat = Montserrat({
  variable: "--main-font",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Панель администратора | ООО «Авангард»",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
          <body className={classNames(montserrat.variable, styles.layout)}>
            <AuthWrapper>
                <Header menu="admin" className={styles.header} />
                <Sidebar menu="admin" className={styles.sidebar} />
                <main className={styles.main}>{children}</main>
                <Footer className={styles.footer} />
            </AuthWrapper>
        </body>
    </html>
  );
}
