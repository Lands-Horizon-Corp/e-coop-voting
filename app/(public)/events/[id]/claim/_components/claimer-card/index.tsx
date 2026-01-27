import UserAvatar from "@/components/user-avatar";

import { TMemberAttendeesMinimalInfo } from "@/types";

type Props = { claimer: TMemberAttendeesMinimalInfo };

const ClaimerCard = ({ claimer }: Props) => {
  return (
    <div className="flex flex-col items-center max-w-sm w-full mx-auto gap-y-2">
      <p className="text-xl">Claiming As</p>
      <div className="group flex px-3 py-2 items-center w-full gap-x-2 duration-100 ease-in rounded-xl bg-secondary/70 hover:bg-secondary">
        <div className="flex-1 flex items-center gap-x-2">
          <UserAvatar
            src={claimer.picture as ""}
            fallback={`${claimer.firstName.charAt(0)} ${claimer.lastName.charAt(0)}`}
            className="size-12"
          />
          <div className="flex flex-col">
            <p>{`${claimer.firstName} ${claimer.lastName}`}</p>
            <p className="text-sm inline-flex">
              <span className="text-foreground/60">Passbook :&nbsp;</span>
              <span>{claimer.passbookNumber}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimerCard;
