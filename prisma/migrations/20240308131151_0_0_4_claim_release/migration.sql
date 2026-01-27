/*
  Warnings:

  - You are about to drop the column `approved` on the `IncentiveClaims` table. All the data in the column will be lost.
  - You are about to drop the column `approvedById` on the `IncentiveClaims` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "IncentiveClaims" DROP CONSTRAINT "IncentiveClaims_approvedById_fkey";

-- AlterTable
ALTER TABLE "IncentiveClaims" DROP COLUMN "approved",
DROP COLUMN "approvedById",
ADD COLUMN     "released" BOOLEAN DEFAULT false,
ADD COLUMN     "releasedAt" TIMESTAMP(3),
ADD COLUMN     "releasedById" INTEGER;

-- AddForeignKey
ALTER TABLE "IncentiveClaims" ADD CONSTRAINT "IncentiveClaims_releasedById_fkey" FOREIGN KEY ("releasedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
