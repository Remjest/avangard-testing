import API from "./API";
import { Result } from "./types";

export async function postSubcategory(subcategoryName: string, categoryId: string): Promise<Result<boolean>> {
    
    try {
        const res = await fetch(API.subcategories.all, {
            method: "POST",
            body: JSON.stringify({ subcategoryName, categoryId }),
            headers: new Headers({ 'content-type': 'application/json' })
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        console.log(res);

        return { success: true, data: true };

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, error };
    }
}