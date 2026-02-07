"use client";
import { z } from "zod";
import React from "react";
import { gender } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImagePick from "@/components/image-pick";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import useImagePick from "@/hooks/use-image-pick";
import { createMember } from "@/hooks/api-hooks/member-api-hook";
import { onUploadImage } from "@/hooks/api-hooks/image-upload-api-hook";
import { createMemberWithUploadSchema } from "@/validation-schema/member";
import { BirthdayInput } from "@/components/ui/birthday-input";

type Props = {
  state: boolean;
  onClose: (state: boolean) => void;
  onCancel?: () => void;
  eventId: number;
};
export type createTMember = z.infer<typeof createMemberWithUploadSchema>;

const CreateMemberModal = ({ eventId, state, onClose, onCancel }: Props) => {
  const { imageURL, imageFile, onSelectImage, resetPicker } = useImagePick({
    initialImageURL: "/images/default.png",
    maxOptimizedSizeMB: 1,
    maxWidthOrHeight: 800,
  });

  const defaultValues = {
    passbookNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: gender.Male,
    birthday: "",
    contact: "",
    emailAddress: "",
    picture: imageFile,
    voteOtp: "",
    eventId: eventId,
  };

  const memberForm = useForm<createTMember>({
    resolver: zodResolver(createMemberWithUploadSchema),
    defaultValues: defaultValues,
  });

  const reset = () => {
    memberForm.reset();
  };

  const onCancelandReset = () => {
    reset();
    onClose(false);
  };

  const createMemberMutation = createMember({ onCancelandReset });

  const uploadImage = onUploadImage({ withExtName: false });

  const onSubmit = async (formValues: createTMember) => {
    try {
      if (!imageFile) {
        createMemberMutation.mutate({
          member: {
            ...formValues,
            picture: formValues.passbookNumber ?? "/images/default.png",
          },
          eventId,
        });
      } else {
        const image = await uploadImage.mutateAsync({
          fileName: `${formValues.passbookNumber.toUpperCase()}.webp`,
          folderGroup: "member",
          file: formValues.picture,
        });
        createMemberMutation.mutate({
          member: {
            ...formValues,
            picture: !image ? "/images/default.png" : image,
          },
          eventId,
        });
      }
      resetPicker();
    } catch (error) {
      console.log(error);
    }
  };
  const isLoading = createMemberMutation.isPending;
  const isUploading = uploadImage.isPending;

  return (
    <Dialog
      open={state}
      onOpenChange={(state) => {
        onClose(state);
        reset();
      }}
    >
      <DialogContent className="border-none shadow-2 sm:rounded-2xl max-h-screen overflow-y-auto md:max-w-[700px] lg:max-w-[1000px] font-inter">
        <ModalHead
          title="Create Member"
          description="Creating a member that is exclusive to being either a partial or full member of the Coop."
        />
        <Form {...memberForm}>
          <form onSubmit={memberForm.handleSubmit(onSubmit)} className="">
            <div className="flex  w-full flex-col lg:flex-row lg:space-x-5">
              <div className="w-full  space-y-2">
                <FormField
                  control={memberForm.control}
                  name="passbookNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passbook Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="enter pass book"
                          className="placeholder:text-foreground/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="enter first name"
                          className="placeholder:text-foreground/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberForm.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Middle Name"
                          className="placeholder:text-foreground/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Last Name"
                          className="placeholder:text-foreground/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberForm.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Birthday{" "}
                        <span className="opacity-50 text-xs">(mm/dd/yyyy)</span>
                      </FormLabel>
                      <FormControl>
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberForm.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Contact</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="enter contact"
                          className="placeholder:text-foreground/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberForm.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            placeholder="enter email address"
                            className="placeholder:text-foreground/40"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value !== "" ? value : null);
                            }}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full space-y-2">
                <FormField
                  control={memberForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={gender.Male}>
                            {gender.Male}
                          </SelectItem>
                          <SelectItem value={gender.Female}>
                            {gender.Female}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={memberForm.control}
                  name="picture"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Profile</FormLabel>
                        <FormControl>
                          <>
                            <ImagePick
                              className="flex flex-col items-center gap-y-4"
                              url={imageURL}
                              onChange={async (e) => {
                                field.onChange(await onSelectImage(e));
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
            <div>
              <div className="flex justify-end gap-x-2">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    reset();
                    resetPicker();
                  }}
                  variant={"ghost"}
                  className="bg-muted/60 hover:bg-muted"
                >
                  clear
                </Button>
                <Button
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
                    <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1} />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMemberModal;
