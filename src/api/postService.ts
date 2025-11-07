import { Service } from "../interfaces";
import API from "./API";
import { Result } from "./types";

export async function postService(id: string, serviceData: Service): Promise<Result<boolean>> {
    
    try {
        console.log(JSON.stringify({ ...serviceData, subcategoryId: id }));
        const res = await fetch(API.services.post, {
            method: "POST",
            body: JSON.stringify({...serviceData, subcategoryId: id}),
            headers: { "content-type": "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return { success: true, data: true };
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, error };
    }
}