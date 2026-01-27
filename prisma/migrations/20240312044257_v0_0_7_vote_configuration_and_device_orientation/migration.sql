-- CreateEnum
CREATE TYPE "VotingScreenOrientation" AS ENUM ('LANDSCAPE', 'PORTRAIT', 'ANY');

-- AlterTable
ALTER TABLE "Election" ADD COLUMN     "voteScreenConfiguration" "VotingScreenOrientation" NOT NULL DEFAULT 'LANDSCAPE';
