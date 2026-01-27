"use client";
import z from "zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { TUser } from "@/types";
import { updateUserSchema } from "@/validation-schema/user";
import { branchList } from "@/hooks/api-hooks/branch-api-hooks";
import { updateUser } from "@/hooks/api-hooks/user-api-hooks";
import { Role } from "@prisma/client";
import { user } from "next-auth";
import { canEditRole, getAssignableRoles } from "../role-utils";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

type Props = {
    user: TUser;
    editor: user;
    state: boolean;
    close: () => void;
};

type updateTUser = z.infer<typeof updateUserSchema>;

const UpdateUserModal = ({ state, user, editor, close }: Props) => {
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<updateTUser>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            email: "",
            name: "",
            password: undefined,
            branchId: -1,
        },
    });

    const { data: branches, isLoading: branchLoading } = branchList();

    const setDefaults = useCallback(() => {
        form.setValue("email", user.email);
        form.setValue("name", user.name);
        form.setValue("password", undefined);
        form.setValue("branchId", user.branchId);
        form.setValue("role", user.role);
    }, [form, user]);

    const reset = () => {
        form.reset();
        close();
    };

    useEffect(() => {
        setDefaults();
    }, [user, state, setDefaults]);

    const update = updateUser(user.id, (updatedUser) => {
        reset();
    });

    const isLoading = update.isPending || branchLoading;

    const userRole = user.role;
    const editorRole = editor.role;

    const roleDisabled = editor.id === user.id || !canEditRole(editorRole, userRole) 
    const disableEmailPassword =
        (userRole === "root" || userRole === "admin") &&
        editor.role === "staff" &&
        user.id !== editor.id;

    const assignableRoles = getAssignableRoles(editor);

    return (
        <Dialog open={state} onOpenChange={(state) => reset()}>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <ModalHead
                    title="Update User"
                    description="Update user basic information."
                />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((formValues) =>
                            update.mutate(formValues),
                        )}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Name of user"
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
                            name="email"
                            disabled={disableEmailPassword}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="johndoe@gmail.com"
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
                            name="password"
                            disabled={disableEmailPassword}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ?  "text" : "password" }
                                                placeholder="8 character password"
                                                className="placeholder:text-foreground/40"
                                                {...field}
                                            />
                                            {showPassword ? (
                                                <FaRegEye
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="cursor-pointer size-4 absolute right-3 top-3"
                                                />
                                            ) : (
                                                <FaRegEyeSlash
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="cursor-pointer size-4 absolute right-3 top-3"
                                                />
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role 🛡️</FormLabel>
                                    <Select
                                        disabled={branchLoading || roleDisabled}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            { !roleDisabled ? assignableRoles.map((assignableRole) => (
                                                <SelectItem key={assignableRole.role} value={assignableRole.role}>{assignableRole.role}</SelectItem>
                                            )) :
                                                <SelectItem value={userRole}>{userRole}</SelectItem>
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="branchId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Branch</FormLabel>
                                    <Select
                                        disabled={branchLoading || ( !([Role.root, Role.coop_root] as Role[]).includes(editorRole) )}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a branch" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {branches.map((branch) => (
                                                <SelectItem
                                                    key={branch.id}
                                                    value={branch.id.toString()}
                                                >
                                                    {branch.branchName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Separator className="bg-muted/70" />
                        <span className="text-sm text-destructive">
                            {branches.length === 0 ? "theres no branches available" : ""}
                        </span>
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

export default UpdateUserModal;
