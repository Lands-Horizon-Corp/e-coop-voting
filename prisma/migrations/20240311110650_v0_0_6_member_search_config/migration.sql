-- CreateEnum
CREATE TYPE "MemberSearchMode" AS ENUM ('ByPassbook', 'ByName');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "defaultMemberSearchMode" "MemberSearchMode" DEFAULT 'ByPassbook';
