import { Subcategory } from "../interfaces";
import API from "./API";
import { Result } from "./types";

export async function editSubcategory(id: string, newData: Subcategory): Promise<Result<boolean>> {

    console.log(JSON.stringify(newData));

    try {
        const res = await fetch(API.subcategories.byId + id, {
            method: "PUT",
            body: JSON.stringify(newData),
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