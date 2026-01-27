import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type Props = {
    imageFile: File | null;
};

const useUploadImage = ({ imageFile }: Props) => {
    const { data : imageURL, isError, isPending, mutate } = useMutation<string, string>({
        mutationKey: ["uploadImage"],
        mutationFn: async () => {
            try {
                if (imageFile === null || imageFile === undefined){
                    toast.error("Invalid image file");
                    return
                }
                const formData = new FormData();
                formData.set("file", imageFile)

                const response = await axios.post("/api/v1/image-upload", formData)

                return response.data;
            } catch (e) {

            }
        },
    });

    const upload = () => mutate();

    return { upload, imageURL };
};

export default useUploadImage;
