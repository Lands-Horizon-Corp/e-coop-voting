"use client";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import ImagePick from "@/components/image-pick";
import { Separator } from "@/components/ui/separator";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { TUser } from "@/types";
import useImagePick from "@/hooks/use-image-pick";
import { updateUser } from "@/hooks/api-hooks/user-api-hooks";
import { uploadImage } from "@/hooks/api-hooks/image-upload-api-hook";

type Props = {
    user: TUser;
    state: boolean;
    close: () => void;
};

const UpdateUserPictureModal = ({ state, user, close }: Props) => {
    const { imageURL, imageFile, onSelectImage, resetPicker } = useImagePick({
        initialImageURL: user.picture ?? "/images/default.png",
        maxOptimizedSizeMB: 0.5,
        maxWidthOrHeight: 300,
    });

    const reset = () => {
        resetPicker();
        close();
    };

    const { isPending: isSaving, mutate } = updateUser(
        user.id,
        (updatedUser) => {}
    );

    const onUploadComplete = (imageURL: string) => {
        mutate({
            branchId: user.branchId,
            email: user.email,
            name: user.name,
            role: user.role,
            picture: imageURL,
        });
        reset();
    };

    const { mutate: startUpload, isPending: isUploading } = uploadImage({
        onUploadComplete,
    });

    const isLoading = isUploading || isSaving;

    const disabled = isLoading || !imageFile;

    return (
        <Dialog open={state} onOpenChange={(state) => reset()}>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <ModalHead
                    title="Update User Picture"
                    description="Update user profile picture."
                />
                <ImagePick
                    className="flex flex-col items-center gap-y-4"
                    url={imageURL}
                    onChange={onSelectImage}
                />
                <Separator className="bg-muted/70" />
                <div className="flex justify-end gap-x-2">
                    <Button
                        disabled={isLoading}
                        onClick={(e) => {
                            e.preventDefault();
                            reset();
                        }}
                        variant={"ghost"}
                        className="bg-muted/60 hover:bg-muted"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={disabled}
                        onClick={() => {
                            if (imageFile) {
                                startUpload({
                                    fileName: `user-${user.id}`,
                                    folderGroup: "user",
                                    file: imageFile,
                                });
                            }
                        }}
                    >
                        {isLoading ? (
                            <Loader2
                                className="h-3 w-3 animate-spin"
                                strokeWidth={1}
                            />
                        ) : (
                            "Save"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateUserPictureModal;
