import { Service } from "../interfaces";
import API from "./API";
import { Result } from "./types";

export async function getServices(category: string): Promise<Result<Service[]>> {

    try {
        const res = await fetch(API.services.shortByCategory + category);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const categoryData: Service[] = await res.json();

        return {success: true, data: categoryData};

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, error };
    }
}