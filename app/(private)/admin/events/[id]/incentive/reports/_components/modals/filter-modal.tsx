import React from "react";

import { FaCheck } from "react-icons/fa";
import { AiOutlineUser, AiOutlineUsergroupAdd } from "react-icons/ai";

import UserAvatar from "@/components/user-avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import LoadingSpinner from "@/components/loading-spinner";

import { eventBasedUserList } from "@/hooks/api-hooks/user-api-hooks";

type Props = {
    state: boolean;
    eventId: number;
    onClose: (state: boolean) => void;

    selectedIds: number[];
    setIds: (ids: number[]) => void;
};

const FilterModal = ({ state, onClose, eventId, selectedIds, setIds }: Props) => {
    const { data, isLoading } = eventBasedUserList(eventId);

    return (
        <Dialog open={state} onOpenChange={(state) => onClose(state)}>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl p-2 font-inter">
                <Command loop={true} className="rounded-lg bg-transparent p-0 shadow-md">
                    <CommandInput placeholder="Filter report..." />
                    <CommandList className="thin-scroll">
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Quick Filter">
                            <CommandItem
                                className="flex p-3 hover:bg-secondary/20 rounded-lg justify-between cursor-pointer"
                                onSelect={() => {
                                    setIds([]);
                                    onClose(false);
                                }}
                            >
                                <div className="flex gap-x-2">
                                    <AiOutlineUser className="size-5" />
                                    <span>Yours</span>
                                </div>
                                {selectedIds.length === 0 && (
                                    <FaCheck className="text-primary size-4" />
                                )}
                            </CommandItem>
                            <CommandItem
                                className="flex hover:bg-secondary/20 p-3 rounded-lg justify-between cursor-pointer"
                                disabled={data.length === 0}
                                onSelect={() => {
                                    setIds(data.map((user) => user.id));
                                    onClose(false);
                                }}
                            >
                                <div className="flex gap-x-2">
                                    <AiOutlineUsergroupAdd className="size-5" />
                                    <span>All Users</span>
                                </div>
                                {selectedIds.length === data.length && data.length !== 0 && (
                                    <FaCheck className="text-primary size-4" />
                                )}
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="User List">
                            {isLoading && <LoadingSpinner className="my-4 mx-auto text-foreground/40" /> }
                            {!isLoading && data.map((user) => {
                                const selected = selectedIds.includes(user.id);

                                const handleSelectUser = (id: number) => {
                                    if (selected) setIds(selectedIds.filter((eId) => eId !== id));
                                    else setIds([...selectedIds, id]);
                                };

                                return (
                                    <CommandItem
                                        key={user.id}
                                        onSelect={() => handleSelectUser(user.id)}
                                        className="rounded-lg hover:bg-secondary/20 p-3 cursor-pointer flex justify-between"
                                    >
                                        <div className="flex gap-x-2">
                                            {/** <AiOutlineUser className="mr-2 h-4 w-4" /> **/}
                                            <UserAvatar className="size-4" src={user.picture as ""} fallback={`${user.name.substring(0,2)}`} />
                                            <span>{user.name}</span>
                                        </div>

                                        {selected && (
                                            <FaCheck className="text-primary size-4" />
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
};

export default FilterModal;
