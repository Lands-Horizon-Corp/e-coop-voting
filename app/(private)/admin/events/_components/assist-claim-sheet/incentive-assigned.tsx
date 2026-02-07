import React, { useCallback } from "react";
import { Gift, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loading-spinner";

import { cn } from "@/lib/utils";
import { TCreateClaimEntry } from ".";
import { useAssignedIncentiveToMe } from "@/hooks/api-hooks/incentive-api-hooks";
import { TMember } from "@/types";
import { isSatisfiedClaimRequirements } from "@/services/claim-checks";
import { useOnEventSubDataUpdate } from "@/hooks/use-event-update-poller";

type Props = {
  state: boolean;
  eventId: number;
  member: TMember;

  newClaimEntries: number[];
  claimedIncentiveIds: number[];

  onAdd: (entry: TCreateClaimEntry) => void;
  onRemove: (entryId: number) => void;
};

const IncentiveAssigned = ({
  eventId,
  member,
  state,
  newClaimEntries,
  claimedIncentiveIds,
  onAdd,
  onRemove,
}: Props) => {
  const {
    data: assignedToMe,
    isFetching: isLoadingAssignedToMe,
    refetch,
  } = useAssignedIncentiveToMe(eventId, state);

  const handleEventHasSubChange = useCallback(() => {
    refetch();
  }, [refetch]);
  useOnEventSubDataUpdate({
    eventId,
    onChange: handleEventHasSubChange,
  });

  const assignables = assignedToMe.filter(
    (incentiveAssigned) =>
      !claimedIncentiveIds.includes(incentiveAssigned.incentiveId),
  );

  return (
    <div>
      <p className="font-medium text-lg">Assigned to you</p>
      <div className="space-y-4 mt-4 min-h-[15vh]">
        {assignables.map((incentiveAssigned) => {
          const inNewEntry = newClaimEntries.includes(
            incentiveAssigned.incentiveId,
          );

          const satisfied = isSatisfiedClaimRequirements(
            incentiveAssigned.incentive.claimRequirement,
            member,
          );
          return (
            <div
              key={incentiveAssigned.id}
              onClick={() => {
                if (!satisfied) return;

                return inNewEntry
                  ? onRemove(incentiveAssigned.incentiveId)
                  : onAdd({
                      assignedId: incentiveAssigned.id,
                      eventAttendeeId: member.id,
                      eventId,
                      incentiveId: incentiveAssigned.incentiveId,
                    });
              }}
              className={cn(
                "p-2 ring-2 ring-blue-400/20 group ease-in cursor-pointer duration-100 hover:ring-blue-400/70 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-background dark:from-secondary to-[#f5f1fd] rounded-xl items-center gap-x-4 flex justify-start",
                inNewEntry && "ring-yellow-400/40 hover:ring-yellow-400",
                !satisfied && "ring-rose-400/40 hover:ring-rose-400 opacity-50",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl duration-300 bg-sky-300 text-white",
                  inNewEntry && "bg-yellow-400",
                  !satisfied && "bg-rose-400",
                )}
              >
                <Gift className="size-8" strokeWidth={1} />
              </div>
              <div className="p-2 flex-1">
                <p className="text-xl font-medium">
                  {incentiveAssigned.incentive.itemName}
                </p>
              </div>
              {!satisfied ? (
                <p className="text-sm pr-2">
                  NOT {incentiveAssigned.incentive.claimRequirement}
                </p>
              ) : (
                <Button
                  size="icon"
                  className={cn(
                    "bg-transparent text-foreground/80 group-hover:text-white group-hover:bg-sky-400 rounded-full",
                    inNewEntry && "bg-yellow-400/80 group-hover:bg-yellow-400",
                  )}
                >
                  {inNewEntry ? (
                    <Minus strokeWidth={1} className="size-8" />
                  ) : (
                    <Plus strokeWidth={1} className="size-8" />
                  )}
                </Button>
              )}
            </div>
          );
        })}
        {!isLoadingAssignedToMe && assignables.length === 0 && (
          <p className="text-center text-foreground/50">
            {assignables.length < assignedToMe.length
              ? "Seem's like theres nothing to claim for this member"
              : "No incentive was assigned to you"}
          </p>
        )}
        {isLoadingAssignedToMe && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default IncentiveAssigned;
