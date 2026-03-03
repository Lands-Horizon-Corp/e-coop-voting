import { gender } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { excelDateToJSDate, generateOTP, validateId } from "@/lib/server-utils";
import { generateUserProfileS3URL } from "@/lib/aws-s3";
import { FUNCTION_DURATION } from "@/constants";

export const maxDuration = FUNCTION_DURATION;
const BATCH_SIZE = 500;

type MemberData = {
  firstName: string;
  lastName: string;
  middleName: string;
  passbookNumber: string;
  createdBy: number;
  birthday?: Date | undefined;
  eventId: number;
  emailAddress?: string;
  contact?: string;
  voteOtp: string;
  gender: gender;
  picture: string;
  registered: boolean;
};

type FilteredMembers = {
  duplicatesOnNewImport: MemberData[];
  newMembers: MemberData[];
  skippedMembers: MemberData[];
};

const parseRegistered = (value: unknown): boolean => {
  return (
    value === true ||
    (typeof value === "string" && value.trim().toLowerCase() === "yes")
  );
};

const chunkMemberData = (array: MemberData[], size: number) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

const mapAndFilterDuplicates = (
  membersData: any[],
  user: { id: number },
  id: number,
): FilteredMembers => {
  const getValue = (obj: any, keys: string[]) => {
    const foundKey = keys.find((key) => key in obj);
    return foundKey ? obj[foundKey] : undefined;
  };

  const modifiedMembersData: MemberData[] = membersData.map((member) => {
    // Define possible aliases for each field
    const rawPBNo = getValue(member, [
      "P.B. No",
      "passbookNumber",
      "PB No",
      "PBNo",
    ]);
    const rawFirstName = getValue(member, [
      "FIRST NAME ",
      "FIRST NAME",
      "firstName",
      "First Name",
    ]);
    const rawLastName = getValue(member, [
      "LAST NAME",
      "lastName",
      "Last Name",
    ]);
    const rawMiddleName = getValue(member, [
      "MIDDLE NAME",
      "middleName",
      "Middle Name",
    ]);
    const rawGender = getValue(member, [
      "GENDER",
      "__EMPTY_4",
      "gender",
      "Sex",
    ]);
    const rawBirthday = getValue(member, [
      "BIRTHDAY",
      "birthday",
      "Birth Date",
    ]);

    const PBNo = rawPBNo ? String(rawPBNo) : generateOTP(6);

    return {
      firstName: rawFirstName ? String(rawFirstName).trim() : "",
      lastName: rawLastName ? String(rawLastName).trim() : "",
      middleName: rawMiddleName ? String(rawMiddleName).trim() : "",
      gender: String(rawGender || "")
        .toUpperCase()
        .startsWith("M")
        ? "Male"
        : "Female",
      passbookNumber: PBNo,
      createdBy: user.id,
      birthday: rawBirthday
        ? excelDateToJSDate(rawBirthday as unknown as string)
        : undefined,
      eventId: id,
      emailAddress: member.emailAddress ?? "",
      contact: member.contact ? String(member.contact) : "",
      voteOtp: generateOTP(6),
      picture: generateUserProfileS3URL(PBNo.toUpperCase()),
      registered: parseRegistered(member.registered),
    };
  });

  const passbookMap = new Map<string | undefined, boolean>();
  const duplicates: MemberData[] = [];
  const newMembers: MemberData[] = [];

  modifiedMembersData.forEach((member) => {
    const passbookNumber = member.passbookNumber;
    if (passbookMap.has(passbookNumber)) {
      duplicates.push(member);
    } else {
      passbookMap.set(passbookNumber, true);
      newMembers.push(member);
    }
  });

  console.log(modifiedMembersData.length);
  console.log(newMembers.length);
  return {
    duplicatesOnNewImport: duplicates,
    newMembers,
    skippedMembers: [],
  };
};

const fetchOldMembers = async (id: number) => {
  return await db.eventAttendees.findMany({
    where: {
      eventId: id,
    },
    select: { passbookNumber: true },
  });
};

const filterUniqueMembers = (newMembers: MemberData[], oldMembers: any[]) => {
  const oldPassbookNumbers = new Set(oldMembers.map((m) => m.passbookNumber));

  const filteredMembers = newMembers.filter(
    (newMember) => !oldPassbookNumbers.has(newMember.passbookNumber),
  );

  const skippedMembers = newMembers.filter((newMember) =>
    oldPassbookNumbers.has(newMember.passbookNumber),
  );

  return { filteredMembers, skippedMembers };
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: number } },
) => {
  try {
    const id = Number(params.id);
    validateId(id);
    const user = await currentUserOrThrowAuthError();

    // 1. Log Raw Request
    const membersData = await req.json();
    console.log(
      `[IMPORT START] Received ${membersData?.length} raw rows from request.`,
    );
    if (membersData.length > 0) {
      console.log(`[SAMPLE DATA] First row keys:`, Object.keys(membersData[0]));
    }

    // 2. Log Mapping Result
    const { duplicatesOnNewImport, newMembers } = mapAndFilterDuplicates(
      membersData,
      user,
      id,
    );
    console.log(
      `[MAPPING] After normalization: ${newMembers.length} valid, ${duplicatesOnNewImport.length} internal duplicates.`,
    );

    // 3. Log Database Comparison
    const oldMembers = await fetchOldMembers(id);
    const { filteredMembers, skippedMembers } = filterUniqueMembers(
      newMembers,
      oldMembers,
    );
    console.log(
      `[FILTERING] ${filteredMembers.length} are new to DB, ${skippedMembers.length} already exist in DB.`,
    );

    if (filteredMembers.length === 0) {
      console.warn(
        "[WARNING] No new members to insert. Check if keys matched correctly in mapAndFilterDuplicates.",
      );
    }

    // 4. Log Batching and DB Write
    const batches = chunkMemberData(filteredMembers, BATCH_SIZE);
    console.log(
      `[DB WRITE] Processing ${filteredMembers.length} members in ${batches.length} batches.`,
    );

    const batchPromises = batches.map((batch: MemberData[], index: number) => {
      console.log(
        `[BATCH ${index}] Attempting to insert ${batch.length} rows...`,
      );
      return db.eventAttendees.createMany({
        data: batch,
        skipDuplicates: true,
      });
    });

    const results = await Promise.allSettled(batchPromises);

    // 5. Check for DB Errors
    results.forEach((res, i) => {
      if (res.status === "rejected") {
        console.error(`[BATCH ${i} ERROR]:`, res.reason);
      } else {
        console.log(`[BATCH ${i} SUCCESS]`);
      }
    });

    const Members = {
      duplicationOnFirstImport: duplicatesOnNewImport,
      newMembers: filteredMembers,
      skippedMembers: [...duplicatesOnNewImport, ...skippedMembers],
    };

    return NextResponse.json(Members);
  } catch (e) {
    console.error("[CRITICAL API ERROR]:", e);
    return routeErrorHandler(e, req);
  }
};
