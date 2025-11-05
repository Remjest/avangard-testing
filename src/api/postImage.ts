import API from "./API";
import { Result } from "./types";

export async function postImage(imageFile: File): Promise<Result<string>> {

    
    try {
        const formData = new FormData();
        formData.append("file", imageFile);

        const res = await fetch(API.images.postImage, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            console.log(res.status);
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const imageURL : string  = await res.text();
        return { success: true, data: imageURL };
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, error };
    }
}