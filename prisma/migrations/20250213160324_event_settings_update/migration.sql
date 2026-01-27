/*
  Warnings:

  - Made the column `registrationOnEvent` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `defaultMemberSearchMode` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "registrationOnEvent" SET NOT NULL,
ALTER COLUMN "defaultMemberSearchMode" SET NOT NULL;
