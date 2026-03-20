import React from "react";

import { getEventId } from "@/services/event";
import NotFound from "../_components/not-found";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import Members from "./members";

type Props = {
  params: { id: number };
};

const page = async ({ params }: Props) => {
  const user = await currentUserOrThrowAuthError();

  const EventId = await getEventId(params.id);
  if (!EventId) return <NotFound></NotFound>;

  return (
    <div className="flex p-2 min-h-screen flex-col w-full">
      <Members user={user} eventId={EventId} />
    </div>
  );
};

export default page;
