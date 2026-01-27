import { routeErrorHandler } from "@/errors/route-error-handler";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database"
import { electionSwitchSchema } from "@/validation-schema/election-switch";

type Tparams= {
     params:{id:number,electionId:number}
}

export const PATCH =async(req:NextRequest,{params}:Tparams)=>{
     try {
          const electionId = Number(params.electionId)
          const electionStatus = await req.json()
          electionSwitchSchema.parse(electionStatus.status)
          const startElection = await db.election.update({
               where:{
                    id:electionId
               },
               data:{
                  status:electionStatus.status
               }
          })
          return NextResponse.json(startElection)

     } catch (e) {
          console.log(e)
         return routeErrorHandler(e,req)
     }


}
