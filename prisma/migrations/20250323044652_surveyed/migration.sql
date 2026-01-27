-- AlterEnum
ALTER TYPE "ClaimRequirements" ADD VALUE 'REGISTERED_SURVEYED';

-- AlterTable
ALTER TABLE "EventAttendees" ADD COLUMN     "surveyed" BOOLEAN DEFAULT false;
