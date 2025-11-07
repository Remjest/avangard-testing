"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from './AdminLogin.module.css';
import Logo from './logo.png';
import Button from "@/src/components/shared/Button/Button";
import classNames from "classnames";
import ImgTag from "@/src/components/shared/ImgTag/ImgTag";

export default function AdminLoginPage() {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>(""); 
    const [loading, setLoading] = useState<boolean>(false); 
        
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("https://avangard-website.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, password }),
            });

            if (!res.ok) {
                if (res.status === 401) throw new Error("Неверный логин или пароль");
                else throw new Error("Ошибка отправки данных: проверьте подключение к Интернету и работоспособность сервера.");
            }

            const authInfo = await res.json();
            setLoading(false);
            localStorage.setItem("token", authInfo.token);
                
            router.push("/admin");
        } catch (err: any) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <div className={styles.wrapper}>
            <ImgTag className={styles.logo} src={Logo}/>
            <div className={styles.formContainer}>
                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
                    >
                        <h2>Вход для администратора</h2>
                        <input
                            className={styles.login}
                            type="text"
                            placeholder="Логин"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                        />
                        <input
                            className={styles.password}
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                    />
                        <div className={styles.actionWrapper}>
                        <div className={classNames({
                            [styles.spinner] : loading,
                            [styles.spinnerHidden] : !loading
                            })}/>
                            <Button className={styles.button} style={{alignSelf: 'end'}} type="submit">Войти</Button>
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                    </form>
            </div>
        </div>
    );
}
