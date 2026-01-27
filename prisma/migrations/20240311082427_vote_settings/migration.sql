-- CreateEnum
CREATE TYPE "VotingConfiguration" AS ENUM ('ALLOW_SKIP', 'ATLEAST_ONE', 'REQUIRE_ALL');

-- AlterTable
ALTER TABLE "Election" ADD COLUMN     "voteConfiguration" "VotingConfiguration" NOT NULL DEFAULT 'ALLOW_SKIP';
