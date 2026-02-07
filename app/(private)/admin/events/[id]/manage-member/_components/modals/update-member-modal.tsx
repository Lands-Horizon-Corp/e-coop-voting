"use client";
import { z } from "zod";
import { gender } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Input } from "@/components/ui/input";
import ImagePick from "@/components/image-pick";
import { Button } from "@/components/ui/button";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { TMember, TUpdateMember } from "@/types";
import useImagePick from "@/hooks/use-image-pick";
import { updateMember } from "@/hooks/api-hooks/member-api-hook";
import { onUploadImage } from "@/hooks/api-hooks/image-upload-api-hook";
import { updateMemberWithUploadSchema } from "@/validation-schema/member";

type Props = {
  state: boolean;
  member: TMember;
  onCancel?: () => void;
  onClose: (state: boolean) => void;
};
export type createTMember = z.infer<typeof updateMemberWithUploadSchema>;

const UpdateMemberForm = ({
  member,
  onClose,
}: {
  member: TMember;
  onClose: (state: boolean) => void;
}) => {
  const memberForm = useForm<TUpdateMember>({
    resolver: zodResolver(updateMemberWithUploadSchema),
    defaultValues: {
      ...member,
      contact: member.contact === null ? "" : member.contact,
      birthday:
        member.birthday === null
          ? ""
          : new Date(member.birthday).toISOString().split("T")[0],
      middleName: member.middleName === null ? "" : member.middleName,
    },
  });

  const { imageURL, imageFile, onSelectImage, resetPicker } = useImagePick({
    initialImageURL: !member.picture ? "images/default.png" : member.picture,
    maxOptimizedSizeMB: 0.5,
    maxWidthOrHeight: 300,
  });

  const reset = () => {
    memberForm.reset();
  };
  const onCancelandReset = () => {
    reset();
    onClose(false);
  };

  const updateMemberMutation = updateMember({ onCancelandReset });

  const uploadImage = onUploadImage({ withExtName: false });

  const onSubmit = async (formValues: createTMember) => {
    console.log("Saving", formValues);
    try {
      if (!imageFile) {
        updateMemberMutation.mutate({
          member: {
            ...formValues,
            picture: member.picture,
          },
          memberId: member.id,
          eventId: member.eventId,
        });
      } else {
        const image = await uploadImage.mutateAsync({
          fileName: `${formValues.passbookNumber.toUpperCase()}.webp`,
          folderGroup: "member",
          file: formValues.picture,
        });

        updateMemberMutation.mutate({
          member: {
            ...formValues,
            picture: !image ? "/images/default.png" : image,
          },
          memberId: member.id,
          eventId: member.eventId,
        });
      }
      resetPicker();
    } catch (error) {
      console.log(error);
    }
  };

  const isLoading = updateMemberMutation.isPending;
  const isUploading = uploadImage.isPending;

  return (
    <Form {...memberForm}>
      <form onSubmit={memberForm.handleSubmit(onSubmit)} className="">
        <div className="flex w-full space-x-5">
          <div className="w-1/2 space-y-2">
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
              render={({ field: { value, ...field } }) => {
                return (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex justify-between">
                      <h1>Birthday</h1>{" "}
                    </FormLabel>
                    <Input
                      type="date"
                      {...field}
                      value={
                        value instanceof Date
                          ? value.toISOString().split("T")[0]
                          : value
                      }
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
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
                      value={field.value as any}
                      onChange={field.onChange}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-1/2 space-y-2">
            <FormField
              control={memberForm.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as any}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={gender.Male}>{gender.Male}</SelectItem>
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
                onCancelandReset();
              }}
              variant={"secondary"}
              className="bg-muted/60 hover:bg-muted"
            >
              cancel
            </Button>
            <Button disabled={!memberForm.formState.isDirty} type="submit">
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
  );
};

const UpdateMemberModal = ({ member, state, onClose, onCancel }: Props) => {
  return (
    <Dialog
      open={state}
      onOpenChange={(state) => {
        onClose(state);
      }}
    >
      <DialogContent className="border-none shadow-2 sm:rounded-2xl max-w-[1000px] font-inter">
        <ModalHead
          title="update Member"
          description="You are about to update the member information."
        />
        <UpdateMemberForm onClose={onClose} member={member} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMemberModal;
