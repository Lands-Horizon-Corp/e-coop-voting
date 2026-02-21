import z from "zod";
import { OTPInput } from "input-otp";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Fingerprint, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import MemberSearch from "@/components/member-search";
import OtpSlot from "@/components/otp-input/otp-slot";
import ErrorAlert from "@/components/error-alert/error-alert";
import { BirthdayInput } from "@/components/ui/birthday-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  createPublicClaimAuthorizationFormSchema,
  createPublicClaimAuthorizationSchema,
} from "@/validation-schema/incentive";
import { useCreateClaimAuth } from "@/hooks/public-api-hooks/use-claim-api";
import { TMemberAttendeesMinimalInfo } from "@/types";
import { useEvent } from "@/hooks/public-api-hooks/use-events-api";

type Props = { eventId: number };
type TClaimValidateForm = z.infer<typeof createPublicClaimAuthorizationSchema>;

const ValidateClaim = ({ eventId }: Props) => {
  const [member, setMember] = useState<TMemberAttendeesMinimalInfo | null>(
    null,
  );
  const { event } = useEvent(eventId, 5 * 1000);

  // State to manage which verification method is currently shown
  const [authMethod, setAuthMethod] = useState<"birthday" | "otp">("otp");

  const form = useForm<TClaimValidateForm>({
    resolver: zodResolver(createPublicClaimAuthorizationFormSchema),
    defaultValues: {
      otp: "",
      birthday: undefined,
    },
  });

  const { authorize, isPending, isError, error } = useCreateClaimAuth(eventId);

  // Default to Birthday if the event requires it, otherwise OTP
  useEffect(() => {
    if (member && event?.requireBirthdayVerification) {
      setAuthMethod("birthday");
    } else {
      setAuthMethod("otp");
    }
  }, [member, event]);

  if (!member)
    return <MemberSearch eventId={eventId} onFound={(m) => setMember(m)} />;

  return (
    <div className="flex flex-col items-center gap-y-4 w-full max-w-md mx-auto">
      {/* Member Identity Header */}
      <div className="flex px-3 py-3 items-center w-full gap-x-3 rounded-2xl bg-secondary/50 border border-border/50">
        <UserAvatar
          src={member.picture as ""}
          fallback={`${member.firstName[0]}${member.lastName[0]}`}
          className="size-12"
        />
        <div className="flex-1">
          <p className="font-semibold leading-none">{`${member.firstName} ${member.lastName}`}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Passbook: {member.passbookNumber}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-8"
          onClick={() => {
            form.reset();
            setMember(null);
          }}
        >
          Change
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((vals) =>
            authorize({ ...vals, passbookNumber: member.passbookNumber }),
          )}
          className="w-full space-y-6"
        >
          <div className="space-y-6">
            {authMethod === "birthday" ? (
              /* BIRTHDAY INPUT VIEW */
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-center text-lg font-medium">
                        Verify Birthday
                      </FormLabel>
                      <BirthdayInput
                        value={
                          field.value instanceof Date
                            ? field.value
                            : field.value
                              ? new Date(field.value)
                              : undefined
                        }
                        onChange={(date) => {
                          field.onChange(date);
                        }}
                        placeholder="MM/DD/YYYY or select date"
                        className="text-xl py-4 px-4"
                        buttonClassName="h-12 w-12"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              /* OTP INPUT VIEW */
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormLabel className="text-lg font-medium">
                        Enter OTP
                      </FormLabel>
                      <FormControl>
                        <OTPInput
                          {...field}
                          autoFocus
                          maxLength={6}
                          render={({ slots }) => (
                            <div className="flex gap-2 items-center">
                              {slots.slice(0, 3).map((s, i) => (
                                <OtpSlot key={i} {...s} />
                              ))}
                              <div className="w-2 h-1 bg-muted rounded" />
                              {slots.slice(3).map((s, i) => (
                                <OtpSlot key={i} {...s} />
                              ))}
                            </div>
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {isError && error && (
              <ErrorAlert title="Verification Failed" message={error} />
            )}

            <Button
              disabled={isPending}
              className="w-full h-12 text-base font-semibold"
              type="submit"
            >
              {isPending ? (
                <Loader2 className="animate-spin size-5" strokeWidth={2} />
              ) : (
                "Authorize Claim"
              )}
            </Button>
          </div>

          {/* TOGGLE BUTTON: Only show if event allows birthday verification */}
          {event?.requireBirthdayVerification && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => {
                  setAuthMethod(authMethod === "birthday" ? "otp" : "birthday");
                  // Clear the other field's value when switching
                  authMethod === "birthday"
                    ? form.setValue("birthday", undefined)
                    : form.setValue("otp", "");
                }}
              >
                {authMethod === "birthday" ? (
                  <span className="flex items-center gap-2">
                    <Fingerprint className="size-4" /> Use OTP instead
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CalendarDays className="size-4" /> Use Birthday instead
                  </span>
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ValidateClaim;
