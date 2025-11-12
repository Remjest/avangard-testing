"use client";

import { DetailedHTMLProps, HTMLAttributes, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AuthWrapperProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
    children: ReactNode,
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        router.push("/admin-login");
        return;
        }

        fetch("https://avangard-website.onrender.com/check-token", {
        headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            if (!res.ok) throw new Error();
            setAuthorized(true);
        })
        .catch(() => router.push("/admin-login"));
    }, [router]);

    if (!authorized) return null;

    return children;
}
