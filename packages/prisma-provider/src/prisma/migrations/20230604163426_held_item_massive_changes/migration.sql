/*
  Warnings:

  - You are about to drop the `BaseHeldItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HeldItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[holderId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "HeldItem" DROP CONSTRAINT "HeldItem_holderId_fkey";

-- DropForeignKey
ALTER TABLE "HeldItem" DROP CONSTRAINT "HeldItem_name_fkey";

-- DropForeignKey
ALTER TABLE "HeldItem" DROP CONSTRAINT "HeldItem_ownerId_fkey";

-- AlterTable
ALTER TABLE "BaseItem" ADD COLUMN     "heldable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "holderId" INTEGER;

-- DropTable
DROP TABLE "BaseHeldItem";

-- DropTable
DROP TABLE "HeldItem";

-- CreateIndex
CREATE UNIQUE INDEX "Item_holderId_key" ON "Item"("holderId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
