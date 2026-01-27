import db from "@/lib/database";

export const INIT_ROOT_ACCOUNT = async () => {
    const newCoop = await db.coop.create({
        data: {
            coopName: "Main Cooperatives",
            coopDescription: "Don't delete this coop as this is used by the root user.",
        },
    });

    if (!newCoop) throw new Error("Couldn't initialize root account, try again");

    const newBranch = await db.branch.create({
        data: {
            branchName: "main branch",
            branchAddress: "main address",
            branchPicture: "/images/default.png",
            branchDescription: "this is just an dummy branch",
            coopId: newCoop.id,
            users: {
                create: {
                    email: "cooperatives.cloud@gmail.com",
                    name: "Coop Cloud",
                    password: "$2a$10$iJFu3JszgpMfmDuqrSoD/e7XzVJdpEJRMQaPJFnAvAYo6xBLTiOeC",
                    verified: true,
                    role: "root",
                    coopId: newCoop.id
                },
            },
        },
    });

    if(!newBranch) throw new Error("Couldn't initialize root account, try again")

    return true;
};
