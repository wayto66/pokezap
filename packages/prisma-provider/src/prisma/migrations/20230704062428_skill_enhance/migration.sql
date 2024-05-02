/*
  Warnings:

  - You are about to drop the column `requiredLevel` on the `Skill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "requiredLevel",
ADD COLUMN     "PP" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "accuracy" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "ailment" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "ailmentChance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'damage',
ADD COLUMN     "drain" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "statChangeAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "statChangeName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "target" TEXT NOT NULL DEFAULT 'selected-pokemon';
