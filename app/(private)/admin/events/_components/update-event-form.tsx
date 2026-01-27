"use client";
import z from "zod";
import { v4 } from "uuid";
import React from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoIosPower as PowerIcon } from "react-icons/io";
import { QrCode, CalendarIcon, UserRoundSearch, Cake } from "lucide-react";

import {
    Form,
    FormItem,
    FormLabel,
    FormField,
    FormMessage,
    FormControl,
    FormDescription,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ImagePick from "@/components/image-pick";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/loading-spinner";
import { updateEventSchema } from "@/validation-schema/event";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { cn } from "@/lib/utils";
import { TEventWithElection } from "@/types";
import useImagePick from "@/hooks/use-image-pick";
import { useUpdateEventSettings } from "@/hooks/api-hooks/use-events";
import { onUploadImage } from "@/hooks/api-hooks/image-upload-api-hook";

type TFormData = z.infer<typeof updateEventSchema>;

interface Props {
    eventId: number;
    defaultValues?: TEventWithElection;
    onSuccess?: (data: TEventWithElection) => void;
    onError?: (error: string) => void;
}

const UpdateEventForm = ({ defaultValues, eventId, ...other }: Props) => {
    const { imageURL, imageFile, onSelectImage } = useImagePick({
        initialImageURL: !defaultValues?.coverImage
            ? "/images/default.png"
            : defaultValues.coverImage,
        maxOptimizedSizeMB: 1,
        maxWidthOrHeight: 800,
        maxPictureSizeMb: 50,
    });

    const { mutateAsync: uploadImage, isPending: isUploadingImage } =
        onUploadImage();

    const form = useForm<TFormData>({
        resolver: zodResolver(updateEventSchema),
        defaultValues: {
            title: "",
            description: "",
            date: new Date(),
            location: "",
            registrationOnEvent: false,
            defaultMemberSearchMode: "ByPassbook",
            ...defaultValues,
        },
    });

    const { isPending, mutate: updateEvent } = useUpdateEventSettings({
        eventId,
        onSuccess: (data) => {
            toast.success("Event Updated");
            other.onSuccess?.(data);
            form.reset(data);
        },
        onError: (err) => {
            toast.error(err);
            other.onError?.(err);
        },
    });

    const onSubmit = async (data: TFormData) => {
        if (imageFile) {
            const image = await uploadImage({
                fileName: `${v4()}`,
                folderGroup: "event",
                file: data.coverImage,
            });

            updateEvent({
                ...data,
                coverImage: !image ? "/images/default.png" : image,
            });
            return;
        }
        updateEvent(data);
    };

    const isLoading = isUploadingImage || isPending;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <fieldset disabled={isLoading} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                        <div className="grid sm:grid-cols-2 gap-3">
                            <FormField
                                name="title"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Title *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Event Title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="date"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date of Event *</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "text-left w-full font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "PPP"
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    captionLayout="dropdown-buttons"
                                                    disabled={(date) =>
                                                        date <
                                                        new Date(
                                                            new Date().setDate(
                                                                new Date().getDate() -
                                                                    1
                                                            )
                                                        )
                                                    }
                                                    fromYear={1900}
                                                    toYear={new Date().getFullYear()}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="location"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="sm:col-span-2">
                                        <FormLabel>Location *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Event Location"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="sm:col-span-2">
                                        <FormLabel>Description</FormLabel>
                                        <FormDescription className="text-xs">
                                            Provide a brief description about
                                            the event. This will also be
                                            displayed in public event
                                        </FormDescription>
                                        <FormControl>
                                            <Textarea
                                                className="min-h-28"
                                                placeholder="Event Description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            name="coverImage"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem className="max-w-sm flex flex-col justify-center gap-y-2 mx-auto">
                                        <FormLabel className="mx-auto">
                                            Event Cover Image
                                        </FormLabel>
                                        <FormControl>
                                            <ImagePick
                                                className="flex flex-col items-center gap-y-4"
                                                url={imageURL}
                                                onChange={async (e) => {
                                                    field.onChange(
                                                        await onSelectImage(e)
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>

                    <Separator className="!my-6" />

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="isRegistrationOpen"
                                    render={({ field }) => {
                                        const radioValue = field.value
                                            ? "true"
                                            : "false";
                                        return (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>
                                                    Registration Status
                                                </FormLabel>
                                                <FormDescription className="text-xs text-muted-foreground">
                                                    Set registration status to
                                                    start or end registration.
                                                    This will override the
                                                    settings below.
                                                </FormDescription>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            field.onChange(
                                                                value === "true"
                                                            )
                                                        }
                                                        value={radioValue}
                                                        className="gap-2 flex flex-row"
                                                    >
                                                        <div className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-secondary/80 ease-in-out duration-300 hover:bg-secondary/60">
                                                            <RadioGroupItem
                                                                value="true"
                                                                id="isRegistrationOpen-true"
                                                                aria-describedby="registrationOnEvent-true-description"
                                                                className="order-1 after:absolute after:inset-0"
                                                            />
                                                            <div className="grow space-y-4">
                                                                <Label htmlFor="isRegistrationOpen-true">
                                                                    <PowerIcon
                                                                        className={cn(
                                                                            "inline size-6 mr-2 text-muted-foreground/40",
                                                                            field.value &&
                                                                                "text-primary animate-pulse"
                                                                        )}
                                                                    />
                                                                    Open
                                                                </Label>
                                                                <p
                                                                    id="isRegistrationOpen-true-description"
                                                                    className="text-xs text-muted-foreground"
                                                                >
                                                                    System will
                                                                    accept
                                                                    registration
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="relative flex w-full items-start gap-2 rounded-lg border border-muted hover:border-destructive p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-destructive has-[[data-state=checked]]:bg-destructive/10 ease-in-out duration-300 hover:bg-secondary/60">
                                                            <RadioGroupItem
                                                                value="false"
                                                                id="isRegistrationOpen-false"
                                                                aria-describedby="registrationOnEvent-false-description"
                                                                className="order-1 after:absolute after:inset-0"
                                                            />
                                                            <div className="grow space-y-4">
                                                                <Label htmlFor="isRegistrationOpen-true">
                                                                    <PowerIcon
                                                                        className={cn(
                                                                            "inline size-6 mr-2 text-muted-foreground/40",
                                                                            field.value ===
                                                                                false &&
                                                                                "text-destructive"
                                                                        )}
                                                                    />
                                                                    Ended
                                                                </Label>
                                                                <p
                                                                    id="isRegistrationOpen-true-description"
                                                                    className="text-xs text-muted-foreground"
                                                                >
                                                                    No member
                                                                    can register
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="registrationOnEvent"
                                    render={({ field }) => {
                                        const radioValue = field.value
                                            ? "true"
                                            : "false";
                                        return (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>
                                                    Event Registration
                                                </FormLabel>
                                                <FormDescription className="text-xs text-muted-foreground">
                                                    Choose when members can
                                                    register to the event.
                                                </FormDescription>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            field.onChange(
                                                                value === "true"
                                                            )
                                                        }
                                                        value={radioValue}
                                                        className="gap-2"
                                                    >
                                                        <div className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-secondary/80 ease-in-out duration-300 hover:bg-secondary/60">
                                                            <RadioGroupItem
                                                                value="true"
                                                                id="registrationOnEvent-true"
                                                                aria-describedby="registrationOnEvent-true-description"
                                                                className="order-1 after:absolute after:inset-0"
                                                            />
                                                            <div className="grow space-y-4">
                                                                <Label htmlFor="registrationOnEvent-true">
                                                                    On Event
                                                                    Date (Exact
                                                                    Date
                                                                    Registration)
                                                                </Label>
                                                                <p
                                                                    id="registrationOnEvent-true-description"
                                                                    className="text-xs text-muted-foreground"
                                                                >
                                                                    Only allow
                                                                    event
                                                                    registration/attendance
                                                                    on the
                                                                    event&apos;s
                                                                    specified
                                                                    date.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-secondary/80 ease-in-out duration-300 hover:bg-secondary/60">
                                                            <RadioGroupItem
                                                                value="false"
                                                                id="registrationOnEvent-false"
                                                                aria-describedby="registrationOnEvent-false-description"
                                                                className="order-1 after:absolute after:inset-0"
                                                            />
                                                            <div className="grow space-y-4">
                                                                <Label htmlFor="registrationOnEvent-true">
                                                                    Before Event
                                                                    Date
                                                                    (Advance
                                                                    Registration)
                                                                </Label>
                                                                <p
                                                                    id="registrationOnEvent-true-description"
                                                                    className="text-xs text-muted-foreground"
                                                                >
                                                                    Allow event
                                                                    registration/attendance
                                                                    before the
                                                                    event&apos;s
                                                                    specified
                                                                    date.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                                <Separator />
                                <FormField
                                    name="requireBirthdayVerification"
                                    control={form.control}
                                    render={({ field }) => {
                                        const id =
                                            "requireBirthdayVerification";
                                        return (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>
                                                    Require Birthday
                                                    Verification (Registration)
                                                </FormLabel>
                                                <FormDescription className="text-xs text-muted-foreground">
                                                    Members must provide a
                                                    birthday for verification.
                                                    Registration without a
                                                    birthday is not allowed.
                                                </FormDescription>
                                                <FormControl>
                                                    <div className="relative flex w-full items-start gap-2 rounded-lg border border-input shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-secondary/80 ease-in-out duration-300 hover:bg-secondary/60">
                                                        <Checkbox
                                                            id={id}
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                            className="absolute top-4 right-4"
                                                            aria-describedby={`${id}-description`}
                                                        />
                                                        <Label
                                                            htmlFor={id}
                                                            className="flex cursor-pointer grow items-center gap-3 p-4"
                                                        >
                                                            <Cake />
                                                            <div className="grid gap-2">
                                                                <p>
                                                                    Require
                                                                    Birthday as
                                                                    2nd
                                                                    Verification{" "}
                                                                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground">
                                                                        (Sublabel)
                                                                    </span>
                                                                </p>
                                                                <p
                                                                    id={`${id}-description`}
                                                                    className="text-xs font-normal text-muted-foreground"
                                                                >
                                                                    Members must
                                                                    verify their
                                                                    birthdate to
                                                                    complete
                                                                    registration.
                                                                </p>
                                                                <FormDescription className="text-xs font-normal text-muted-foreground">
                                                                    <strong>
                                                                        NOTE:
                                                                    </strong>{" "}
                                                                    Members with
                                                                    no birthdate
                                                                    specified in
                                                                    the event
                                                                    attendees
                                                                    will be
                                                                    affected.
                                                                </FormDescription>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="defaultMemberSearchMode"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>
                                            Default Member Search Mode
                                        </FormLabel>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Choose the default member search
                                            mode. This sets the default
                                            searching mode for registration or
                                            voting.
                                        </FormDescription>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="gap-2"
                                            >
                                                <div className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-secondary/80 ease-in-out duration-300 hover:bg-secondary/60">
                                                    <RadioGroupItem
                                                        value="ByPassbook"
                                                        id="defaultMemberSearchMode-ByPassbook"
                                                        aria-describedby="defaultMemberSearchMode-ByPassbook-description"
                                                        className="order-1 after:absolute after:inset-0"
                                                    />
                                                    <div className="flex grow items-center gap-3">
                                                        <QrCode opacity={0.7} />
                                                        <div className="grid grow gap-2">
                                                            <Label htmlFor="defaultMemberSearchMode-ByPassbook">
                                                                By Passbook
                                                            </Label>
                                                            <p
                                                                id="defaultMemberSearchMode-ByPassbook-description"
                                                                className="text-xs text-muted-foreground"
                                                            >
                                                                Set default
                                                                member searching
                                                                method by{" "}
                                                                <strong>
                                                                    PB Number
                                                                </strong>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-secondary/80 ease-in-out duration-300 hover:bg-secondary/60">
                                                    <RadioGroupItem
                                                        value="ByName"
                                                        id="defaultMemberSearchMode-ByName"
                                                        aria-describedby="defaultMemberSearchMode-ByName-description"
                                                        className="order-1 after:absolute after:inset-0"
                                                    />
                                                    <div className="flex grow items-center gap-3">
                                                        <UserRoundSearch
                                                            opacity={0.7}
                                                        />
                                                        <div className="grid grow gap-2">
                                                            <Label htmlFor="defaultMemberSearchMode-ByName">
                                                                By Name
                                                            </Label>
                                                            <p
                                                                id="defaultMemberSearchMode-ByName-description"
                                                                className="text-xs leading-loose text-muted-foreground"
                                                            >
                                                                Set default
                                                                member searching
                                                                method by their
                                                                name by
                                                                separating with
                                                                comma and space
                                                                <br />
                                                                <span className="opacity-80">
                                                                    Format:
                                                                </span>
                                                                <span className="py-0.5 px-2 rounded mx-1 bg-secondary">
                                                                    Lastname,
                                                                    Firstname
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => form.reset()}
                            disabled={!form.formState.isDirty}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty}
                        >
                            {isLoading ? <LoadingSpinner /> : "Save"}
                        </Button>
                    </div>
                </fieldset>
            </form>
        </Form>
    );
};

export default UpdateEventForm;
