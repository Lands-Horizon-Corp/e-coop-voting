-- CreateEnum
CREATE TYPE "ClaimRequirements" AS ENUM ('REGISTERED', 'VOTED', 'REGISTERED_VOTED');

-- AlterTable
ALTER TABLE "Incentives" ADD COLUMN     "claimRequirement" "ClaimRequirements" DEFAULT 'REGISTERED';
