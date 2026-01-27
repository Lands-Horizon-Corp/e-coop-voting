/*
  Warnings:

  - Made the column `canVote` on table `EventAttendees` required. This step will fail if there are existing NULL values in that column.
  - Made the column `voted` on table `EventAttendees` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EventAttendees" ADD COLUMN     "registrationAssistId" INTEGER,
ALTER COLUMN "canVote" SET NOT NULL,
ALTER COLUMN "canVote" SET DEFAULT true,
ALTER COLUMN "voted" SET NOT NULL;

-- CreateTable
CREATE TABLE "Incentives" (
    "id" SERIAL NOT NULL,
    "itemName" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incentives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncentiveAssigned" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "incentiveId" INTEGER NOT NULL,
    "assignedQuantity" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "IncentiveAssigned_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncentiveClaims" (
    "id" SERIAL NOT NULL,
    "incentiveId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "eventAttendeeId" TEXT NOT NULL,
    "assistedById" INTEGER,
    "assignedId" INTEGER,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncentiveClaims_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IncentiveAssigned_userId_incentiveId_key" ON "IncentiveAssigned"("userId", "incentiveId");

-- CreateIndex
CREATE UNIQUE INDEX "IncentiveClaims_incentiveId_eventAttendeeId_key" ON "IncentiveClaims"("incentiveId", "eventAttendeeId");

-- AddForeignKey
ALTER TABLE "EventAttendees" ADD CONSTRAINT "EventAttendees_registrationAssistId_fkey" FOREIGN KEY ("registrationAssistId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incentives" ADD CONSTRAINT "Incentives_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncentiveAssigned" ADD CONSTRAINT "IncentiveAssigned_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncentiveAssigned" ADD CONSTRAINT "IncentiveAssigned_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncentiveAssigned" ADD CONSTRAINT "IncentiveAssigned_incentiveId_fkey" FOREIGN KEY ("incentiveId") REFERENCES "Incentives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncentiveClaims" ADD CONSTRAINT "IncentiveClaims_incentiveId_fkey" FOREIGN KEY ("incentiveId") REFERENCES "Incentives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncentiveClaims" ADD CONSTRAINT "IncentiveClaims_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncentiveClaims" ADD CONSTRAINT "IncentiveClaims_eventAttendeeId_fkey" FOREIGN KEY ("eventAttendeeId") REFERENCES "EventAttendees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncentiveClaims" ADD CONSTRAINT "IncentiveClaims_assistedById_fkey" FOREIGN KEY ("assistedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncentiveClaims" ADD CONSTRAINT "IncentiveClaims_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "IncentiveAssigned"("id") ON DELETE SET NULL ON UPDATE CASCADE;
