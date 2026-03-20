import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdSchema } from "@/validation-schema/commons";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { TMemberAttendeesWithRegistrationAssistance } from "@/types/member-attendees.types";

type TParams = { params: { id: string } };

const searchQuerySchema = z.object({
  q: z.string().min(1, "Search query required"),
  limit: z.coerce.number().min(1).max(100).default(20),
});

/**
 * Enhanced parsing to ensure we don't miss names that look like IDs
 */
function getSearchFilters(query: string): Prisma.EventAttendeesWhereInput[] {
  const trimmed = query.trim();
  const conditions: Prisma.EventAttendeesWhereInput[] = [];

  // 1. Always check the full query against Passbook (Case Insensitive)
  conditions.push({
    passbookNumber: { contains: trimmed, mode: "insensitive" },
  });

  // 2. Handle Comma Separated (Lastname, Firstname)
  if (trimmed.includes(",")) {
    const [part1, part2] = trimmed.split(",").map((p) => p.trim());
    if (part1 && part2) {
      conditions.push({
        AND: [
          { lastName: { contains: part1, mode: "insensitive" } },
          { firstName: { contains: part2, mode: "insensitive" } },
        ],
      });
      // Also try the reverse just in case
      conditions.push({
        AND: [
          { firstName: { contains: part1, mode: "insensitive" } },
          { lastName: { contains: part2, mode: "insensitive" } },
        ],
      });
      return conditions;
    }
  }

  // 3. Handle Space Separated or Single Word
  const parts = trimmed.split(/\s+/).filter(Boolean);

  parts.forEach((part) => {
    // Check every individual word against both first and last name
    conditions.push({ firstName: { contains: part, mode: "insensitive" } });
    conditions.push({ lastName: { contains: part, mode: "insensitive" } });
  });

  // 4. If multiple words, try them as a combined sequence
  if (parts.length > 1) {
    conditions.push({ firstName: { contains: trimmed, mode: "insensitive" } });
    conditions.push({ lastName: { contains: trimmed, mode: "insensitive" } });
  }

  return conditions;
}

export const GET = async (req: NextRequest, { params }: TParams) => {
  try {
    const eventId = eventIdSchema.parse(params.id);
    const currentUser = await currentUserOrThrowAuthError();
    const searchParams = req.nextUrl.searchParams;

    const { q, limit } = searchQuerySchema.parse({
      q: searchParams.get("q"),
      limit: searchParams.get("limit") || "20",
    });

    const orConditions = getSearchFilters(q);

    const baseWhere: Prisma.EventAttendeesWhereInput = {
      eventId,
      registered: true,
      ...(currentUser.role === "staff"
        ? { registrationAssistId: currentUser.id }
        : {}),
    };

    const finalWhere: Prisma.EventAttendeesWhereInput = {
      ...baseWhere,
      OR: orConditions,
    };

    const [results, totalCount] = await Promise.all([
      db.eventAttendees.findMany({
        where: finalWhere,
        take: limit,
        include: {
          registeredBy: {
            select: {
              id: true,
              picture: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.eventAttendees.count({ where: finalWhere }),
    ]);
    const formattedData =
      results as unknown as TMemberAttendeesWithRegistrationAssistance[];

    return NextResponse.json({
      data: formattedData,
      meta: {
        total: totalCount,
        limit,
        count: results.length,
        query: q,
      },
    });
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
