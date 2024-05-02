/*
  Warnings:

  - You are about to drop the column `holderId` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_holderId_fkey";

-- DropIndex
DROP INDEX "Item_holderId_key";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "holderId";

-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "heldItemId" INTEGER;

-- CreateTable
CREATE TABLE "HeldItem" (
    "id" SERIAL NOT NULL,
    "holderId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "HeldItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeldItem_holderId_key" ON "HeldItem"("holderId");

-- AddForeignKey
ALTER TABLE "HeldItem" ADD CONSTRAINT "HeldItem_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeldItem" ADD CONSTRAINT "HeldItem_name_fkey" FOREIGN KEY ("name") REFERENCES "BaseItem"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
