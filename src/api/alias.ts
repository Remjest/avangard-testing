import { Service } from "../interfaces";
import API from "./API";
import { Result } from "./types";

export async function getByAlias(alias: string): Promise<Result<Service>> {

    try {
        const res = await fetch(API.services.byAlias + alias);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const pageData: Service = await res.json();

        return {success: true, data: pageData};

    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, error };
    }
}