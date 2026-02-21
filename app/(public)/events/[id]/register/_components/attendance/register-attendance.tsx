import z from "zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ErrorAlert from "@/components/error-alert/error-alert";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { TEvent, TMemberAttendeesMinimalInfo } from "@/types";
import { useRegisterMember } from "@/hooks/public-api-hooks/use-member-api";
import { attendeeRegisterFormSchema } from "@/validation-schema/event-registration-voting";
import { Input } from "@/components/ui/input";
import { BirthdayInput } from "@/components/ui/birthday-input";

type Props = {
  event: TEvent;
  member: TMemberAttendeesMinimalInfo;
  onUnselect?: () => void;
};

const RegisterAttendance = ({ event, member, onUnselect }: Props) => {
  const router = useRouter();

  const { registeredMember, isPending, register, isError, error } =
    useRegisterMember(event.id, (member) => {
      router.push(
        `/events/${event.id}/register/registered?pb=${member.passbookNumber}&fullname=${`${member.firstName} ${member.lastName}`}&picture=${member.picture}`,
      );
    });

  const form = useForm<z.infer<typeof attendeeRegisterFormSchema>>({
    resolver: zodResolver(attendeeRegisterFormSchema),
    defaultValues: {
      passbookNumber: member.passbookNumber,
      birthday: undefined,
    },
  });

  useEffect(() => {
    form.setFocus("birthday");
  }, [form, form.setFocus]);

  const disabled = isPending || registeredMember;

  return (
    <div className="flex flex-col w-full items-center gap-y-4">
      <div className="space-y-4 w-full max-w-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((pb) => register(pb))}
            className="space-y-4 w-full px-2"
          >
            {event.requireBirthdayVerification && (
              <>
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex justify-between">
                        <h1>Birthday</h1>{" "}
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
                <p className="text-sm lg:text-base text-center text-foreground/60">
                  Please input your birth date for verification
                </p>
              </>
            )}
            {isError && error && (
              <ErrorAlert
                className="w-full"
                title="Registration Error"
                message={error}
              />
            )}
            <Button disabled={disabled} className="w-full">
              {isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1} />
              ) : (
                "Register"
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

export default RegisterAttendance;
