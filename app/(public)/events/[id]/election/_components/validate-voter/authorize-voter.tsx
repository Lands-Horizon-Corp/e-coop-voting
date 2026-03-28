import z from "zod";
import { useEffect, useState } from "react";
import { OTPInput, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Fingerprint, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import OtpSlot from "@/components/otp-input/otp-slot";
import ErrorAlert from "@/components/error-alert/error-alert";
import { voterVerificationFormSchema } from "@/validation-schema/event-registration-voting";
import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { TElectionWithEvent, TMemberAttendeesMinimalInfo } from "@/types";
import { useVoterAuthorization } from "@/hooks/public-api-hooks/use-vote-api";
import { Separator } from "@/components/ui/separator";
import { BirthdayInput } from "@/components/ui/birthday-input";

type Props = {
    voter: TMemberAttendeesMinimalInfo;
    electionWithEvent: TElectionWithEvent;
    onUnselect?: () => void;
    onAuthorize: (voter: TMemberAttendeesMinimalInfo) => void;
};

const AuthorizeVoter = ({
    voter,
    electionWithEvent,
    onUnselect,
    onAuthorize,
}: Props) => {
    // 1. Prioritize Birthday View:
    // If Birthday verification is allowed, we start with it (true).
    // We only start with OTP view if Birthday is disabled and OTP is enabled.
    const [isBirthdayView, setIsBirthdayView] = useState(
        electionWithEvent.allowBirthdayVerification,
    );

    type TForm = z.infer<typeof voterVerificationFormSchema>;

    const form = useForm<TForm>({
        resolver: zodResolver(voterVerificationFormSchema),
        defaultValues: {
            passbookNumber: voter.passbookNumber,
            birthday: undefined,
            otp: "",
        },
    });

    const { authenticatedVoter, getAuthorization, isPending, isError, error } =
        useVoterAuthorization(
            electionWithEvent.eventId,
            electionWithEvent.id,
            voter.id,
            onAuthorize,
        );

    // Focus management: Priority to Birthday Input or OTP if toggled
    useEffect(() => {
        if (!isBirthdayView && electionWithEvent.allowOTPVerification) {
            form.setFocus("otp");
        }
    }, [isBirthdayView, electionWithEvent.allowOTPVerification, form]);

    const onSubmit = (values: TForm) => {
        getAuthorization(values);
    };

    const isLoading = isPending || authenticatedVoter !== undefined;

    // Logical flags for clean JSX
    const canToggle =
        electionWithEvent.allowOTPVerification &&
        electionWithEvent.allowBirthdayVerification;
    const noVerificationRequired =
        !electionWithEvent.allowOTPVerification &&
        !electionWithEvent.allowBirthdayVerification;

    return (
        <div className="flex flex-col items-center gap-y-4 w-full max-w-sm mx-auto">
            <div className="text-center space-y-1">
                <h2 className="text-xl font-semibold tracking-tight">
                    Identity Verification
                </h2>
                <p className="text-sm text-muted-foreground">
                    Please verify your details to proceed with voting.
                </p>
            </div>

            <div className="w-full mt-2">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* --- BIRTHDAY VERIFICATION VIEW (Prioritized) --- */}
                        {isBirthdayView &&
                            electionWithEvent.allowBirthdayVerification && (
                                <FormField
                                    control={form.control}
                                    name="birthday"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="flex items-center gap-x-2">
                                                <CalendarDays className="h-4 w-4 text-primary" />
                                                Confirm Birthdate
                                            </FormLabel>
                                            <FormControl>
                                                <BirthdayInput
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="h-12 text-lg"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                        {/* --- OTP VERIFICATION VIEW (Secondary) --- */}
                        {!isBirthdayView &&
                            electionWithEvent.allowOTPVerification && (
                                <FormField
                                    control={form.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center gap-y-3">
                                            <div className="flex items-center gap-x-2 text-primary">
                                                <Fingerprint className="h-5 w-5" />
                                                <span className="font-medium">
                                                    Enter 6-Digit OTP
                                                </span>
                                            </div>
                                            <FormControl>
                                                <OTPInput
                                                    {...field}
                                                    maxLength={6}
                                                    type="text"
                                                    pattern={
                                                        REGEXP_ONLY_DIGITS_AND_CHARS
                                                    }
                                                    disabled={isLoading}
                                                    onComplete={() =>
                                                        form.handleSubmit(
                                                            onSubmit,
                                                        )()
                                                    }
                                                    render={({ slots }) => (
                                                        <div className="flex items-center gap-x-2">
                                                            <div className="flex">
                                                                {slots
                                                                    .slice(0, 3)
                                                                    .map(
                                                                        (
                                                                            slot,
                                                                            idx,
                                                                        ) => (
                                                                            <OtpSlot
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                {...slot}
                                                                            />
                                                                        ),
                                                                    )}
                                                            </div>
                                                            <div className="w-2 h-1 bg-muted rounded-full" />
                                                            <div className="flex">
                                                                {slots
                                                                    .slice(3)
                                                                    .map(
                                                                        (
                                                                            slot,
                                                                            idx,
                                                                        ) => (
                                                                            <OtpSlot
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                {...slot}
                                                                            />
                                                                        ),
                                                                    )}
                                                            </div>
                                                        </div>
                                                    )}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                        {/* --- TOGGLE BUTTON --- */}
                        {canToggle && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-x-2">
                                    <Separator className="flex-1" />
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                        OR
                                    </span>
                                    <Separator className="flex-1" />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-xs text-primary hover:bg-primary/5"
                                    onClick={() =>
                                        setIsBirthdayView(!isBirthdayView)
                                    }
                                >
                                    Use{" "}
                                    {isBirthdayView ? "OTP Code" : "Birthday"}{" "}
                                    instead
                                </Button>
                            </div>
                        )}

                        {/* --- BYPASS MESSAGE --- */}
                        {noVerificationRequired && (
                            <div className="p-4 rounded-lg bg-secondary/50 border border-dashed text-center">
                                <p className="text-sm text-muted-foreground">
                                    No extra verification required. Press the
                                    button below to start voting.
                                </p>
                            </div>
                        )}

                        {isError && error && (
                            <ErrorAlert
                                title="Verification Failed"
                                message={error}
                            />
                        )}

                        <Button
                            disabled={isLoading}
                            className="w-full h-12 shadow-lg shadow-primary/20"
                            type="submit"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Verify & Open Ballot"
                            )}
                        </Button>

                        {onUnselect && (
                            <button
                                type="button"
                                onClick={onUnselect}
                                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Not <strong>{voter.firstName}</strong>? Search
                                again
                            </button>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default AuthorizeVoter;
