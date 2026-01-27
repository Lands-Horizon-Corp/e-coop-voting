"use client"
import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { TBranch, TIncentive } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { updateIncentiveSchema } from "@/validation-schema/incentive";
import { useEffect } from "react";
import { ClaimRequirements } from "@prisma/client";


type Props = {
    state: boolean;
    incentive : TIncentive;
    onClose: (state: boolean) => void;
    onCancel?: () => void;
    onCreate?: (newBranch: TBranch) => void;
};

type updateTIncentives = z.infer<typeof updateIncentiveSchema>;

const UpdateIncentiveModal = ({ state, onClose, incentive, onCreate }: Props) => {
    const queryClient = useQueryClient();

    const form = useForm<updateTIncentives>({
        resolver: zodResolver(updateIncentiveSchema),
        defaultValues: {
            itemName : incentive.itemName,
            claimRequirement : incentive.claimRequirement ?? "REGISTERED"
        },
    });

    useEffect(()=>{
        form.setValue("itemName", incentive.itemName)
    }, [incentive, form]);

    const reset = () => {
        form.reset();
        onClose(false);
    }

    const updateIncentive = useMutation<TIncentive, string, updateTIncentives>({
        mutationKey: ["update-incentive"],
        mutationFn: async (data) => {
            try {
                const response = await axios.patch(`/api/v1/admin/event/${incentive.eventId}/incentives/${incentive.id}`, data);

                queryClient.invalidateQueries({ queryKey: ["incentive-withclaimcount-list"] });
                if (onCreate !== undefined) onCreate(response.data);
                reset();
                toast.success("Incentive updated successfully")
                return response.data;
            } catch (e) {
                const errorMessage =  handleAxiosErrorMessage(e);

                toast.error(errorMessage);
                throw errorMessage
            }
        },
    });

    const isLoading = updateIncentive.isPending;


    return (
        <Dialog open={state} onOpenChange={(state)=> reset() }>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <ModalHead
                    title="Update Incentive"
                    description="Update incentive information"
                />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((formValues) =>
                            updateIncentive.mutate(formValues)
                        )}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="itemName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Item name"
                                            className="placeholder:text-foreground/40"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="claimRequirement"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Claim Requirement</FormLabel>
                                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a requirement" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={ClaimRequirements.REGISTERED}>{ClaimRequirements.REGISTERED}</SelectItem>
                                            <SelectItem value={ClaimRequirements.VOTED}>{ClaimRequirements.VOTED}</SelectItem>
                                            <SelectItem value={ClaimRequirements.REGISTERED_VOTED}>{ClaimRequirements.REGISTERED_VOTED}</SelectItem>
                                            <SelectItem value={ClaimRequirements.REGISTERED_SURVEYED}>{ClaimRequirements.REGISTERED_SURVEYED}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Only member who satisfy this requirement can claim</FormDescription>
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

export default UpdateIncentiveModal;
