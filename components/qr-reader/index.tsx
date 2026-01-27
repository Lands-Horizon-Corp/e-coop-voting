"use client";
import React, { useState } from "react";

import { Camera } from "lucide-react";

import {
    outline,
    Scanner,
    useDevices,
    IScannerProps,
} from "@yudiel/react-qr-scanner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface Props extends IScannerProps {}

const QrReader = (props: Props) => {
    const [deviceId, setDeviceId] = useState<string | undefined>(undefined);

    const devices = useDevices();

    return (
        <div className={cn("relative", props.classNames?.container)}>
            <Scanner
                {...props}
                constraints={{
                    deviceId,
                }}
                components={{
                    tracker: outline,
                }}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="icon"
                        variant="outline"
                        className="absolute z-10 bg-secondary/80 bottom-2 size-fit p-1 left-2"
                    >
                        <Camera className="stroke-1 size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Choose Camera Devices</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                        value={deviceId}
                        onValueChange={setDeviceId}
                    >
                        {devices.map((dev) => (
                            <DropdownMenuRadioItem
                                key={dev.deviceId}
                                value={dev.deviceId}
                            >
                                {dev.label}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default QrReader;
