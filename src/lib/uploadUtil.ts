const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const MEDIA_HOST = process.env.NEXT_PUBLIC_STORAGE_URL;

export const uploadFile = async (file: any) => {
    const data = new FormData();
    data.append("file", file);
    let url = `${MEDIA_HOST}/${cloudName}/image/upload`;
    data.append("upload_preset", 'Image_Preset');
    try {
        const response = await fetch(url, {
            method: "POST",
            body: data,
        });

        const result = await response.json();
        return result.secure_url;
    } catch (error) {
        console.error(error);
    }
}