import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        return NextResponse.json({
            message: "Waw",
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
};
