/*
  Warnings:

  - A unique constraint covering the columns `[holderId,name]` on the table `HeldItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HeldItem_holderId_name_key" ON "HeldItem"("holderId", "name");
