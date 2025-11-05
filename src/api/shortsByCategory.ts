import { Service } from "../interfaces";
import API from "./API";
import { Result } from "./types";

export async function getShortsByCategory(id: number): Promise<Result<Service[]>> {

    try {
        const res = await fetch(API.services.byCategory + id);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const shortsData: Service[] = await res.json();

        return {success: true, data: shortsData};

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, error };
    }
}