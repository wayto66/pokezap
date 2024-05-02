/*
  Warnings:

  - Added the required column `requiredPlayers` to the `InvasionSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvasionSession" ADD COLUMN     "requiredPlayers" INTEGER NOT NULL;
