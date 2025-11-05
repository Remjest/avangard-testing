import { Category, Subcategory } from "../interfaces";
import API from "./API";
import { Result } from "./types";


export async function getAllSubcategories(): Promise<Result<{id: string, name: string}[]>> {

    try {
        const responses = await Promise.all([
            fetch(API.subcategories.byCategory + '1'),
            fetch(API.subcategories.byCategory + '2'),
        ]);

        for (const res of responses) {
            if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`);
        }

        const dataArrays = await Promise.all(responses.map((r) => r.json()));

        const subcategories = dataArrays.flatMap((data: Subcategory[]) =>
            data.map((subcategory) => {return ({id: subcategory.subcategoryId.toString(), name: subcategory.subcategoryName})})
        );

        return { success: true, data: subcategories };

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, error };
    }
}