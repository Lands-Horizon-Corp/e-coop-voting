import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import UserAvatar from "./user-avatar";

type Props = {
    className? : string;
    url : string;
    onChange :(e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImagePick = ({ className, url, onChange }: Props) => {

    return (
        <div className={className}>
            <UserAvatar
                className="size-36"
                fallback="📷"
                src={url}
            />
            <Input type="file" accept="image/*" onChange={onChange} />
        </div>
    );
};

export default ImagePick;
