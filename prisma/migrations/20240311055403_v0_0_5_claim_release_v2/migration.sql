/*
  Warnings:

  - You are about to drop the column `released` on the `IncentiveClaims` table. All the data in the column will be lost.
  - You are about to drop the column `releasedById` on the `IncentiveClaims` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "IncentiveClaims" DROP CONSTRAINT "IncentiveClaims_releasedById_fkey";

-- AlterTable
ALTER TABLE "IncentiveClaims" DROP COLUMN "released",
DROP COLUMN "releasedById",
ADD COLUMN     "claimedOnline" BOOLEAN NOT NULL DEFAULT false;
