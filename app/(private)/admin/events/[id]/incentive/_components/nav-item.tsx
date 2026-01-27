import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";


type TIncentiveNavProps = {
    Icon: React.ReactNode;
    name: string;
    path: string;
    eventId : number;
};

const NavItem = ({ Icon, name, path, eventId }: TIncentiveNavProps) => {
    const pathName = usePathname();

    const isCurrentPath = pathName.endsWith(path);

    return (
        <div className="overflow-clip rounded-xl group relative">
            <div className="absolute top-1 left-2 blur-md z-0">
                { Icon }
            </div>
            <Link
                className={cn(
                    "bg-secondary/80 border font-medium text-foreground/80 border-transparent hover:border-foreground/10 duration-200 ease-in hover:bg-secondary/40 relative z-10 text-sm px-3 py-2 flex gap-x-2 items-center rounded-xl ",
                    isCurrentPath && "bg-gradient-to-r text-foreground from-background/10 to-[#17f5af]/20 border-foreground/20"
                )}
                href={`/admin/events/${eventId}/incentive/${path}`}
            >
                { Icon }
                <span>{name}</span>
            </Link>
        </div>
    );
};

export default NavItem;
