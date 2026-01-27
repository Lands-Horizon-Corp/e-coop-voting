import { Branch } from "@prisma/client";
import { TCoop } from ".";

export type TBranch = Branch;

export type TBranchWCoop = Branch & { coop : TCoop } 
