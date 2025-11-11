import API from "./API";
import { Result } from "./types";

export async function postVideo(videoFile: File): Promise<Result<string>> {

    
    try {
        const formData = new FormData();
        formData.append("file", videoFile);

        const res = await fetch(API.videos.postVideo, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            console.log(res.status);
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const videoURL : string  = await res.text();
        return { success: true, data: videoURL };
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, error };
    }
}