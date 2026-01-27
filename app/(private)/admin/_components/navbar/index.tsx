import { ModeToggle } from "@/components/theme/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { currentUserOrThrowAuthError } from "@/lib/auth";
import Link from "next/link";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import SideBarRoute from "../sidebar/sidebar-route";
import LogOut from "../sidebar/log-out";

type Props = {};

const NavBar = async ({}: Props) => {
   const user = await currentUserOrThrowAuthError();

   return (
      <div className="w-full bg-secondary font-poppins shadow-lg dark:bg-background/70 dark:border-[1px] dark:border-b-primary/70 dark:backdrop-blur-md justify-between flex p-3">
         <Sheet>
            <SheetTrigger className="lg:hidden">
               <MenuIcon className="size-7 text-primary"></MenuIcon>
            </SheetTrigger>
            <SheetContent className=" dark:bg-background/30 backdrop-blur-sm" side={"left"}>
               <SheetHeader>
                  <SheetTitle>Coop ACE System</SheetTitle>
                  <SheetDescription>
                     <SideBarRoute currentUser={user} ></SideBarRoute>
                  </SheetDescription>
               </SheetHeader>
            </SheetContent>
         </Sheet>
         <Link
            href="/"
            className="hidden lg:flex text-[min(22px,3.5vw)] text-white font-medium  items-center"
         >
            <h1><span className="text-lg">e</span>Coop ACE System</h1>
         </Link>
         <div className=" flex  space-x-4 items-center">
            <h1 className="text-muted-foreground text-[min(14px,2.9vw)] font-bold">{user.name}</h1>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Avatar>
                     <AvatarImage src={user.picture as string} alt="@shadcn" />
                     <AvatarFallback>
                        {user.name.substring(0, 1)}
                     </AvatarFallback>
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
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <LogOut />
               </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
         </div>
      </div>
   );
};

export default NavBar;
