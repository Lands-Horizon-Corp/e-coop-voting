import React from "react";

import { Check, Gift, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import ActionTooltip from "@/components/action-tooltip";
import LoadingSpinner from "@/components/loading-spinner";

import {
  TIncentiveClaimsWithIncentiveAndAssisted,
  TIncentiveMinimalInfo2,
  TMemberAttendeesMinimalInfo,
} from "@/types";
import { useClaim } from "@/hooks/public-api-hooks/use-claim-api";
import { isSatisfiedClaimRequirements } from "@/services/claim-checks";

type Props = {
  member: TMemberAttendeesMinimalInfo;
  eventId: number;
  claimables: TIncentiveMinimalInfo2[];
  myClaims: TIncentiveClaimsWithIncentiveAndAssisted[];
};

const ClaimWindow = ({ eventId, member, claimables, myClaims }: Props) => {
  return (
    <div className="flex-1 flex flex-col gap-y-4">
      {claimables.map((incentive) => {
        const { claim, isClaimPending } = useClaim(eventId);
        const claimed = myClaims.find(
          (claims) => claims.incentive.id === incentive.id,
        );
        const isClaimed = claimed !== undefined;

        const satisfied = isSatisfiedClaimRequirements(
          incentive.claimRequirement,
          member,
        );

        return (
          <div
            key={incentive.id}
            onClick={() => {
              if (isClaimed || !satisfied) return;
              claim({ incentiveId: incentive.id });
            }}
            className={cn(
              "p-2 ring-2 ring-blue-400/20 group ease-in cursor-pointer duration-100 hover:ring-blue-400/70 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-background dark:from-secondary to-[#f5f1fd] rounded-xl items-center gap-x-4 flex justify-start",
              isClaimed &&
                "bg-gradient-to-r cursor-default from-background dark:from-secondary hover:ring-teal-400 to-[#f5f1fd]",
              !satisfied && "ring-rose-400/40 hover:ring-rose-400 opacity-50",
            )}
          >
            <div
              className={cn(
                "p-1 lg:p-2 rounded-lg lg:rounded-xl duration-300 bg-sky-300 text-white",
                isClaimed && "bg-teal-400",
                !satisfied && "bg-rose-400",
              )}
            >
              <Gift className="size-5 lg:size-8" strokeWidth={1} />
            </div>
            <div className="p-2 flex-1">
              <p className="text-base lg:text-xl font-medium">
                {incentive.itemName}
              </p>
            </div>
            {claimed?.assistedBy && (
              <div className="flex items-center gap-x-2">
                <UserAvatar
                  className="size-6"
                  src={claimed.assistedBy.picture as ""}
                  fallback={claimed.assistedBy.name.substring(0, 2)}
                />
                <p className="text-xs">{claimed.assistedBy.name}</p>
              </div>
            )}
            {isClaimed ? (
              <Badge
                variant="default"
                className="text-white gap-x-2 bg-primary dark:bg-primary/40 border-primary-10"
              >
                <Check strokeWidth={1} className="size-4 lg:size-5" />{" "}
                {claimed.assistedBy ? "assisted" : "self claimed"}
              </Badge>
            ) : (
              <>
                {!satisfied ? (
                  <p className="text-sm pr-2">
                    NOT {incentive.claimRequirement}
                  </p>
                ) : (
                  <ActionTooltip content="Select to claim">
                    <Button
                      size="icon"
                      className={cn(
                        "bg-transparent text-foreground/80 group-hover:text-white group-hover:bg-sky-400 rounded-full",
                        isClaimed && "bg-teal-400 ",
                      )}
                    >
                      {isClaimPending ? (
                        <LoadingSpinner />
                      ) : (
                        <Plus strokeWidth={1} className="size-8" />
                      )}
                    </Button>
                  </ActionTooltip>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ClaimWindow;
