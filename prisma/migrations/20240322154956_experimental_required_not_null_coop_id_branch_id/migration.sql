/*
  Warnings:

  - Made the column `coopId` on table `Branch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `branchId` on table `Election` required. This step will fail if there are existing NULL values in that column.
  - Made the column `branchId` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coopId` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coopId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Branch" ALTER COLUMN "coopId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Election" ALTER COLUMN "branchId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "branchId" SET NOT NULL,
ALTER COLUMN "coopId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "coopId" SET NOT NULL;
