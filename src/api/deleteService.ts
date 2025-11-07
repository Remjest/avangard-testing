import API from "./API";
import { Result } from "./types";

export async function deleteService(id: string): Promise<Result<boolean>> {

    try {
        const res = await fetch(API.services.byId + id, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return { success: true, data: true };

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, error };
    }
}