/*
  Warnings:

  - You are about to drop the `_fullfiled` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_pendent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[invasorId]` on the table `GameRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_fullfiled" DROP CONSTRAINT "_fullfiled_A_fkey";

-- DropForeignKey
ALTER TABLE "_fullfiled" DROP CONSTRAINT "_fullfiled_B_fkey";

-- DropForeignKey
ALTER TABLE "_pendent" DROP CONSTRAINT "_pendent_A_fkey";

-- DropForeignKey
ALTER TABLE "_pendent" DROP CONSTRAINT "_pendent_B_fkey";

-- AlterTable
ALTER TABLE "GameRoom" ADD COLUMN     "invasorId" INTEGER;

-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "invasionSessionId" INTEGER;

-- DropTable
DROP TABLE "_fullfiled";

-- DropTable
DROP TABLE "_pendent";

-- CreateTable
CREATE TABLE "InvasionSession" (
    "id" SERIAL NOT NULL,
    "mode" TEXT NOT NULL,
    "gameRoomId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "invitedId" INTEGER[],
    "enemiesIds" INTEGER[],
    "defeatedPlayersIds" INTEGER[],
    "winnerPlayersIds" INTEGER[],
    "lootItemsDropRate" JSONB[],
    "forfeitCost" INTEGER,
    "cashReward" INTEGER,
    "imageUrl" TEXT,
    "announcementText" TEXT NOT NULL,
    "inInLobby" BOOLEAN NOT NULL DEFAULT true,
    "isInProgress" BOOLEAN NOT NULL DEFAULT false,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvasionSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_invasion-lobby-players" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_invasion-defeated-players" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_invasion-winner-players" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_invasion-lobby-players_AB_unique" ON "_invasion-lobby-players"("A", "B");

-- CreateIndex
CREATE INDEX "_invasion-lobby-players_B_index" ON "_invasion-lobby-players"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_invasion-defeated-players_AB_unique" ON "_invasion-defeated-players"("A", "B");

-- CreateIndex
CREATE INDEX "_invasion-defeated-players_B_index" ON "_invasion-defeated-players"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_invasion-winner-players_AB_unique" ON "_invasion-winner-players"("A", "B");

-- CreateIndex
CREATE INDEX "_invasion-winner-players_B_index" ON "_invasion-winner-players"("B");

-- CreateIndex
CREATE UNIQUE INDEX "GameRoom_invasorId_key" ON "GameRoom"("invasorId");

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_invasionSessionId_fkey" FOREIGN KEY ("invasionSessionId") REFERENCES "InvasionSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRoom" ADD CONSTRAINT "GameRoom_invasorId_fkey" FOREIGN KEY ("invasorId") REFERENCES "InvasionSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_invasion-lobby-players" ADD CONSTRAINT "_invasion-lobby-players_A_fkey" FOREIGN KEY ("A") REFERENCES "InvasionSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_invasion-lobby-players" ADD CONSTRAINT "_invasion-lobby-players_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_invasion-defeated-players" ADD CONSTRAINT "_invasion-defeated-players_A_fkey" FOREIGN KEY ("A") REFERENCES "InvasionSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_invasion-defeated-players" ADD CONSTRAINT "_invasion-defeated-players_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_invasion-winner-players" ADD CONSTRAINT "_invasion-winner-players_A_fkey" FOREIGN KEY ("A") REFERENCES "InvasionSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_invasion-winner-players" ADD CONSTRAINT "_invasion-winner-players_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
