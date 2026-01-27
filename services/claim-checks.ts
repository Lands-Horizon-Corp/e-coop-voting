import { TMemberAttendeesMinimalInfo } from "@/types";
import { ClaimRequirements } from "@prisma/client";

export const isSatisfiedClaimRequirements = (requirement : ClaimRequirements, member : TMemberAttendeesMinimalInfo) => {
    // if(requirement === "REGISTERED_VOTED" && !member.voted && !member.registered) return false;
    // if(requirement === "REGISTERED" && !member.registered) return false;
    // if(requirement === "VOTED" && !member.voted) return false;

    if(requirement === ClaimRequirements.VOTED && member.voted) return true;
    if(requirement === ClaimRequirements.REGISTERED && member.registered) return true; 
    if(requirement === ClaimRequirements.REGISTERED_VOTED && member.registered && member.voted) return true;
    if(requirement === ClaimRequirements.REGISTERED_SURVEYED && member.registered && member.surveyed) return true;
    
    return false;
}
