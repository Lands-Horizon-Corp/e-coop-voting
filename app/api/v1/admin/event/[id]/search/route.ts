import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdSchema } from "@/validation-schema/commons";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { z } from "zod";
import { Prisma } from "@prisma/client";

type TParams = { params: { id: string } };

const searchQuerySchema = z.object({
  q: z.string().min(1, "Search query required"),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const GET = async (req: NextRequest, { params }: TParams) => {
  try {
    const eventId = eventIdSchema.parse(params.id);
    await currentUserOrThrowAuthError(); // Just verify they are logged in

    const { q, limit } = searchQuerySchema.parse({
      q: req.nextUrl.searchParams.get("q"),
      limit: req.nextUrl.searchParams.get("limit") || "10",
    });

    const hasComma = q.includes(",");
    let searchConditions: Prisma.Sql[] = [];

    if (hasComma) {
      const parts = q.split(",");
      const exactPart = parts[0].trim();
      const remainingPart = parts.slice(1).join(" ").trim();

      if (exactPart) {
        searchConditions.push(
          Prisma.sql`(LOWER(ea."firstName") = LOWER(${exactPart}) OR LOWER(ea."lastName") = LOWER(${exactPart}))`,
        );
      }

      if (remainingPart) {
        searchConditions.push(
          Prisma.sql`(COALESCE(ea."firstName", '') || ' ' || COALESCE(ea."lastName", '') || ' ' || COALESCE(ea."passbookNumber", '')) ILIKE ${`%${remainingPart}%`}`,
        );
      }
    } else {
      const tokens = q.split(/\s+/).filter(Boolean);
      searchConditions = tokens.map(
        (token) =>
          Prisma.sql`(COALESCE(ea."firstName", '') || ' ' || COALESCE(ea."lastName", '') || ' ' || COALESCE(ea."passbookNumber", '')) ILIKE ${`%${token}%`}`,
      );
    }

    const combinedSearchQuery =
      searchConditions.length > 0
        ? Prisma.join(searchConditions, " AND ")
        : Prisma.sql`1=1`;

    const results = await db.$queryRaw<any[]>`
      SELECT 
        ea.*,
        u.name as "registeredByName",
        u.picture as "registeredByPicture",
        el.id as "electionId"
      FROM "EventAttendees" ea
      LEFT JOIN "User" u ON ea."registrationAssistId" = u.id
      LEFT JOIN "Election" el ON ea."eventId" = el."eventId"
      WHERE ea."eventId" = ${eventId}
        AND (${combinedSearchQuery})
      ORDER BY ea."createdAt" DESC
      LIMIT ${limit}
    `;

    const formattedData = results.map((r) => ({
      ...r,
      registeredBy: r.registrationAssistId
        ? {
            name: r.registeredByName,
            picture: r.registeredByPicture,
          }
        : null,
      event: {
        election: r.electionId ? { id: r.electionId } : null,
      },
    }));

    return NextResponse.json({
      data: formattedData,
      meta: { total: 0, limit, count: results.length, query: q },
    });
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
