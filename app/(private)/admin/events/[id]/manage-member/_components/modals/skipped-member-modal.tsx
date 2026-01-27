"use client";
import React, { useEffect } from "react";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useSkippedStore from "@/stores/skipped-members-store";
import * as XLSX from 'xlsx'
import { toast } from "sonner";

type Props = {
   state: boolean;
   onClose: (state: boolean) => void;
};

const SkippedMemberModal = ({ state, onClose }: Props) => {

   const { skippedMembers, setSkippedMembers } = useSkippedStore();

   const handleExport = () => {
     const worksheet = XLSX.utils.json_to_sheet(skippedMembers);
     const workbook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
     XLSX.writeFile(workbook, "SkippMemberList.xlsx");
     onClose(false);
     toast.success("skipped Members list downloaded");
  };
   
   return (
      <Dialog
         open={state}
         onOpenChange={(state) => {
            onClose(state);
         }}
      >
         <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
            <ModalHead
               title="Skipped Member ⚠️"
               description={`You have imported ${skippedMembers.length} duplicate members; ensure that any duplicate passbook entries are skipped. Please ensure to clean your file before importing.`}
            />
            <p className=" text-sm text-center font-bold">Export this members to edit and import again</p>
            <Button disabled={skippedMembers.length === 0} onClick={()=>{
               handleExport()
               setSkippedMembers([])
            }} variant={"link"}>SkippMemberList.xlsx</Button>
            <DialogFooter>
               <Button disabled={skippedMembers.length === 0} 
               onClick={()=>{
                    handleExport()
                    setSkippedMembers([])
                 }}
               >export</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default SkippedMemberModal;
