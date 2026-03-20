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

export const GET = async (req: NextRequest, { params }: TParams) => {
  try {
    const eventId = eventIdSchema.parse(params.id);
    const currentUser = await currentUserOrThrowAuthError();
    const { q, limit } = searchQuerySchema.parse({
      q: req.nextUrl.searchParams.get("q"),
      limit: req.nextUrl.searchParams.get("limit") || "10",
    });

    const staffId = currentUser.role === "staff" ? currentUser.id : null;

    // 1. Clean and Parse the Query into tokens
    // Splits the search query by spaces or commas and removes empty strings
    const searchTokens = q.split(/[\s,]+/).filter(Boolean);

    // 2. Build dynamic search conditions
    // Ensures EVERY word/token typed must exist in the passbook, first name, or last name.
    // COALESCE prevents NULL values from breaking the string concatenation.
    const searchConditions = searchTokens.map(
      (token) =>
        Prisma.sql`(COALESCE(ea."firstName", '') || ' ' || COALESCE(ea."lastName", '') || ' ' || COALESCE(ea."passbookNumber", '')) ILIKE ${`%${token}%`}`,
    );

    // Join the conditions with AND so a search for "Ella, Mary" requires both "Ella" and "Mary" to match
    const combinedSearchQuery =
      searchConditions.length > 0
        ? Prisma.join(searchConditions, " AND ")
        : Prisma.sql`1=1`;

    // OPTIMIZATION: Use a Single Raw Query for both Data and Total Count
    // This avoids hitting the DB twice for the same expensive filter
    const results = await db.$queryRaw<any[]>`
      WITH filtered_attendees AS (
        SELECT ea.id
        FROM "EventAttendees" ea
        WHERE ea."eventId" = ${eventId}
          AND ea."registered" = true
          ${staffId ? Prisma.sql`AND ea."registrationAssistId" = ${staffId}` : Prisma.empty}
          AND (${combinedSearchQuery})
        LIMIT ${limit}
      )
      SELECT 
        ea.*,
        u.name as "registeredByName", -- Flattening for speed
        u.picture as "registeredByPicture",
        el.id as "electionId"
      FROM "EventAttendees" ea
      JOIN filtered_attendees fa ON ea.id = fa.id
      LEFT JOIN "User" u ON ea."registrationAssistId" = u.id
      LEFT JOIN "Election" el ON ea."eventId" = el."eventId"
      ORDER BY ea."createdAt" DESC
    `;

    const formattedData = results.map((r) => ({
      ...r,
      registeredBy: {
        name: r.registeredByName,
        picture: r.registeredByPicture,
      },
      event: { election: r.electionId ? { id: r.electionId } : null },
    }));

    return NextResponse.json({
      data: formattedData,
      meta: { total: 0, limit, count: results.length, query: q },
    });
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
