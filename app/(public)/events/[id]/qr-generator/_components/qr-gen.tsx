"use client";
import React, { useState } from "react";

import QrCode from "@/components/qr-code";

import useLimiter from "@/hooks/use-limiter";
import { TMemberAttendeesMinimalInfo } from "@/types";
import MemberSearch from "@/components/member-search";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";

const QrGen = ({ eventId }: { eventId: number }) => {
  const [member, setMember] = useState<TMemberAttendeesMinimalInfo | null>(
    null,
  );

  const value = useLimiter(member?.passbookNumber ?? "", 200);

  return (
    <div className="flex bg-background/70 rounded-xl p-4 flex-col items-center gap-y-5  w-fit flex-1 py-16">
      <p className="text-2xl text-foreground/80 lg:text-4xl">
        Generate QR Code
      </p>
      {member ? (
        <>
          <QrCode
            value={value}
            className="size-[300px] lg:size-[350px]"
            showDownload
          />
          <div className="group flex px-3 py-2 items-center w-full max-w-sm gap-x-2 duration-100 ease-in rounded-xl bg-secondary/70 hover:bg-secondary">
            <div className="flex-1 flex items-center gap-x-2">
              <UserAvatar
                src={member.picture as ""}
                fallback={`${member.firstName.charAt(
                  0,
                )} ${member.lastName.charAt(0)}`}
                className="size-12"
              />
              <div className="flex flex-col">
                <p>{`${member.firstName} ${member.lastName}`}</p>
                <p className="text-sm inline-flex">
                  <span className="text-foreground/60">Passbook :&nbsp;</span>
                  <span>{member.passbookNumber}</span>
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="opacity-10 ease-in bg-transparent text-foreground hover:bg-transparent group-hover:opacity-100"
              onClick={() => setMember(null)}
            >
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <MemberSearch
          disableQr
          eventId={eventId}
          onFound={(member) => setMember(member)}
        />
      )}
    </div>
  );
};

export default QrGen;
