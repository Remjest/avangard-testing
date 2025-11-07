'use client';

import styles from './loading.module.css';

export default function Loading() {
    return <div className={styles.wrapper}>
        <div className={styles.spinner}></div>
        <div className={styles.loadMessage}>Загрузка...</div>
    </div>;
}