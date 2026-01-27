import React from "react";

import VoteWindow from "./_components/voting/vote-window";
import InvalidPrompt from "@/components/invalid-prompt";

import { eventIdSchema } from "@/validation-schema/commons";
import VoteHome from "./_components/vote-home";
import { eventIdParamSchema } from "@/validation-schema/api-params";

type Props = {
  params: { id: number };
};

const VotePage = ({ params }: Props) => {
  const parsedParams = eventIdParamSchema.safeParse(params);

  if (!parsedParams.success)
    return <InvalidPrompt message="Invalid election id" />;

  return <VoteHome eventId={parsedParams.data.id} />;
};

export default VotePage;
