import React from "react";

import { Check, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { TIncentiveClaimsWithIncentiveAndClaimAssistance } from "@/types";

type Props = {
    existingClaims : TIncentiveClaimsWithIncentiveAndClaimAssistance[]
};

const ExistingClaims = ({ existingClaims }: Props) => {
    return (
        <div>
            <p className="font-medium text-lg">Claimed</p>
            <div className="space-y-4 mt-4">
                {existingClaims.map((claim) => (
                    <div
                        key={claim.id}
                        className="p-2 bg-gradient-to-r from-background dark:from-secondary to-[#f5f1fd] rounded-xl items-center gap-x-4 flex justify-start"
                    >
                        <div className="p-2 rounded-xl bg-teal-400 text-white">
                            <Gift className="size-8" strokeWidth={1} />
                        </div>
                        <div className="p-2 flex-1">
                            <p className="text-xl font-medium">
                                {claim.incentive.itemName}
                            </p>
                        </div>
                        <Badge variant="default" className="text-white bg-primary dark:bg-primary/40 border-primary-10"><Check strokeWidth={1} className="size-5" /> Claimed</Badge>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExistingClaims;
