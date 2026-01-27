import z from "zod";
import db from "@/lib/database";


export const getElection = async (id: number) => {
     try {
        const electionId = Number(id)
        const election = await db.election.findUnique({
           where: { id:electionId},
           select:{
            id:true,
            electionName:true,
            status:true,
            allowBirthdayVerification:true,
            voteEligibility:true,
            eventId:true,
            positions:true,
            candidates:true,
           }
        });
        return election
     } catch (error) {
        console.log(error);
     }
  };
  