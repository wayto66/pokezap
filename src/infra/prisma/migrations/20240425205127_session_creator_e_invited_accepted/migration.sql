/*
  Warnings:

  - You are about to drop the column `acceptCount` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "acceptCount",
ADD COLUMN     "creatorAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "invitedAccepted" BOOLEAN NOT NULL DEFAULT false;
