"use client";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col gap-y-2 items-center justify-center h-dvh">
            <h2>{error.message}</h2>
            <Button onClick={() => reset()}>Try again</Button>
        </div>
    );
}
