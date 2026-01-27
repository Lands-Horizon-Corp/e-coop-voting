import { NextRequest, NextResponse } from "next/server";
import { createEventSchema } from "@/validation-schema/event";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { createElectionValidation } from "@/validation-schema/election";
import { ElectionStatus, Role, VotingEligibility } from "@prisma/client";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import db from "@/lib/database";

export const POST = async (req: NextRequest) => {
  try {
    const { data } = await req.json();

    const user = await currentUserOrThrowAuthError();
    // Determine if the event includes an election
    const includeElection = !!data.electionName;

    //not so good na approach, will refactor it the soonest
    const election = includeElection
      ? { electionName: data.electionName, status: ElectionStatus.pending }
      : { electionName: "", status: ElectionStatus.pending };

    // Validate input data
    createEventSchema.parse(data);
    if (includeElection) {
      createElectionValidation.parse(election);
    }

    const CreateEvent = await db.event.create({
      data: includeElection
        ? {
            title: data.title,
            description: data.description,
            date: data.date,
            location: data.location,
            category: data.category,
            deleted: false,
            coverImage: data.coverImage,
            election: {
              create: {
                electionName: election.electionName,
                status: election.status,
                branchId: user.branchId,
                voteEligibility: VotingEligibility.MIGS,
                createdBy: user.id,
              },
            },
            createdBy: user.id,
            branchId:data.branchId,
            coopId: data.coopId,
          }
        : {
            title: data.title,
            description: data.description,
            date: data.date,
            location: data.location,
            category: data.category,
            branchId:data.branchId,
            coopId: data.coopId,
            deleted: false,
            coverImage: data.coverImage,
            createdBy: user.id,
          },
      include: {
        election: true,
        coop:true,
        branch:true,
      },
    });
    return NextResponse.json(CreateEvent);
  } catch (e) {
    console.log(e);
    return routeErrorHandler(e, req);
  }
};

type TConditionSet = {
  roles: Role[];
  condition: {
    coopId?: number;
    branchId?: number;
  };
};

export const GET = async (req: NextRequest) => {
  try {
    const currentUser = await currentUserOrThrowAuthError();

    const getCondition = (currentRole: Role) => {
      const conditionSet: TConditionSet[] = [
        { roles: [Role.root], condition: {} },
        { roles: [Role.coop_root], condition: { coopId: currentUser.coopId } },
        {
          roles: [Role.admin, Role.staff],
          condition: { branchId: currentUser.branchId },
        },
      ];

      const filteredCondition = conditionSet.find((condition) =>
        condition.roles.includes(currentRole),
      )

      return filteredCondition ? filteredCondition.condition : {}
    };

    const getAllEvents = await db.event.findMany({
      where: {
        deleted: false,
        ...getCondition(currentUser.role),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        category: true,
        date: true,
        election: true,
        coverImage: true,
        coop:true,
        branch:true,
      },
    });

    return NextResponse.json(getAllEvents);
  } catch (e) {
    return routeErrorHandler(e, req);
  }
};
