import UserAvatar from "@/components/user-avatar";
import {
  TMemberAttendeeMinimalInfo,
  TMemberAttendeesMinimalInfo,
} from "@/types";
import React from "react";

type Props = {
  member: TMemberAttendeesMinimalInfo;
};

const MemberCard = ({ member }: Props) => {
  return (
    <div className="relative bg-background max-w-xs w-full flex overflow-hidden flex-col items-center rounded-2xl">
      <div className="h-16 w-full bg-sky-300">
        <img
          alt="prof"
          src={member.picture as ""}
          className="object-cover w-full blur-sm"
        />
      </div>
      <div className="relative flex flex-col items-center pt-12 pb-2 space-y-2 bg-background w-full">
        <UserAvatar
          src={member.picture as ""}
          fallback={`${member.firstName.charAt(0)}${member.lastName.charAt(0)}`}
          className="size-24 absolute -top-14"
        />
        <p className="text-xl">{`${member.firstName} ${member.lastName}`}</p>
        <p className="text-base">{member.passbookNumber}</p>
      </div>
    </div>
  );
};

export default MemberCard;
