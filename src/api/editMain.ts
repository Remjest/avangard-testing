import { Main } from "../interfaces";
import API from "./API";
import { Result } from "./types";

export async function editMainPage(editData: Main): Promise<Result<Main>> {

    try {
        const res = await fetch(API.mainPage.getMainInfo + '/1', {
            method: "PUT",
            body: JSON.stringify(editData),
            headers: { "content-type": "application/json" },
        });

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