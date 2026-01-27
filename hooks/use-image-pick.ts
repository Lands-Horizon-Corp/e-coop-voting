import { toast } from "sonner";
import { useMemo, useState } from "react";
import imageCompression from "browser-image-compression";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type ImagePickOption = {
    maxPictureSizeMb? : number,
    maxOptimizedSizeMB : 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1,
    maxWidthOrHeight : 100 | 200 | 300 | 800,
    fileType? : "image/jpeg",
    initialImageURL? : string,
    useWebWorker? : boolean
}

const useImagePick = ( { maxPictureSizeMb = 2, maxOptimizedSizeMB = 0.5, initialImageURL = "/images/default.png", maxWidthOrHeight = 300, fileType = "image/jpeg", useWebWorker = false } : ImagePickOption ) => {
    const [imageFile, setImageFile] = useState<File | null>(null)

    const onSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0){
            setImageFile(null);
            return;
        }

        let uploadedImage = e.target.files[0];
        const unoptimizedSize = uploadedImage.size / 1024 / 1024

        try {
            if( unoptimizedSize > maxPictureSizeMb){
                toast.error(`Image exceed allowed image size of ${maxPictureSizeMb} MB. Your image ${unoptimizedSize} MB`)
                return false;
            }

            uploadedImage = await imageCompression(uploadedImage, {
                maxSizeMB : maxOptimizedSizeMB,
                maxWidthOrHeight,
                fileType,
                useWebWorker
            });

            const optimizedSize = uploadedImage.size / 1024 / 1024;

            if(optimizedSize > maxOptimizedSizeMB){
                toast.error(`Image exceed optimization size of ${maxOptimizedSizeMB} MB. Your image size ${optimizedSize} MB`)
                return false;
            }
            setImageFile(uploadedImage)
            return uploadedImage
        } catch (error) {
            toast.error("Failed to optimize image")
        }
    }

    const imageSize = useMemo(()=>{
        if(imageFile) return imageFile.size / 1024 // in kb desu
        return 0
    }, [imageFile])

    const resetPicker = () => setImageFile(null);

    const imageURL = useMemo(()=>{
        if(imageFile) return URL.createObjectURL(imageFile) 
        else  return initialImageURL
    }, [imageFile, initialImageURL])

    
    return { imageFile, imageURL, imageSize, onSelectImage, resetPicker }
}

export default useImagePick;
