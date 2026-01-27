import { z } from "zod";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    VotingEligibility,
    VotingConfiguration,
    VotingScreenOrientation,
} from "@prisma/client";

import {
    Form,
    FormItem,
    FormLabel,
    FormField,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectItem,
    SelectValue,
    SelectContent,
    SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { useUpdateElectionSettings } from "@/hooks/api-hooks/settings-hooks";

import { SettingsType, TElection } from "@/types";
import { electionSettingSchema } from "@/validation-schema/election-settings";

type Props = {
    election: TElection;
    params: { id: number; electionId: number };
};

const SettingsForm = ({ election, params }: Props) => {
    const { onOpen: onOpenConfirmModal } = useConfirmModal();

    const settingsForm = useForm<SettingsType>({
        resolver: zodResolver(electionSettingSchema),
        defaultValues: {
            ...election,
        },
    });

    const { isDirty } = settingsForm.formState;

    const updateSettings = useUpdateElectionSettings({ params });
    const isLoading = updateSettings.isPending;

    const onSubmit = (formValues: z.infer<typeof electionSettingSchema>) => {
        onOpenConfirmModal({
            title: "Update Election Settings",
            description: "Are you sure you want to update this Election",
            onConfirm: () => {
                updateSettings.mutate({ data: formValues });
                settingsForm.reset(formValues);
            },
        });
    };

    return (
        <div className="w-full p-2">
            <Form {...settingsForm}>
                <form
                    onSubmit={settingsForm.handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <FormField
                        control={settingsForm.control}
                        name="voteEligibility"
                        render={({ field }) => (
                            <FormItem className="flex justify-between items-center">
                                <FormLabel>Vote Eligibility</FormLabel>
                                <div className="w-44">
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="border-0 ring-offset-0 focus:ring-0 round-0 focus-visible:ring-0">
                                                <SelectValue
                                                    className="ring-offset-0 focus:ring-0 round-0 focus-visible:ring-0"
                                                    placeholder={`${field.value}`}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem
                                                value={VotingEligibility.MIGS}
                                            >
                                                {VotingEligibility.MIGS}
                                            </SelectItem>
                                            <SelectItem
                                                value={
                                                    VotingEligibility.REGISTERED
                                                }
                                            >
                                                {VotingEligibility.REGISTERED}
                                            </SelectItem>
                                            <SelectItem
                                                value={
                                                    VotingEligibility.MARKED_CANVOTE
                                                }
                                            >
                                                {
                                                    VotingEligibility.MARKED_CANVOTE
                                                }
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={settingsForm.control}
                        name="voteConfiguration"
                        render={({ field }) => (
                            <FormItem className="flex justify-between items-center">
                                <FormLabel>Voting Configuration</FormLabel>
                                <div className="w-44">
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="border-0 ring-offset-0 focus:ring-0 round-0 focus-visible:ring-0">
                                                <SelectValue
                                                    className="ring-offset-0 focus:ring-0 round-0 focus-visible:ring-0"
                                                    placeholder={`${field.value}`}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem
                                                value={
                                                    VotingConfiguration.ALLOW_SKIP
                                                }
                                            >
                                                {VotingConfiguration.ALLOW_SKIP}
                                            </SelectItem>
                                            <SelectItem
                                                value={
                                                    VotingConfiguration.ATLEAST_ONE
                                                }
                                            >
                                                {
                                                    VotingConfiguration.ATLEAST_ONE
                                                }
                                            </SelectItem>
                                            <SelectItem
                                                value={
                                                    VotingConfiguration.REQUIRE_ALL
                                                }
                                            >
                                                {
                                                    VotingConfiguration.REQUIRE_ALL
                                                }
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={settingsForm.control}
                        name="voteScreenConfiguration"
                        render={({ field }) => (
                            <FormItem className="flex justify-between items-center">
                                <FormLabel>Voting Screen Orientation</FormLabel>
                                <div className="w-44">
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="border-0 ring-offset-0 focus:ring-0 round-0 focus-visible:ring-0">
                                                <SelectValue
                                                    className="ring-offset-0 focus:ring-0 round-0 focus-visible:ring-0"
                                                    placeholder={`${field.value}`}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem
                                                value={
                                                    VotingScreenOrientation.PORTRAIT
                                                }
                                            >
                                                {
                                                    VotingScreenOrientation.PORTRAIT
                                                }
                                            </SelectItem>
                                            <SelectItem
                                                value={
                                                    VotingScreenOrientation.LANDSCAPE
                                                }
                                            >
                                                {
                                                    VotingScreenOrientation.LANDSCAPE
                                                }
                                            </SelectItem>
                                            <SelectItem
                                                value={
                                                    VotingScreenOrientation.ANY
                                                }
                                            >
                                                {VotingScreenOrientation.ANY}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Separator />

                    <h1 className="font-bold">Others</h1>
                    <FormField
                        control={settingsForm.control}
                        name="sendEmailVoteCopy"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enable Vote Copy Emailing</FormLabel>
                                <div className="flex items-center justify-between w-full pr-5 space-x-2">
                                    <FormLabel className="text-sm text-foreground/60 font-normal">
                                        Enables the system to send vote copy to
                                        members after they vote.
                                    </FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={settingsForm.control}
                        name="allowBirthdayVerification"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Allow Birthday Verification
                                </FormLabel>
                                <div className="flex items-center justify-between w-full pr-5 space-x-2">
                                    <FormLabel className="text-sm text-foreground/60 font-normal">
                                        Add “Birthday” as optional Member
                                        Verification when voting.
                                    </FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />

                    <div className="w-full gap-x-2 flex justify-end px-2">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={!isDirty}
                            onClick={() => settingsForm.reset()}
                            className="rounded-lg"
                        >
                            Reset
                        </Button>
                        <Button
                            disabled={!isDirty}
                            variant={!isDirty ? "secondary" : "default"}
                            className="rounded-lg"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default SettingsForm;
