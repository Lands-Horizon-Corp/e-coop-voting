import { isAllowed } from "@/lib/utils";

import Election from "./_components/election";
import NotAllowed from "../../../_components/not-allowed";

import { currentUserOrFalse } from "@/lib/auth";

type Props = {
  params: { id: number; electionId: number };
};

const page = async ({ params }: Props) => {
  const currentUser = await currentUserOrFalse();

  if (!currentUser || !isAllowed(["root", "coop_root", "admin"], currentUser))
    return <NotAllowed />;

  return <Election params={params} user={currentUser}></Election>;
};

export default page;
