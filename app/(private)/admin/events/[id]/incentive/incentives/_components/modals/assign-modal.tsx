"use client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/loading-spinner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
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
import { createIncentiveAssigneeSchema } from "@/validation-schema/incentive";
import {
    useCreateAssignIncentive,
    userWithAssignedIncentives,
} from "@/hooks/api-hooks/incentive-api-hooks";
import UserAvatar from "@/components/user-avatar";

type Props = {
    state: boolean;
    eventId: number;
    incentive: TIncentive;
    onClose: (state: boolean) => void;
    onCancel?: () => void;
    onCreate?: (newBranch: TBranch) => void;
};

type TCreateAssign = z.infer<typeof createIncentiveAssigneeSchema>;

const AssignModal = ({ state, onClose, eventId, incentive }: Props) => {
    const form = useForm<TCreateAssign>({
        resolver: zodResolver(createIncentiveAssigneeSchema),
        defaultValues: {
            assignedQuantity: 1,
        },
    });

    const { usersWithAssigned, isFetchingUser, isLoadingUser } = userWithAssignedIncentives(eventId);
    const { created, createAssignee, isCreatingAssignee, isError, error } = useCreateAssignIncentive(eventId, incentive.id, (data) => onClose(false));

    const reset = () => {
        form.reset();
        onClose(false);
    };

    const isLoading = isCreatingAssignee;

    return (
        <Dialog open={state} onOpenChange={(state) => reset()}>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <ModalHead
                    title="Assign Incentive"
                    description="Assign incentives to specific staff/admin. You can provide an amount assigned to them."
                />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((formValues) =>
                            createAssignee(formValues)
                        )}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Assign To</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    disabled={
                                                        isFetchingUser ||
                                                        isLoadingUser
                                                    }
                                                    className={cn(
                                                        " justify-between",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? usersWithAssigned.find(
                                                              (user) =>
                                                                  user.id ===
                                                                  field.value
                                                          )?.name
                                                        : "Select User"}
                                                    {isFetchingUser ||
                                                    isLoadingUser ? (
                                                        <LoadingSpinner />
                                                    ) : (
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        {!isLoadingUser && !isFetchingUser && (
                                            <PopoverContent className="w-full border-none bg-background/40 backdrop-blur-sm p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search User..." />
                                                    <CommandEmpty>
                                                        User not found.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {usersWithAssigned.map(
                                                            (user) => {
                                                                const assigned = user.assignedIncentive.find((assign) => assign.incentiveId === incentive.id ) !== undefined;

                                                                return (
                                                                    <CommandItem
                                                                        key={user.id}
                                                                        value={user.name}
                                                                        disabled={assigned}
                                                                        onSelect={() => {
                                                                            form.setValue(
                                                                                "userId",
                                                                                user.id
                                                                            );
                                                                        }}
                                                                        className={cn("gap-x-4", !assigned &&"cursor-pointer")}
                                                                    >
                                                                        <Check
                                                                            className={cn("mr-2 h-4 w-4", user.id === field.value? "opacity-100": "opacity-0")}
                                                                        />
                                                                        <UserAvatar
                                                                            src={user.picture as ""}
                                                                            fallback={user.name.substring(0,2)}
                                                                        />
                                                                        {user.name}
                                                                        <span className="text-sm flex-1 text-right font-medium">
                                                                            { assigned ? "assigned" : ""}
                                                                        </span>
                                                                    </CommandItem>
                                                                );
                                                            }
                                                        )}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        )}
                                    </Popover>
                                    <FormDescription></FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="assignedQuantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Assigned Quantity"
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
                                    <Loader2
                                        className="h-3 w-3 animate-spin"
                                        strokeWidth={1}
                                    />
                                ) : (
                                    "Assign"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AssignModal;
