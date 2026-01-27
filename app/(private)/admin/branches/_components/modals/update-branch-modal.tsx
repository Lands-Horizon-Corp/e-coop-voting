"use client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

import { useCallback, useEffect } from "react";
import { TBranch } from "@/types";
import { createBranchSchema } from "@/validation-schema/branch";
import { updateBranch } from "@/hooks/api-hooks/branch-api-hooks";
import { useCoopList } from "@/hooks/api-hooks/coop-api-hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  branch: TBranch;
  state: boolean;
  close: () => void;
};

type TUpdateBranch = z.infer<typeof createBranchSchema>;

const UpdateBranchModal = ({ state, branch, close }: Props) => {
  const { coopList, isLoading: isLoadingCoopList } = useCoopList();
  const form = useForm<TUpdateBranch>({
    resolver: zodResolver(createBranchSchema),
  });

  const setDefaults = useCallback(() => {
    form.setValue("branchName", branch.branchName);
    form.setValue("branchAddress", branch.branchAddress);
    form.setValue("branchDescription", branch.branchDescription);
    form.setValue(
      "branchPicture",
      branch.branchPicture ?? "/images/default.png",
    );
    form.setValue("coopId", branch.coopId)
  }, [form, branch]);

  const reset = () => {
    form.reset();
    close();
  };

  useEffect(() => {
    setDefaults();
  }, [branch, state, setDefaults]);

  const { isPending, mutate } = updateBranch({
    branchId: branch.id,
    onUpdate: () => {
      close();
    },
  });

  const isLoading = isPending || isLoadingCoopList

  return (
    <Dialog open={state} onOpenChange={reset}>
      <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
        <ModalHead
          title="Update Branch"
          description="Modify branch information"
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((formValues) => mutate(formValues))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="branchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="branch name"
                      className="placeholder:text-foreground/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branchDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="short description of the branch"
                      className="placeholder:text-foreground/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branchAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="address of the branch"
                      className="placeholder:text-foreground/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coopId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cooperative</FormLabel>
                  <Select
                    disabled={isLoadingCoopList}
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Cooperative" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {coopList.map((coop) => (
                        <SelectItem key={coop.id} value={coop.id.toString()}>
                          {coop.coopName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="bg-muted/70" />
            <div className="flex justify-end gap-x-2">
              <Button
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  reset();
                }}
                variant={"ghost"}
                className="bg-muted/60 hover:bg-muted"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
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

export default UpdateBranchModal;
