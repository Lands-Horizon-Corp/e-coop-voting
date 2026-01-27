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
        <div className="flex flex-col gap-y-2 items-center justify-center min-h-screen">
            <p>{error.message}</p>
            <Button onClick={() => reset()}>Try again</Button>
        </div>
    );
}
