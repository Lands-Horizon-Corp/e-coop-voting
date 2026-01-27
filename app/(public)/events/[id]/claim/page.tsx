import React from "react";
import { Metadata } from "next";

import ClaimHome from "./_components/claim-home";
import InvalidPrompt from "@/components/invalid-prompt";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import IncentiveGiftSvg from "@/components/custom-svg/incentive-gift";

type Props = {
    params: { id: number };
};

export const metadata: Metadata = {
    title: "Claim",
};

const ClaimPage = ({ params }: Props) => {
    const validatedEventId = eventIdParamSchema.safeParse(params);

    if (!validatedEventId.success)
        return <InvalidPrompt message="This election id is invalid" />;

    return (
        <div className="flex flex-col py-20 px-5 gap-y-6 min-h-screen w-full items-center">
            <IncentiveGiftSvg className="mx-auto size-16 lg:size-32" />
            <p className="text-xl lg:text-2xl text-center">Claim Incentives</p>
            <ClaimHome eventId={validatedEventId.data.id} />
        </div>
    );
};

export default ClaimPage;
