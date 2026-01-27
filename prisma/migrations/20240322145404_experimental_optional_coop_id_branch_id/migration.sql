-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'coop_root';

-- DropForeignKey
ALTER TABLE "IncentiveClaims" DROP CONSTRAINT "IncentiveClaims_assignedId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_branchId_fkey";

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "coopId" INTEGER;

-- AlterTable
ALTER TABLE "Election" ADD COLUMN     "branchId" INTEGER;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "branchId" INTEGER,
ADD COLUMN     "coopId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coopId" INTEGER;

-- CreateTable
CREATE TABLE "Coop" (
    "id" SERIAL NOT NULL,
    "coopName" TEXT NOT NULL,
    "coopDescription" TEXT NOT NULL,
    "coopLogo" TEXT DEFAULT '/images/default.png',
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "Coop_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Coop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Coop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_coopId_fkey" FOREIGN KEY ("coopId") REFERENCES "Coop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Election" ADD CONSTRAINT "Election_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncentiveClaims" ADD CONSTRAINT "IncentiveClaims_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "IncentiveAssigned"("id") ON DELETE CASCADE ON UPDATE CASCADE;
