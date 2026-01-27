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

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { createIncentiveSchema } from "@/validation-schema/incentive";
import { ClaimRequirements } from "@prisma/client";


type Props = {
    state: boolean;
    eventId : number;
    onClose: (state: boolean) => void;
    onCancel?: () => void;
    onCreate?: (newBranch: TBranch) => void;
};

type createTIncentives = z.infer<typeof createIncentiveSchema>;

const CreateIncentiveModal = ({ state, onClose, eventId, onCancel, onCreate }: Props) => {
    const queryClient = useQueryClient();

    const form = useForm<createTIncentives>({
        resolver: zodResolver(createIncentiveSchema),
        defaultValues: {
            itemName : "",
            claimRequirement : "REGISTERED"
        },
    });

    const reset = () => {
        form.reset();
        onClose(false);
    }

    const createIncentive = useMutation<TIncentive, string, createTIncentives>({
        mutationKey: ["create-incentive"],
        mutationFn: async (data) => {
            try {
                const response = await axios.post(`/api/v1/admin/event/${eventId}/incentives`, { data });

                queryClient.invalidateQueries({ queryKey: ["incentive-withclaimcount-list"] });
                if (onCreate !== undefined) onCreate(response.data);
                reset();
                toast.success("Incentive created successfully")
                return response.data;
            } catch (e) {
                const errorMessage =  handleAxiosErrorMessage(e);

                toast.error(errorMessage);
                throw errorMessage
            }
        },
    });

    const isLoading = createIncentive.isPending;


    return (
        <Dialog open={state} onOpenChange={(state)=> reset() }>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <ModalHead
                    title="Create Incentive"
                    description="Incentives are items that is given away on the event."
                />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((formValues) =>
                            createIncentive.mutate(formValues)
                        )}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="itemName"
                            disabled={isLoading}
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

export default CreateIncentiveModal;
