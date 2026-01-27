"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";

import { TPosition, TPositionWithEventID} from "@/types";
import { createPositionSchema, updatePositionSchema } from "@/validation-schema/position";
import { z } from "zod";
import { useCallback, useEffect } from "react";
import { updatePositions } from "@/hooks/api-hooks/position-api-hooks";

type Props = {
   state: boolean;
   onClose: (state: boolean) => void;
   onCancel?: () => void;
   position:TPositionWithEventID
};

type updateTPosition = z.infer<typeof updatePositionSchema>;

const UpdatePositionModal = ({
   state,
   onClose,
   onCancel,
   position,
}: Props) => {

   const positionForm = useForm<updateTPosition>({
      resolver: zodResolver(createPositionSchema),
   });

   const defaultValues = useCallback(() => {
      positionForm.setValue("positionName", position.positionName);
      positionForm.setValue("numberOfSelection", position.numberOfSelection);
      positionForm.setValue("electionId", position.electionId);
   }, [positionForm, position]);

   useEffect(() => {
      defaultValues();
   }, [positionForm, position]);

   const onCancelReset = () => {
      onClose(false);
   };
   const params = { id: position.eventId, electionId: position.electionId, positionId: position.id };
   const updatePositionMutation = updatePositions({onCancelReset:onCancelReset,params:params})

   const isLoading = updatePositionMutation.isPending

   return (
      <Dialog
         open={state}
         onOpenChange={(state) => {
            onClose(state);
         }}
      >
         <DialogContent className="border-none shadow-2 sm:rounded-2xl max-w-[600px] font-inter">
            <ModalHead
               title="Update Position"
               description="You are about to  a position. When updating you must need to provide atleast 1 number of seats!"
            />
            <Form {...positionForm}>
               <form
                  onSubmit={positionForm.handleSubmit((formValues) => {
                     updatePositionMutation.mutate(formValues);
                  })}
                  className=" space-y-3"
               >
                  <FormField
                     control={positionForm.control}
                     name="positionName"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Position Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="enter position name"
                                 className="placeholder:text-foreground/40"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={positionForm.control}
                     name="numberOfSelection"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>number of Seats</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="short description of the event"
                                 className="placeholder:text-foreground/40"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Separator className="bg-muted/70" />
                  <div className="flex justify-end gap-x-2">
                     <Button
                        disabled={isLoading}
                        onClick={(e) => {
                           e.preventDefault();
                           onClose(false)
                        }}
                        variant={"secondary"}
                        className="bg-muted/60 hover:bg-muted"
                     >
                        cancel
                     </Button>
                     <Button disabled={isLoading} type="submit">
                        {isLoading ? (
                           <Loader2
                              className="h-3 w-3 animate-spin"
                              strokeWidth={1}
                           />
                        ) : (
                           "Save"
                        )}
                     </Button>
                  </div>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};

export default UpdatePositionModal;
