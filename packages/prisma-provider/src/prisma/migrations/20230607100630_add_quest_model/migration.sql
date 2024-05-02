/*
  Warnings:

  - A unique constraint covering the columns `[questId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "questId" INTEGER;

-- CreateTable
CREATE TABLE "Quest" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "playerId" INTEGER,
    "defeatAmount" INTEGER,
    "defeatType" TEXT,
    "defeatType2" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quest_playerId_key" ON "Quest"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_questId_key" ON "Player"("questId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
