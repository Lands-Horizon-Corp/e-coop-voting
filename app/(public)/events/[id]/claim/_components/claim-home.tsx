"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import ClaimWindow from "./claim-window";
import ClaimerCard from "./claimer-card";
import { Button } from "@/components/ui/button";
import ValidateClaim from "./claim-window/validate-claim";
import LoadingSpinner from "@/components/loading-spinner";

import {
    useClaimAuth,
    useClaimComplete,
    useClaimablesList,
    useMyClaims,
} from "@/hooks/public-api-hooks/use-claim-api";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
    eventId: number;
};

const ClaimHome = ({ eventId }: Props) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { onOpen } = useConfirmModal();
    const { myInfo, isLoading } = useClaimAuth(eventId);
    const { myClaims, isLoadingClaims } = useMyClaims(
        eventId,
        myInfo !== undefined
    );
    const { completeClaim } = useClaimComplete(eventId, (member) =>
        router.push(
            `claim/complete?pb=${member.passbookNumber}&fullname=${`${member.firstName} ${member.lastName}`}&picture=${member.picture}`
        )
    );
    const { claimables, isLoadingClaimables } = useClaimablesList(
        eventId,
        myInfo !== undefined
    );

    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: ["my-claim-minimal-info"] });
        };
    }, []);

    if (isLoading)
        return (
            <div className="flex gap-x-2 items-center">
                <LoadingSpinner /> <span>checking</span>
            </div>
        );

    if (!myInfo) return <ValidateClaim eventId={eventId} />;

    if (isLoadingClaims)
        return (
            <div className="flex gap-x-2 items-center">
                <LoadingSpinner /> <span>checking your claims</span>
            </div>
        );

    if (isLoadingClaimables)
        return (
            <div className="flex gap-x-2 items-center">
                <LoadingSpinner /> <span>checking incentives</span>
            </div>
        );

    return (
        <div className="w-full max-w-md lg:max-w-2xl py-8 gap-y-8 flex flex-col">
            {!isLoadingClaims && claimables.length === 0 ? (
                <p className="text-sm text-center">
                    Seems like there&apos;s no incentives in this event
                </p>
            ) : (
                <>
                    <ClaimerCard claimer={myInfo} />
                    <ClaimWindow
                        member={myInfo}
                        eventId={eventId}
                        myClaims={myClaims}
                        claimables={claimables}
                    />
                </>
            )}
            {!isLoadingClaims &&
                !isLoadingClaimables &&
                claimables.length === myClaims.length &&
                claimables.length > 0 && (
                    <p className="text-foreground/70 text-sm text-center">
                        You already claimed all of incentives
                    </p>
                )}
            <Button
                onClick={() =>
                    onOpen({
                        title: "Exit Claim",
                        description: "Are you sure to exit claim page?",
                        onConfirm: () => completeClaim(),
                    })
                }
                size="lg"
            >
                Exit Claim
            </Button>
        </div>
    );
};

export default ClaimHome;
