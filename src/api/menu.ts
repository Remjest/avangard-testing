import { Category } from "../interfaces";
import API from "./API";
import { Result } from "./types";


export async function getMenu(): Promise<Result<Category[]>> {

    try {
        const res = await fetch(API.categories.all);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const menuData = await res.json() as Category[];

        return {success: true, data: menuData};

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, error };
    }
}