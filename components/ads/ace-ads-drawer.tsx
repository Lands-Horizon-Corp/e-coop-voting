"use client";
import React, { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

import {
    Drawer,
    DrawerTitle,
    DrawerHeader,
    DrawerTrigger,
    DrawerContent,
    DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
    children: ReactNode;
}

const anim: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.4,
            type: "spring",
            duration: 0.4,
        },
    },
};

const AceAdsDrawer = ({ children }: Props) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent className="min-h-[90vh] bg-[#F6FEE6] rounded-t-3xl">
                <DrawerHeader className="hidden">
                    <DrawerTitle>ECoop Ads</DrawerTitle>
                    <DrawerDescription>NOthing here</DrawerDescription>
                </DrawerHeader>
                <div className="w-full relative mt-2">
                    <motion.div
                        variants={anim}
                        initial="initial"
                        animate="visible"
                        className="p-8 font-poppins max-h-[90vh] thin-scroll relative z-0 overflow-x-hidden overflow-y-auto text-neutral-900"
                    >
                        <div className="flex flex-col justify-center gap-y-12 ">
                            <div className="space-y-12 flex flex-col-reverse md:flex-row gap-x-8 gap-y-8 p-2 md:p-8 items-center">
                                <div className="space-y-12 flex-1">
                                    <p className="text-2xl md:text-6xl font-medium">
                                        <img
                                            src="/images/e-coop-logo.webp"
                                            alt="ECoop Logo"
                                            className="size-20 inline mr-2 object-contain"
                                        />
                                        ECoop
                                    </p>
                                    <p className="text-xl md:text-3xl">
                                        Cooperatives are embracing the cloud to
                                        supercharge collaboration, boost
                                        efficiency, and unlock limitless
                                        potential!
                                    </p>
                                    <ol className="space-y-8">
                                        <li className="flex items-center">
                                            <img
                                                src="/assets/cloud.svg"
                                                alt="cloud"
                                                className="size-8 inline mr-3"
                                            />
                                            Cloud integration: Say goodbye to
                                            physical servers, everything runs on
                                            the cloud.
                                        </li>
                                        <li className="flex items-center">
                                            <img
                                                src="/assets/monitor.svg"
                                                alt="monitor"
                                                className="size-8 inline mr-3"
                                            />
                                            24/7 monitoring with monthly
                                            updates: Continuous system checks
                                            and regular feature enhancements.
                                        </li>
                                        <li className="flex items-center">
                                            <img
                                                src="/assets/ai.svg"
                                                alt="ai"
                                                className="size-8 inline mr-3"
                                            />
                                            AI-enabled chatbot: A smart
                                            assistant to support users anytime,
                                            anywhere.
                                        </li>
                                        <li className="flex items-center">
                                            <img
                                                src="/assets/money.svg"
                                                alt="money"
                                                className="size-8 inline mr-3"
                                            />
                                            Seamless online transactions:
                                            Integration with banks and e-wallets
                                            for easy payments.
                                        </li>
                                        <li className="flex items-center">
                                            <img
                                                src="/assets/globe.svg"
                                                alt="globe"
                                                className="size-8 inline mr-3"
                                            />
                                            Available in the Philippines:
                                            Localized services to cater to
                                            Filipino customers and soon can
                                            migrate to different currency.
                                        </li>
                                        <li className="flex items-center">
                                            <img
                                                src="/assets/security.svg"
                                                alt="security"
                                                className="size-8 inline mr-3"
                                            />
                                            Top-tier security and performance:
                                            Robust measures ensuring high
                                            security and optimal performance.
                                        </li>
                                    </ol>
                                </div>
                                <img
                                    src="/images/ecoop-ads.png"
                                    alt="ECoop Screenshot"
                                    className="w-[60%] object-contain"
                                />
                            </div>
                            <div className="p-2 rounded-3xl w-fit mx-auto bg-muted/10">
                                <video
                                    loop
                                    muted
                                    autoPlay
                                    controls
                                    className="rounded-2xl"
                                    src="https://s3.ap-southeast-2.amazonaws.com/horizon.assets/ecoop-ads-mobile.mp4"
                                />
                            </div>
                            <div className="flex flex-col justify-center gap-y-4">
                                <p className="text-3xl mt-1 text-center">
                                    Coming Soon
                                </p>
                                <Button className="rounded-full mt-0 mx-auto bg-neutral-900 text-white">
                                    Join Waitlist 🎉
                                </Button>
                                <p className="text-base font-mono text-center mb-4">
                                    Developed by Lands Horizon
                                </p>
                            </div>
                        </div>
                    </motion.div>
                    <div className="gradient-blur-bar absolute -bottom-4 border-red-400 bg-[#F6FEE6] border w-full h-16 z-50" />
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default AceAdsDrawer;
