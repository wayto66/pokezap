/*
  Warnings:

  - You are about to drop the column `currentRoomId` on the `Raid` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Raid" DROP CONSTRAINT "Raid_currentRoomId_fkey";

-- DropIndex
DROP INDEX "Raid_currentRoomId_key";

-- AlterTable
ALTER TABLE "Raid" DROP COLUMN "currentRoomId",
ADD COLUMN     "currentRoomIndex" INTEGER NOT NULL DEFAULT 0;
