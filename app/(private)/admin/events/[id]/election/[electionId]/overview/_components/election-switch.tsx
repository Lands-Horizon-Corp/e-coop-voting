import ActionTooltip from "@/components/action-tooltip";
import { Button } from "@/components/ui/button";
import { promptElectionStatus } from "@/hooks/api-hooks/election-api-hooks";
import { cn } from "@/lib/utils";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { TElectionWithPositionsAndCandidates } from "@/types";
import { ElectionStatus } from "@prisma/client";
import { Loader2, Play, Power } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
   status: ElectionStatus;
   election: TElectionWithPositionsAndCandidates;
   params: { id: number; electionId: number };
};

const ElectionSwitch = ({ status, election, params }: Props) => {
   const promptElection = promptElectionStatus({ params });

   const isLoading = promptElection.isPending;

   const { onOpen: onOpenConfirmModal } = useConfirmModal();

   const isLive = status === "live";
   const isDone = status === "done";

   const allowedToStart =
      election.positions.length >= 1 && election.candidates.length >= 1;
   return (
      <div className="flex gap-x-2">
         <ActionTooltip
            side="top"
            align="center"
            content={
               <div className="flex items-center gap-x-2">
                   <Power className="size-4 text-red-700" /> End Election.
               </div>
            }
         >
            <Button
               disabled={isDone || !allowedToStart}
               onClick={() => {
                  onOpenConfirmModal({
                     title: "You are about to End the Election",
                     description:
                        "Are you sure you want to end the election? Ending the election will not preserve incoming votes. ",

                     onConfirm: () => {
                        try {
                           promptElection.mutate({
                              status: ElectionStatus.done,
                           });
                        } catch (error) {
                           console.log(error);
                        }
                     },
                  });
               }}
               className={cn(
                  "text-white hover:scale-105 cursor-pointer hover:bg-black bg-accent-foreground/80  dark:bg-secondary rounded-xl"
               )}
            >
               {isLoading ? (
                  <Loader2 className=" size-4 animate-spin " />
               ) : (
                  "end"
               )}
            </Button>
         </ActionTooltip>
         <ActionTooltip
            side="top"
            align="center"
            content={
               <div className="flex items-center gap-x-2">
                                   <Play className="size-4 text-primary" /> Start Election.
               </div>
            }
         >
         <Button
            disabled={isLive || !allowedToStart}
            onClick={() => {
               onOpenConfirmModal({
                  title: "You are about to start the Event",
                  description:
                     "You can edit and manage election while the event is currently running.",
                  onConfirm: () => {
                     try {
                        if (allowedToStart) {
                           promptElection.mutate({
                              status: ElectionStatus.live,
                           });
                        } else {
                           toast.error(
                              "The election doesn't have any positions or candidates."
                           );
                           toast.warning(
                              "Cannot proceed to start! Please ensure that the election has positions and candidates!"
                           );
                        }
                     } catch (error) {
                        console.log(error);
                     }
                  },
               });
            }}
            className={`hover:scale-105 cursor-pointer rounded-xl bg-primary hover:bg-primary/80 dark:bg-primary  dark:hover:bg-primary `}
         >
            {isLoading ? (
               <Loader2 className=" size-4 animate-spin " />
            ) : (
               "start"
            )}
         </Button>
         </ActionTooltip>
      </div>
   );
};

export default ElectionSwitch;
