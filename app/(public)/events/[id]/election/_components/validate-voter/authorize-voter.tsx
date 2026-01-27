import z from "zod";
import { useEffect, useState } from "react";
import { OTPInput } from "input-otp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

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
import { Input } from "@/components/ui/input";

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
    const [isBirthdayVerification, setIsBirthdayVerification] = useState(false);

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
            onAuthorize
        );

    useEffect(() => {
        form.setFocus("otp");
    }, [form, form.setFocus]);

    const onSubmit = (values: TForm) => {
        getAuthorization(values);
    };
    const disabled = isPending || authenticatedVoter !== undefined;

    return (
        <div className="flex flex-col items-center gap-y-4">
            <p className="text-sm lg:text-base text-center text-foreground/60 pb-4">
                This step is for verification before we authorize you to vote
            </p>
            <div className="space-y-4 max-w-sm">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {!isBirthdayVerification ? (
                            <FormField
                                control={form.control}
                                name="otp"
                                key="otp"
                                render={({ field }) => (
                                    <FormItem className="gap-y-2">
                                        <p className="text-lg text-center ">
                                            OTP
                                        </p>
                                        <FormControl>
                                            <OTPInput
                                                {...field}
                                                autoFocus
                                                maxLength={6}
                                                disabled={disabled}
                                                onComplete={() => {
                                                    if (
                                                        !electionWithEvent.allowBirthdayVerification
                                                    )
                                                        onSubmit({
                                                            passbookNumber:
                                                                voter.passbookNumber,
                                                            otp: form.getValues(
                                                                "otp"
                                                            ),
                                                        });
                                                }}
                                                inputMode="text"
                                                pattern="^[a-zA-Z0-9]+$"
                                                containerClassName="group flex items-center has-[:disabled]:opacity-30"
                                                render={({ slots }) => (
                                                    <>
                                                        <div className="flex">
                                                            {slots
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        slot,
                                                                        idx
                                                                    ) => (
                                                                        <OtpSlot
                                                                            key={
                                                                                idx
                                                                            }
                                                                            {...slot}
                                                                        />
                                                                    )
                                                                )}
                                                        </div>
                                                        <div className="w-5 mx-2 h-2 bg-secondary rounded-full" />
                                                        <div className="flex">
                                                            {slots
                                                                .slice(3)
                                                                .map(
                                                                    (
                                                                        slot,
                                                                        idx
                                                                    ) => (
                                                                        <OtpSlot
                                                                            key={
                                                                                idx
                                                                            }
                                                                            {...slot}
                                                                        />
                                                                    )
                                                                )}
                                                        </div>
                                                    </>
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            electionWithEvent.allowBirthdayVerification && (
                                <FormField
                                    control={form.control}
                                    name="birthday"
                                    key="birthday"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="flex justify-between">
                                                <h1>Birthday</h1>{" "}
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
                            )
                        )}
                        {electionWithEvent.allowBirthdayVerification && (
                            <>
                                <div className="flex  items-center gap-x-2">
                                    <Separator className="w-fit flex-grow" />
                                    <div>or</div>
                                    <Separator className="w-fit flex-grow" />
                                </div>
                                {!isBirthdayVerification ? (
                                    <Button
                                        variant={"outline"}
                                        className="w-full"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsBirthdayVerification(
                                                !isBirthdayVerification
                                            );
                                        }}
                                    >
                                        Birthday Verification
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        className="w-full"
                                        variant={"outline"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsBirthdayVerification(
                                                !isBirthdayVerification
                                            );
                                        }}
                                    >
                                        OPT Verification
                                    </Button>
                                )}
                            </>
                        )}
                        {isError && error && (
                            <ErrorAlert
                                title="Voter Check Error"
                                message={error}
                            />
                        )}
                        <Button
                            disabled={disabled}
                            className="w-full"
                            type="submit"
                        >
                            {isPending || authenticatedVoter !== undefined ? (
                                <Loader2
                                    className="h-3 w-3 animate-spin"
                                    strokeWidth={1}
                                />
                            ) : (
                                "Vote"
                            )}
                        </Button>
                        {onUnselect && (
                            <p
                                onClick={onUnselect}
                                className="cursor-pointer text-xs underline-offset-8 font-normal hover:underline text-center text-muted-foreground hover:text-foreground duration-300 ease-out"
                            >
                                Not you? Search member again
                            </p>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default AuthorizeVoter;
