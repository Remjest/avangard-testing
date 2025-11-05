import { Category } from "../interfaces";
import API from "./API";
import { Result } from "./types";


export async function getAllData(cache: boolean): Promise<Result<Category[]>> {

    try {
        const res = await fetch(API.categories.all, {
            cache: cache ? 'default' : 'no-store'
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const allData = await res.json() as Category[];

        return {success: true, data: allData};

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, error };
    }
}