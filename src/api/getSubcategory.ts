import { Subcategory } from "../interfaces";
import API from "./API";
import { Result } from "./types";

export async function getSubcategory(id: string): Promise<Result<Subcategory>> {

    try {
        const res = await fetch(API.subcategories.byId + id);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const subcategoryData: Subcategory = await res.json();

        return { success: true, data: subcategoryData };

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, error };
    }
}