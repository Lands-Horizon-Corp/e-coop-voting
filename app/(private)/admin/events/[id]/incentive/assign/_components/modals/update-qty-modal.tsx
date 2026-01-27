"use client";
import z from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { updateIncentiveAssignedSchema } from "@/validation-schema/incentive";
import { TListOfAssigneesWithAssistCount } from "@/types";
import { updateAssignedQuantity } from "@/hooks/api-hooks/incentive-api-hooks";

type Props = {
    state: boolean;
    assignee: TListOfAssigneesWithAssistCount;
    onClose: (state: boolean) => void;
};

type updateAssignedIncentive = z.infer<typeof updateIncentiveAssignedSchema>;

const UpdateQtyModal = ({ state, onClose, assignee }: Props) => {
    const form = useForm<updateAssignedIncentive>({
        resolver: zodResolver(updateIncentiveAssignedSchema),
        defaultValues: {
            assignedQuantity: assignee.assignedQuantity,
        },
    });

    useEffect(() => {
        form.setValue("assignedQuantity", assignee.assignedQuantity);
    }, [assignee, form]);

    const reset = () => {
        form.reset();
        onClose(false);
    };

    const { updateAssigned, isUpdating } = updateAssignedQuantity(
        assignee.eventId,
        assignee.incentiveId,
        assignee.id,
        () => reset()
    );

    const isLoading = isUpdating;

    return (
        <Dialog open={state} onOpenChange={(state) => reset()}>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <ModalHead
                    title="Update Incentive"
                    description="Update incentive information"
                />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((formValues) => {
                            console.log("submitted");
                            updateAssigned(formValues)
                        })}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="assignedQuantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Qty assigned"
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
                                    reset();
                                }}
                                variant={"ghost"}
                                className="bg-muted/60 hover:bg-muted"
                            >
                                Cancel
                            </Button>
                            <Button disabled={isLoading} type="submit">
                                {isLoading ? (
                                    <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1} />
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

export default UpdateQtyModal;
