'use client';
import { JSX } from "react";
import gStyles from '../Global.module.css';
import styles from './Contacts.module.css';
import HTag from "@/src/components/shared/HTag/HTag";
import Info from "@/src/components/shared/Info/Info";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";


export default function ContactsPage(): JSX.Element { 
    
    const center = [56.513152, 84.988336];

    return (
        <>
            <div className={gStyles.wrapper}>
                <HTag tag="h1" direction="fromRight">Контакты</HTag>
                <div className={gStyles.sectionWrapper}>
                    <div className={styles.mapWrapper}>
                        <YMaps query={{ apikey: "0e41cf21-dcbb-4f07-aad8-3cb488036754" }}>
                            <Map
                                defaultState={{
                                    center: center,
                                    zoom: 16,
                                    controls: [],
                                }}
                                width="100%"
                                height="100%"
                                modules={["control.ZoomControl"]}
                                options={{
                                    copyrightLogoVisible: false,
                                    copyrightProvidersVisible: false,
                                    yandexMapDisablePoiInteractivity: true,
                                    suppressMapOpenBlock: true,
                                }}
                            >
                                <Placemark
                                    geometry={center}
                                    options={{
                                        preset: "islands#dotIcon",
                                        iconColor: "#0038A0"
                                    }}
                                />
                            </Map>
                        </YMaps>
                        <Info className={styles.contacts} title="Контакты">
                            <ul className={styles.list}>
                                <li>г. Томск, ул. Интернационалистов 2а, офис 5</li>
                                <li>+7 (953) 919-3800</li>
                                <li>+7 (3822) 233-800</li>
                                <li>expert233800@mail.ru</li>
                                <li>Пн-пт: 10:00 - 19:00</li>
                                <li>Cб-вс: по предв. записи</li>
                            </ul>
                        </Info>
                    </div>
                </div>
            </div>
        </>
    );
}
