"use client";
import React, { useEffect } from "react";
import { signOut } from "next-auth/react";
import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
type Props = {  };

const LogOut = ({  }: Props) => {
    const { onOpen } = useConfirmModal();

    useEffect(() => {
        window.addEventListener("keydown", (event) => {
            if (
                (event.ctrlKey && event.key === "q") ||
                (event.altKey && event.key === "q") ||
                (event.metaKey && event.key === "q")
            ) {
                event.preventDefault();
                onOpen({
                    title: "Sign Out",
                    description: "You are about to sign out, Are you sure?",
                    onConfirm: () => signOut(),
                });
            }
        });
    }, []);

    return (
        <DropdownMenuItem
            onClick={() =>
                onOpen({
                    title: "Sign Out",
                    description: "You are about to sign out, Are you sure?",
                    onConfirm: () => signOut(),
                })
            }
        >
            <p className="font-medium">Log Out</p>
            <DropdownMenuShortcut>
                ⇧⌘Q
            </DropdownMenuShortcut>
        </DropdownMenuItem>
    );
};

export default LogOut;
