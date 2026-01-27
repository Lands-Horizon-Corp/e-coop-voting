export const dynamic = "force-dynamic";
import React from "react";

import { hasRoot } from "@/services/user";
import { Button } from "@/components/ui/button";
import LoginForm from "./_components/login-form";
import AceAdsDrawer from "@/components/ads/ace-ads-drawer";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { INIT_ROOT_ACCOUNT } from "@/services/initialize-default";

type Props = {
    searchParams?: Record<"callbackUrl" | "error", string>;
};

const LoginPage = async ({ searchParams }: Props) => {
    const doesRootExist = await hasRoot();
    if (!doesRootExist) await INIT_ROOT_ACCOUNT();

    return (
        <div className="min-h-screen flex items-center justify-center relative">
            <ModeToggle className="absolute top-5 right-5 shadow-sm shadow-foreground/20" />
            <div className="max-w-md w-full">
                <LoginForm callbackUrl={searchParams?.callbackUrl} />
            </div>
            <AceAdsDrawer>
                <Button className="text-center absolute bottom-0 bg-secondary underline underline-offset-8 text-sm gap-x-2 font-normal rounded-none w-full text-foreground py-4">
                    <img
                        src="/images/ecoop-ads.png"
                        alt="ECoop Screenshot"
                        className="size-8 object-contain inline"
                    />
                    New Ecoop (Cloud Based) is comming soon! 🎉
                </Button>
            </AceAdsDrawer>
        </div>
    );
};

export default LoginPage;
