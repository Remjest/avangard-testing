import { Main } from "../interfaces";
import API from "./API";
import { Result } from "./types";

export async function getMainPage(): Promise<Result<Main>> {

    try {
        const res = await fetch(API.mainPage.getMainInfo);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const mainPageData: Main = await res.json();

        return {success: true, data: mainPageData};

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, error };
    }
}