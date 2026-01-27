import React from "react";

import InvalidPrompt from "@/components/invalid-prompt";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import ElectionHome from "./_components/election-home";
import { Metadata } from "next";

type Props = {
  params: { id: number };
};

export const metadata: Metadata = {
  title: "Vote",
};

const ElectionVerifyPage = ({ params }: Props) => {
  const validatedEventId = eventIdParamSchema.safeParse(params);

  if (!validatedEventId.success)
    return <InvalidPrompt message="This election id is invalid" />;

  return <ElectionHome eventId={validatedEventId.data.id} />;
};

export default ElectionVerifyPage;
