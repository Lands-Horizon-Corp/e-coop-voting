import { Coop } from "@prisma/client";
import { TBranch } from ".";

export type TCoop = Coop;

export type TCoopWBranch = TCoop & {
   branches : TBranch[] 
}
