-- AlterTable
ALTER TABLE "IncentiveClaims" ADD COLUMN     "approved" BOOLEAN DEFAULT false,
ADD COLUMN     "approvedById" INTEGER;

-- AddForeignKey
ALTER TABLE "IncentiveClaims" ADD CONSTRAINT "IncentiveClaims_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
