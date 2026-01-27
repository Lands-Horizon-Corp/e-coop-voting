"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TCandidatewithPositionwithEventId, TPosition } from "@/types";
import { z } from "zod";
import { useCallback, useEffect } from "react";
import { updateCandidateSchema } from "@/validation-schema/candidate";
import { useUpdateCandidate } from "@/hooks/api-hooks/candidate-api-hooks";
import useImagePick from "@/hooks/use-image-pick";
import ImagePick from "@/components/image-pick";
import { onUploadImage } from "@/hooks/api-hooks/image-upload-api-hook";

type Props = {
  state: boolean;
  onClose: (state: boolean) => void;
  onCancel?: () => void;
  candidate: TCandidatewithPositionwithEventId;
  positions: TPosition[] | undefined;
};

type updateTCandidate = z.infer<typeof updateCandidateSchema>;

const UpdateCandidateModal = ({
  state,
  onClose,
  onCancel,
  candidate,
  positions,
}: Props) => {
  const { imageURL, imageFile, onSelectImage, resetPicker } = useImagePick({
    initialImageURL: !candidate.picture
      ? "/images/default.png"
      : candidate.picture,
    maxOptimizedSizeMB: 0.5,
    maxWidthOrHeight: 300,
  });

  const candidateForm = useForm<updateTCandidate>({
    resolver: zodResolver(updateCandidateSchema),
  });

  const defaultValues = useCallback(() => {
    candidateForm.setValue("firstName", candidate.firstName);
    candidateForm.setValue("lastName", candidate.lastName);
    candidateForm.setValue("passbookNumber", candidate.passbookNumber);
    candidateForm.setValue("picture", candidate.picture as unknown as File);
    candidateForm.setValue("positionId", candidate.positionId);
    candidateForm.setValue("electionId", candidate.electionId);
  }, [candidateForm, candidate]);

  useEffect(() => {
    defaultValues();
  }, [candidateForm, candidate]);

  const onCancelandReset = () => {
    onClose(false);
    candidateForm.reset();
    resetPicker();
  };
  const params = {
    id: candidate.eventId,
    electionId: candidate.electionId,
    candidateId: candidate.id,
  };
  const updateCandidate = useUpdateCandidate({ onCancelandReset }, { params });
  const isLoading = updateCandidate.isPending;
  const uploadImage = onUploadImage();

  const isCandidateOnChange =
    candidateForm.watch().firstName === candidate.firstName &&
    candidateForm.watch().lastName === candidate.lastName &&
    Number(candidateForm.watch().positionId) === candidate.positionId &&
    candidateForm.watch().picture?.name ===
      (candidate.picture as unknown as File)?.name;

  const onSubmit = async (formValues: updateTCandidate) => {
    try {
      if (!imageFile) {
        updateCandidate.mutate({
          ...formValues,
          picture: candidateForm.getValues("picture"),
        });
      } else {
        const image = await uploadImage.mutateAsync({
          fileName: `${formValues.passbookNumber}`,
          folderGroup: "election-candidates",
          file: formValues.picture as File,
        });
        updateCandidate.mutate({
          ...formValues,
          picture: !image ? "/images/default.png" : image,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={state}
      onOpenChange={() => {
        onCancelandReset();
      }}
    >
      <DialogContent className="border-none shadow-2 sm:rounded-2xl max-w-[600px] font-inter">
        <ModalHead
          title="Update Candidate"
          description="You are about to update a candidate. When updating the candidate, you no longer need to update the passbook number."
        />
        <Form {...candidateForm}>
          <form
            onSubmit={candidateForm.handleSubmit(onSubmit)}
            className=" space-y-3"
          >
            <FormField
              control={candidateForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter candidate name"
                      className="placeholder:text-foreground/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={candidateForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter candidate last name"
                      className="placeholder:text-foreground/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={candidateForm.control}
              name="positionId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Position </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {positions?.map((position) => {
                          return (
                            <SelectItem
                              key={position.id}
                              value={position.id.toString()}
                            >
                              {position.positionName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={candidateForm.control}
              name="picture"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Profile</FormLabel>
                    <FormControl>
                      <ImagePick
                        className="flex flex-col items-center gap-y-4"
                        url={imageURL}
                        onChange={async (e) => {
                          field.onChange(await onSelectImage(e));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex justify-end gap-x-2">
              <Button
                disabled={isLoading}
                onClick={(e) => {
                  onCancelandReset();
                  e.preventDefault();
                }}
                variant={"secondary"}
                className="bg-muted/60 hover:bg-muted"
              >
                cancel
              </Button>
              <Button disabled={isCandidateOnChange} type="submit">
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1} />
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

export default UpdateCandidateModal;
