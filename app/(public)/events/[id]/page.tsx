import React from "react";

import EventHome from "./_components/event-home";
import InvalidPrompt from "@/components/invalid-prompt";

import { eventIdParamSchema } from "@/validation-schema/api-params";
import { Metadata } from "next";

type Props = {
  params: { id: string };
};

export const metadata: Metadata = {
  title: "Explore Event",
  description: "Explore this event",
};

const ElectionPage = ({ params }: Props) => {
  const validatedEventId = eventIdParamSchema.safeParse(params);

  if (!validatedEventId.success)
    return <InvalidPrompt message="This event id is invalid" />;

  return <EventHome eventId={validatedEventId.data.id} />;
};

export default ElectionPage;
