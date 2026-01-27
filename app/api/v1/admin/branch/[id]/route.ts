import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server";

import { currentUserOrThrowAuthError } from "@/lib/auth";
import { updateBranchSchema } from "@/validation-schema/branch";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { branchIdParamSchema } from "@/validation-schema/api-params";

type TParams = { params: { id : number } }

export const PATCH = async ( req : NextRequest, { params }: TParams ) =>{
    try{
        const user = await currentUserOrThrowAuthError();
        const id = Number(params.id); 
        const { data } = await req.json();

        if(!params.id && isNaN(Number(id))) 
            return NextResponse.json({ message : "missing/invalid id on request"}, { status : 400 })

        const validatedData = updateBranchSchema.parse(data)

        const updatedBranch = await db.branch.update({ 
            where : { id }, 
            data : {...validatedData, updatedBy : user.id } 
        })

        return NextResponse.json(updatedBranch)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}

export const DELETE = async ( req : NextRequest, { params } : TParams ) => {
    try{
        const currentUser = await currentUserOrThrowAuthError();
        const { id } = branchIdParamSchema.parse(params);

        const toDeleteCoop = await db.branch.findUnique({
            where: { id, users: { some : { OR : [{role: "root"}, { id : currentUser.id }] } } },
        });

        if(toDeleteCoop) return NextResponse.json({ message : "Sorry but you cannot delete this coop as your account or the root user belongs to this branch" }, { status : 403 });

        const deletedBranch = await db.branch.update({ 
            where : { id }, 
            data : { 
                deleted : true, 
                deletedAt : new Date(), 
                deletedBy : currentUser.id 
            }})

        return NextResponse.json(deletedBranch)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}


export const GET = async (req: NextRequest, { params } : TParams) => {
    try {
      const id = Number(params.id)
    //  await currentUserOrThrowAuthError();
      const branch = await db.branch.findMany({
        where: { deleted: false, coopId:id },
        include: { coop: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(branch);
    } catch (e) {
      return routeErrorHandler(e, req);
    }
  };
  
