"use client";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { z } from "zod";

import { createManyMember } from "@/hooks/api-hooks/member-api-hook";
import { read, utils } from "xlsx";
import { importCSVSchema } from "@/validation-schema/import-csv";
import { TMember } from "@/types";
import { DialogDescription } from "@radix-ui/react-dialog";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

type Props = {
  state: boolean;
  onOpenSkippedModal: (state: boolean) => void;
  onClose: (state: boolean) => void;
  onCancel?: () => void;
  id: number;
};

export type TImportSchema = z.infer<typeof importCSVSchema>;

const ImportFileModal = ({
  state,
  onClose,
  onCancel,
  id,
  onOpenSkippedModal,
}: Props) => {
  const [Members, setMembers] = useState<TMember[] | any>([]);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      console.warn("Import triggered, but no file was selected.");
      return;
    }

    const file = files[0];
    console.log(`File selected: ${file.name} (${file.size} bytes)`);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        console.log("File read successful, parsing workbook...");

        const wb = read(data);
        const sheets = wb.SheetNames;
        console.log(`Sheets found: ${sheets.join(", ")}`);

        if (sheets.length) {
          const rawRows = utils.sheet_to_json<any>(wb.Sheets[sheets[0]]);
          console.log(`Total raw rows parsed: ${rawRows.length}`);

          const filtered = rawRows.filter((row) => {
            // Try to find the values even if headers are "First Name" or "FIRST NAME"
            const firstName = (
              row.firstName ||
              row["First Name"] ||
              row["FIRST NAME"]
            )
              ?.toString()
              .trim();
            const lastName = (
              row.lastName ||
              row["Last Name"] ||
              row["LAST NAME"]
            )
              ?.toString()
              .trim();

            return Boolean(firstName || lastName);
          });
          console.log(`Rows after filtering: ${filtered.length}`);
          console.log(filtered[0]);
          setMembers(filtered);
        } else {
          console.error("The workbook appears to be empty (no sheets).");
        }
      } catch (error) {
        console.error("Error parsing Excel file:", error);
      }
    };

    reader.onerror = (error) => {
      console.error("FileReader error:", error);
    };

    reader.readAsArrayBuffer(file);
  };
  const onCancelandReset = () => {
    onClose(false);
    setMembers([]);
  };
  const onOpenSkippedMember = () => {
    onOpenSkippedModal(true);
  };

  const createManyMemberMutation = createManyMember({
    onCancelandReset,
    onOpenSkippedMember,
  });
  const isLoading = createManyMemberMutation.isPending;

  const onSubmit = (e: any) => {
    e.preventDefault();
    createManyMemberMutation.mutate({ member: Members, eventId: id });
  };

  const sampleFile = [
    {
      passbookNumber: "",
      lastName: "",
      firstName: "",
      middleName: "",
      gender: "",
      birthday: "",
      contact: "",
      emailAddress: "",
      registered: "",
    },
  ];

  const handleExportSampleFile = () => {
    const worksheet = XLSX.utils.json_to_sheet(sampleFile);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Example Member List Format.xlsx");
    onClose(false);
    toast.success("Sample file downloaded");
  };

  return (
    <Dialog
      open={state}
      onOpenChange={(state) => {
        onClose(state);
        onCancelandReset();
      }}
    >
      <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
        <ModalHead
          title="Import Member"
          description="When importing members, ensure that any duplicate passbook entries are skipped. Please ensure to clean your file before saving."
        />
        <DialogDescription className="text-sm border rounded-xl p-3 bg-secondary/60 flex justify-center flex-col items-center space-y-3">
          <div>Follow these required column headers when importing:</div>
          <div className=" flex flex-wrap text-muted-foreground">
            {Object.keys(sampleFile[0]).map((key, idx) => {
              return (
                <p className="text-primary" key={key}>
                  {" "}
                  {key} <span className="invisible">__</span>
                </p>
              );
            })}
          </div>
          <Separator className="text-center text-muted-foreground text-[12px]">
            or download this format
          </Separator>
          <Button
            onClick={handleExportSampleFile}
            variant={"link"}
            className="flex items-center justify-center space-x-2"
          >
            <span>Example Member List Format</span>{" "}
            <Download className="size-4"></Download>
          </Button>
        </DialogDescription>
        <form onSubmit={onSubmit}>
          <Input
            type="file"
            name="file"
            onChange={handleImport}
            accept=".xlsx, .xls, .csv, .xlm"
          />
          {isLoading && (
            <p className=" text-center m-2 animate-pulse text-primary text-sm">
              Importing! Please Wait..
            </p>
          )}
          <div className="flex justify-end gap-x-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                onCancelandReset();
              }}
              variant={"secondary"}
              className="bg-muted/60 hover:bg-muted"
            >
              cancel
            </Button>
            <Button
              disabled={Members.length === 0 ? true : false}
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1} />
              ) : (
                "Import"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ImportFileModal;
