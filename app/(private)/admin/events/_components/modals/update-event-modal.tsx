"use client";
import { user } from "next-auth";

import UpdateEventForm from "../update-event-form";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { TEventWithElectionWithCoopWithBranch } from "@/types";

type Props = {
    event: TEventWithElectionWithCoopWithBranch;
    state: boolean;
    onClose: (state: boolean) => void;
    user: user;
};

const UpdateEventModal = ({ event, state, onClose }: Props) => {

    return (
        <Dialog
            open={state}
            onOpenChange={(state) => {
                onClose(state);
            }}
        >
            <DialogContent className="border-none shadow-2 sm:rounded-2xl max-w-[98vw] max-h-[90vh] thin-scroll overflow-y-scroll sm:max-w-5xl font-inter">
                <ModalHead
                    title="Edit Event"
                    description="Edit Event: You will be able to edit the basic information of this event, but not its category."
                />
                <UpdateEventForm eventId={event.id} defaultValues={event} />
            </DialogContent>
        </Dialog>
    );
};

export default UpdateEventModal;
