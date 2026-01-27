import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export default withAuth((req: NextRequest) => {});

export const config = {
  matcher: [
        "/admin/:path*", 
        "/api/v1/admin/:path*", 
        "/app/v1/uploade/:path*"
    ],
};
