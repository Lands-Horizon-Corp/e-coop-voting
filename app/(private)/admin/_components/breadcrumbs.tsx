"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  coops: "Coops",
  branches: "Branches",
  "user-management": "Users",
  events: "Events",
  election: "Election",
  candidates: "Candidates",
  positions: "Positions",
  dashboard: "Dashboard",
  attendance: "Attendance",
  incentive: "Incentive",
  incentives: "Incentives",
  "claims-list": "Claims List",
  assign: "Assign",
  reports: "Reports",
  "manage-member": "Manage Members",
  settings: "Settings",
  "event-users": "Event Users",
  create: "Create",
  edit: "Edit",
};

const formatSegment = (segment: string) => {
  const decoded = decodeURIComponent(segment);
  if (/^\d+$/.test(decoded)) return `#${decoded}`;
  if (SEGMENT_LABELS[decoded]) return SEGMENT_LABELS[decoded];

  return decoded
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

type Props = {
  className?: string;
};

const AdminBreadcrumbs = ({ className }: Props) => {
  const pathname = usePathname();
  const segments = (pathname ?? "").split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  return (
    <Breadcrumb className={cn("text-sm", className)}>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const label = formatSegment(segment);

          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AdminBreadcrumbs;
