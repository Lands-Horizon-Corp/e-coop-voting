"use client";
import { z } from "zod";
import { v4 } from "uuid";
import { user } from "next-auth";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EventType, Role } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Select,
    SelectItem,
    SelectValue,
    SelectContent,
    SelectTrigger,
} from "@/components/ui/select";
import {
    Form,
    FormItem,
    FormLabel,
    FormField,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImagePick from "@/components/image-pick";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { createEventWithElectionWithUploadSchema } from "@/validation-schema/event";

import { cn } from "@/lib/utils";
import useImagePick from "@/hooks/use-image-pick";
import { branchList } from "@/hooks/api-hooks/branch-api-hooks";
import { useCreateEvent } from "@/hooks/api-hooks/event-api-hooks";
import { onUploadImage } from "@/hooks/api-hooks/image-upload-api-hook";

type Props = {
    state: boolean;
    onClose: (state: boolean) => void;
    onCancel?: () => void;
    user: user;
};

export type EventSchemaType = z.infer<
    ReturnType<typeof createEventWithElectionWithUploadSchema>
>;

const CreateEventModal = ({ state, onClose, onCancel, user }: Props) => {
    const [isElection, setIsElection] = useState(false);
    const inputRef = useRef(null);

    // Create the schema
    const EventSchema = createEventWithElectionWithUploadSchema(isElection);

    const { data: branches, isLoading: branchLoading } = branchList(user);

    const { imageURL, imageFile, onSelectImage, resetPicker } = useImagePick({
        initialImageURL: "/images/default.png",
        maxOptimizedSizeMB: 1,
        maxWidthOrHeight: 800,
    });

    const eventForm = useForm<EventSchemaType>({
        resolver: zodResolver(EventSchema),
        defaultValues: {
            title: "",
            description: "",
            location: "",
            category: EventType.event,
            date: undefined,
            electionName: "",
            coverImage: imageFile,
            branchId: user.role === Role.admin ? user.branchId : 0,
            coopId: user.coopId,
        },
    });

    const onCancelandReset = () => {
        eventForm.reset();
        onClose(false);
    };

    const createEvent = useCreateEvent({ onCancelandReset });

    const uploadImage = onUploadImage();

    const onSubmit = async (formValues: EventSchemaType) => {
        try {
            if (!imageFile) {
                createEvent.mutate({
                    ...formValues,
                    coverImage: "/images/default.png",
                    branchId:
                        user.role === Role.admin
                            ? user.branchId
                            : formValues.branchId,
                });
            } else {
                const image = await uploadImage.mutateAsync({
                    fileName: `${v4()}`,
                    folderGroup: "event",
                    file: formValues.coverImage,
                });
                createEvent.mutate({
                    ...formValues,
                    coverImage: !image ? "/images/default.png" : image,
                    branchId:
                        user.role === Role.admin
                            ? user.branchId
                            : formValues.branchId,
                });
            }
            resetPicker();
        } catch (error) {
            console.log(error);
        }
    };

    const isLoading = createEvent.isPending;
    const isUploading = uploadImage.isPending;

    return (
        <Dialog
            open={state}
            onOpenChange={(state) => {
                onClose(state);
                eventForm.reset();
            }}
        >
            <DialogContent
                className={cn(
                    "border-none overflow-auto overflow-y-auto max-h-[700px] shadow-2 sm:rounded-2xl  max-w-[1200px] font-inter"
                )}
            >
                <ModalHead
                    title="Add Event"
                    description="Creating an event will also generate an election. The election may be optional as well."
                />
                <Form {...eventForm}>
                    <form
                        onSubmit={eventForm.handleSubmit(onSubmit)}
                        className="flex flex-col space-y-3 w-full overflow-auto overflow-y-auto"
                    >
                        <div className="flex flex-col px-2 lg:flex-row lg:space-x-5">
                            <div className="w-full  space-y-2 lg:space-y-5 ">
                                <FormField
                                    control={eventForm.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="event name"
                                                    className="placeholder:text-foreground/40"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={eventForm.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Event Description
                                            </FormLabel>
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
                                <FormField
                                    control={eventForm.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Event Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="address of the Event"
                                                    className="placeholder:text-foreground/40"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={eventForm.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="flex justify-between">
                                                <h1>Date of Event</h1>{" "}
                                            </FormLabel>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={
                                                    field.value instanceof Date
                                                        ? field.value
                                                              .toISOString()
                                                              .split("T")[0]
                                                        : field.value
                                                }
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={eventForm.control}
                                    name="branchId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Branch</FormLabel>
                                            <Select
                                                disabled={
                                                    branchLoading ||
                                                    !(
                                                        [
                                                            Role.root,
                                                            Role.coop_root,
                                                        ] as Role[]
                                                    ).includes(user.role)
                                                }
                                                onValueChange={field.onChange}
                                                defaultValue={field.value.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a branch" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {branches.map((branch) => (
                                                        <SelectItem
                                                            key={branch.id}
                                                            value={branch.id.toString()}
                                                        >
                                                            {branch.branchName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full space-y-2 lg:space-y-5 ">
                                <FormField
                                    control={eventForm.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>category </FormLabel>
                                            <Select
                                                onValueChange={(
                                                    newValue: EventType
                                                ) => {
                                                    field.onChange(newValue);
                                                    if (
                                                        newValue ===
                                                        EventType.election
                                                    ) {
                                                        setIsElection(true);
                                                    } else {
                                                        setIsElection(false);
                                                        eventForm.setValue(
                                                            "electionName",
                                                            undefined
                                                        );
                                                    }
                                                }}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a catergory" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem
                                                        value={
                                                            EventType.election
                                                        }
                                                    >
                                                        {EventType.election}
                                                    </SelectItem>
                                                    <SelectItem
                                                        value={EventType.event}
                                                    >
                                                        {EventType.event}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={eventForm.control}
                                    name="electionName"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Election Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={!isElection}
                                                    placeholder="Election name"
                                                    className="placeholder:text-foreground/40"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={eventForm.control}
                                    name="coverImage"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Cover</FormLabel>
                                                <FormControl>
                                                    <>
                                                        <ImagePick
                                                            className="flex flex-col items-center gap-y-4"
                                                            url={imageURL}
                                                            onChange={async (
                                                                e
                                                            ) => {
                                                                field.onChange(
                                                                    await onSelectImage(
                                                                        e
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                    </>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <Separator className="bg-muted/70" />
                        <div className="flex justify-end gap-x-2">
                            <Button
                                disabled={isLoading}
                                onClick={(e) => {
                                    e.preventDefault();
                                    eventForm.reset();
                                    resetPicker();
                                }}
                                variant={"ghost"}
                                className="bg-muted/60 hover:bg-muted"
                            >
                                clear
                            </Button>
                            <Button
                                disabled={isLoading}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onCancelandReset();
                                }}
                                variant={"secondary"}
                                className="bg-muted/60 hover:bg-muted"
                            >
                                cancel
                            </Button>
                            <Button disabled={isLoading} type="submit">
                                {isLoading || isUploading ? (
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

export default CreateEventModal;
