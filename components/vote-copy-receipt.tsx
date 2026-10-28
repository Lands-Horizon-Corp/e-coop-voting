"use client";

import { useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { IoIosSave } from "react-icons/io";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/utils";
import { TEvent, TVoteCopyB64 } from "@/types";

type Props = {
  event: Pick<TEvent, "id" | "title" | "date" | "location">;
  electionId: number;
  fullName: string;
  passbookNumber: string;
  votes: TVoteCopyB64[];
};

const VoteCopyReceipt = ({
  event,
  electionId,
  fullName,
  passbookNumber,
  votes,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const downloadVoteSummary = async () => {
    if (!containerRef.current) return;

    setSaving(true);
    try {
      const dataUrl = await htmlToImage.toJpeg(containerRef.current, {
        quality: 0.95,
      });
      const link = document.createElement("a");
      link.download = `${fullName}-${passbookNumber}-vote-summary.jpeg`;
      link.href = dataUrl;
      link.click();
      toast.success("Vote summary downloaded");
    } catch (error) {
      console.error("Can't download", error);
      toast.error("Could not download summary");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-y-8">
      <div
        ref={containerRef}
        className="flex w-full flex-col items-center gap-y-8 bg-background p-4"
      >
        <div className="w-full space-y-1 rounded-lg border p-4 text-center">
          <p className="text-lg font-semibold">{event.title}</p>
          <p className="text-sm text-foreground/70">
            {formatDateTime(event.date)}
          </p>
          <p className="text-sm text-foreground/70">{event.location}</p>
        </div>

        <Separator />
        <div className="flex w-full flex-col items-center gap-y-6">
          <p className="pb-4 text-xl">Your Vote Summary</p>

          <div className="flex w-full flex-col text-sm text-foreground/70">
            <div className="flex justify-between gap-4">
              <p>
                Voter: <span className="text-foreground">{fullName}</span>
              </p>
              <p>
                Event ID: <span className="text-foreground">{event.id}</span>
              </p>
            </div>
            <div className="flex justify-between gap-4">
              <p>
                Passbook No:{" "}
                <span className="text-foreground">{passbookNumber}</span>
              </p>
              <p>
                Election ID:{" "}
                <span className="text-foreground">{electionId}</span>
              </p>
            </div>
          </div>

          {votes.map(({ positionName, votedCandidates }) => (
            <div
              key={positionName}
              className="flex w-full flex-col gap-y-4 rounded-xl border bg-secondary/50 px-6 py-4 dark:bg-secondary/25"
            >
              <div className="flex justify-between">
                <p className="font-medium">{positionName}</p>
                <p className="text-sm text-foreground/50">
                  {votedCandidates.length} vote
                  {votedCandidates.length > 1 ? "'s" : ""}
                </p>
              </div>

              <div className="flex w-full flex-col gap-y-2">
                {votedCandidates.length === 0 && (
                  <p className="text-center text-xs text-foreground/40">
                    no voted candidate
                  </p>
                )}

                {votedCandidates.map(({ id, firstName, lastName }) => (
                  <p
                    key={id}
                    className="text-center text-base text-foreground/60"
                  >
                    {firstName} {lastName}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-y-3">
        <Button
          onClick={downloadVoteSummary}
          variant="secondary"
          className="gap-x-2"
          disabled={saving}
        >
          {saving ? (
            <LoadingSpinner />
          ) : (
            <>
              <IoIosSave className="size-4" />
              <span>Download Summary Copy</span>
            </>
          )}
        </Button>
        <p className="text-center text-xs text-foreground/50">
          If download doesn&apos;t work, please take a photo/screenshot of the
          summary instead as your own copy.
        </p>
      </div>
    </div>
  );
};

export default VoteCopyReceipt;
