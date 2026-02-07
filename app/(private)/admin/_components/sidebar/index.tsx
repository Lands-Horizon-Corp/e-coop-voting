import { ModeToggle } from "@/components/theme/mode-toggle";
import SideBarRoute from "./sidebar-route";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogOut from "./log-out";
import AceAdsDrawer from "@/components/ads/ace-ads-drawer";
import { Button } from "@/components/ui/button";

type Props = {};

const SideBar = async (props: Props) => {
  const user = await currentUserOrThrowAuthError();

  return (
    <div className="w-60 border h-screen py-5 overflow-clip shadow-md dark:bg-background flex flex-col gap-y-8 items-center">
      <Link
        href="/"
        className="hidden lg:flex text-[min(20px,3.5vw)] font-bold items-center"
      >
        <h1>
          <span className="">e</span>Coop ACE System
        </h1>
      </Link>
      <div className=" flex flex-col space-y-4 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-16">
              <AvatarImage src={user.picture as string} alt="@shadcn" />
              <AvatarFallback>{user.name.substring(0, 1)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <LogOut></LogOut>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <h1 className=" text-[min(14px,2.9vw)] font-bold">{user.name}</h1>
        <ModeToggle />
      </div>
      <ScrollArea className="flex-1 px-4 w-full text-left">
        <SideBarRoute currentUser={user} />
      </ScrollArea>
      <AceAdsDrawer>
        <Button className="text-center absolute bottom-0 bg-secondary underline underline-offset-8 text-sm gap-x-2 font-normal rounded-none w-full text-foreground py-4">
          <img
            src="/images/ecoop-ads.png"
            alt="ECoop Screenshot"
            className="size-8 object-contain inline"
          />
          eCOOP Suite CLOUD
        </Button>
      </AceAdsDrawer>
    </div>
  );
};

export default SideBar;
