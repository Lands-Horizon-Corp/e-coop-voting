import React from "react";

import RegisterHome from "./_components/register-home";
import InvalidPrompt from "@/components/invalid-prompt";

import { eventIdParamSchema } from "@/validation-schema/api-params";
import { Metadata } from "next";

type Props = { params: { id: string } };

export const metadata: Metadata = {
  title: "Register",
};

const RegisterPage = async ({ params }: Props) => {
  const validatedEventId = eventIdParamSchema.safeParse(params);

  if (!validatedEventId.success)
    return <InvalidPrompt message="This event id is invalid" />;

  return <RegisterHome eventId={validatedEventId.data.id} />;
};

export default RegisterPage;
