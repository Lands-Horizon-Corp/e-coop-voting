import { routeErrorHandler } from "@/errors/route-error-handler";
import { validateId } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database"
import { createPositionSchema } from "@/validation-schema/position";
import { TCreatePosition } from "@/types";


type TParams = {
     params:{id:number,electionId:number,positionId:number}

}

export const POST = async (req: NextRequest) => {
     try {
        const postionData: TCreatePosition = await req.json();
        createPositionSchema.parse(postionData)
         const createPosition = await db.position.create({data:postionData})
          return NextResponse.json(createPosition)
       } catch (error) {
       return routeErrorHandler(error, req);
     }
  };

export const GET =async (req:NextRequest,{params}:TParams)=>{
     try {
          const electionId = Number(params.electionId)
          validateId(electionId)
          await db.election.findUnique({where:{id:electionId}})
          const getAllPosition = await db.position.findMany({where:{electionId:electionId}});
          return NextResponse.json(getAllPosition);
       } catch (error) {
          return routeErrorHandler(error, req);
       }

}
