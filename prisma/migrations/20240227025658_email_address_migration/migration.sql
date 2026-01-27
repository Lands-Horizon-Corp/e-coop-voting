-- AlterTable
ALTER TABLE "EventAttendees" ADD COLUMN     "emailAddress" TEXT,
ALTER COLUMN "picture" SET DEFAULT '/images/default-avatar.png';
