import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = { title : string, description : string | ReactNode, showSeparator? : boolean };

const ModalHead = ({ title, description, showSeparator = true}: Props) => {
    return (
        <>
            <DialogHeader>
                <DialogTitle className="font-medium text-2xl">{ title }</DialogTitle>
            </DialogHeader>
            <DialogDescription className="my-2">
                { description }
            </DialogDescription>
            { showSeparator && <Separator className="bg-muted/70" /> }
        </>
    );
};

export default ModalHead;
