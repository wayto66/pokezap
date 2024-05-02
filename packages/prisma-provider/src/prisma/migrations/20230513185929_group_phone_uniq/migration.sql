/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `GameRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GameRoom_phone_key" ON "GameRoom"("phone");
