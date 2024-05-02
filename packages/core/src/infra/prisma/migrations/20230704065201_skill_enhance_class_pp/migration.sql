/*
  Warnings:

  - You are about to drop the column `PP` on the `Skill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "PP",
ADD COLUMN     "class" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "pp" INTEGER NOT NULL DEFAULT 10;
