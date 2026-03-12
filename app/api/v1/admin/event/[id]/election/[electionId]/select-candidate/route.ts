import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdSchema } from "@/validation-schema/commons";

type TParams = { params: { id: number; electionId: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Scrub the input: Remove commas, handle special characters, and split
    const rawSearch = searchParams.get("search")?.trim() || "";
    const cleanSearch = rawSearch
      .replace(/,/g, " ") // Replace commas with spaces
      .replace(/[\u0000-\u001F]/g, "") // Strip hidden control characters (like the  seen in your data)
      .trim();

    const searchKeywords = cleanSearch.split(/\s+/).filter(Boolean);

    const eventId = eventIdSchema.parse(params.id);
    const electionId = eventIdSchema.parse(params.electionId);

    // 2. Get candidates to exclude
    const candidates = await db.candidate.findMany({
      where: { electionId },
      select: { passbookNumber: true },
    });
    const candidatePassbooks = candidates.map((c) => c.passbookNumber);

    /**
     * 3. Robust Search Filter
     * This checks if the ENTIRE search string matches the passbook,
     * OR if ANY of the keywords match ANY of the name fields.
     */
    const searchFilter =
      searchKeywords.length > 0
        ? {
            OR: [
              // Check if the raw string (like "P-638") is the passbook
              {
                passbookNumber: {
                  contains: cleanSearch,
                  mode: "insensitive" as const,
                },
              },
              // Check if the keywords appear across the name fields
              {
                AND: searchKeywords.map((word) => ({
                  OR: [
                    {
                      firstName: {
                        contains: word,
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      lastName: {
                        contains: word,
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      middleName: {
                        contains: word,
                        mode: "insensitive" as const,
                      },
                    }, // Ensure your schema uses 'middleName'
                  ],
                })),
              },
            ],
          }
        : {};

    // 4. Query
    const filteredEventAttendees = await db.eventAttendees.findMany({
      where: {
        eventId,
        NOT: { passbookNumber: { in: candidatePassbooks } },
        ...searchFilter,
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    });

    return NextResponse.json(filteredEventAttendees);
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
