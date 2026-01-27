import z from "zod";
import React, { useCallback, useState } from "react";

import IncentiveAssigned from "./incentive-assigned";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { TMember } from "@/types";
import {
    useCreateClaimAssistance,
    useMemberClaimsWithAssistanceList,
} from "@/hooks/api-hooks/incentive-api-hooks";
import { Separator } from "@/components/ui/separator";
import ExistingClaims from "./existing-claims";
import { claimsEntrySchema } from "@/validation-schema/incentive";
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import UserAvatar from "@/components/user-avatar";
import { useOnEventSubDataUpdate } from "@/hooks/use-event-update-poller";

type Props = {
    state: boolean;
    onClose: (state: boolean) => void;
    member: TMember;
};

export type TCreateClaimEntry = z.infer<typeof claimsEntrySchema>;

const AssistClaimSheet = ({ state, onClose, member }: Props) => {
    const queryClient = useQueryClient();
    const [newEntries, setNewEntries] = useState<TCreateClaimEntry[]>([]);

    const { mutate: saveClaimEntries, isPending: isSavingClaim } =
        useCreateClaimAssistance(member.eventId, () => {
            setNewEntries([]);
            queryClient.invalidateQueries({
                queryKey: [`incentive-claims-member-${member.id}`],
            });
        });
    const {
        data: memberClaims,
        isPending: isLoadingMemberClaims,
        refetch,
    } = useMemberClaimsWithAssistanceList(member.eventId, member.id, state);

    const handleEventHasSubChange = useCallback(() => {
        refetch();
    }, [refetch]);
    useOnEventSubDataUpdate({
        eventId: member.eventId,
        onChange: handleEventHasSubChange,
    });

    const onAdd = (newEntry: TCreateClaimEntry) =>
        setNewEntries((prev) => [...prev, newEntry]);
    const onRemove = (removeEntryId: number) =>
        setNewEntries((prev) =>
            prev.filter((entries) => entries.incentiveId !== removeEntryId)
        );

    const disableBtns = newEntries.length === 0 || isSavingClaim;

    return (
        <Sheet open={state} onOpenChange={onClose}>
            <SheetContent className="border-none w-full max-w-[98vw] flex flex-col h-screen lg:max-w-[40vw]">
                <SheetHeader>
                    <SheetTitle className="text-center">
                        Incentive Claim Sheet
                    </SheetTitle>
                    <SheetDescription className="text-center">
                        You are assisting this member to claim incentive
                    </SheetDescription>
                    <div className="flex flex-col items-center gap-y-4">
                        <UserAvatar
                            className="size-24 lg:size-32"
                            src={member.picture as ""}
                            fallback={`${member.firstName.charAt(0)}${member.lastName.charAt(0)}`}
                        />
                        <p className="text-lg font-medium">{`${member.firstName} ${member.lastName}`}</p>
                    </div>
                </SheetHeader>
                <div className="flex flex-col gap-y-4 w-full px-2 pt-8 flex-1 overflow-y-scroll thin-scroll">
                    {isLoadingMemberClaims ? (
                        <LoadingSpinner className="mx-auto" />
                    ) : (
                        <IncentiveAssigned
                            member={member}
                            onAdd={onAdd}
                            onRemove={onRemove}
                            newClaimEntries={newEntries.map(
                                (entry) => entry.incentiveId
                            )}
                            claimedIncentiveIds={memberClaims.map(
                                (claims) => claims.incentiveId
                            )}
                            state={state}
                            eventId={member.eventId}
                        />
                    )}
                    <div
                        className={cn(
                            "flex gap-x-2 justify-end duration-150 ease-out opacity-0",
                            newEntries.length > 0 && "opacity-100"
                        )}
                    >
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={disableBtns}
                            onClick={() => setNewEntries([])}
                        >
                            clear
                        </Button>
                        <Button
                            size="sm"
                            onClick={() =>
                                saveClaimEntries({ claims: newEntries })
                            }
                            disabled={disableBtns}
                        >
                            {isSavingClaim ? <LoadingSpinner /> : "save claim"}
                        </Button>
                    </div>
                    <Separator />
                    {isLoadingMemberClaims ? (
                        <LoadingSpinner />
                    ) : (
                        <ExistingClaims existingClaims={memberClaims} />
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default AssistClaimSheet;
