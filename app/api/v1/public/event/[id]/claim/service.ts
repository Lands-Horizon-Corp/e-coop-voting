import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

import { TIncentiveClaimAuth, TMemberAttendeesMinimalInfo } from "@/types";
import { ClaimAuthError } from "@/errors/claim-auth-error";

export const validateClaimAuth = async (req : NextRequest, eventId : number) => {
    const claimAuth = req.cookies.get('c-auth')?.value

    if(!claimAuth) 
    throw new ClaimAuthError("Upon checking, you don't have claim authorization, by providing your credentials we will be able to authorize you to claim", 403)

    const { payload } = await jwtVerify<TIncentiveClaimAuth>(
        claimAuth,
        new TextEncoder().encode(process.env.VOTING_AUTHORIZATION_SECRET)
    );

    const { eventId : jwtEventId } = payload;

    if(eventId !== jwtEventId) 
        throw new ClaimAuthError("Sorry, Your claim authorization doesn't match this event. Please try again", 403)

    return payload;
}

export const createClaimAuth = async (res : NextResponse, eventId : number, member : TMemberAttendeesMinimalInfo) => {

    const authorizationContent: TIncentiveClaimAuth = {
        eventId : eventId,
        attendeeId: member.id,
        passbookNumber: member.passbookNumber,
    };

    const voterAuthorization = await new SignJWT(authorizationContent)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setIssuer("ace-system")
        .sign(
            new TextEncoder().encode(
                process.env.VOTING_AUTHORIZATION_SECRET
            )
        );
    
    res.cookies.set("c-auth", voterAuthorization, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
    })
}

export const revokeClaimAuth = (res : NextResponse) => res.cookies.delete('c-auth')