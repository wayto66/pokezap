/*
  Warnings:

  - A unique constraint covering the columns `[raidId]` on the table `GameRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GameRoom" ADD COLUMN     "raidId" INTEGER;

-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "raidRoomId" INTEGER;

-- CreateTable
CREATE TABLE "Raid" (
    "id" SERIAL NOT NULL,
    "mode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gameRoomId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "invitedId" INTEGER[],
    "raidRoomsIds" INTEGER[],
    "currentRoomId" INTEGER NOT NULL,
    "defeatedPlayersIds" INTEGER[],
    "winnerPlayersIds" INTEGER[],
    "lootItemsDropRate" JSONB[],
    "requiredPlayers" INTEGER NOT NULL,
    "forfeitCost" INTEGER NOT NULL,
    "cashReward" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "announcementText" TEXT NOT NULL,
    "inInLobby" BOOLEAN NOT NULL DEFAULT true,
    "isInProgress" BOOLEAN NOT NULL DEFAULT false,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Raid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaidRoom" (
    "id" SERIAL NOT NULL,
    "mode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gameRoomId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "invitedId" INTEGER[],
    "raidId" INTEGER NOT NULL,
    "enemiesIds" INTEGER[],
    "isFinalRoom" BOOLEAN NOT NULL,
    "defeatedPlayersIds" INTEGER[],
    "winnerPlayersIds" INTEGER[],
    "lootItemsDropRate" JSONB[],
    "requiredPlayers" INTEGER NOT NULL,
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

    CONSTRAINT "RaidRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_raid-room-defeated-players" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_raid-room-winner-players" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_raid-room-lobby-players" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_raid-defeated-players" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_raid-winner-players" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_raid-lobby-players" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Raid_currentRoomId_key" ON "Raid"("currentRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "_raid-room-defeated-players_AB_unique" ON "_raid-room-defeated-players"("A", "B");

-- CreateIndex
CREATE INDEX "_raid-room-defeated-players_B_index" ON "_raid-room-defeated-players"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_raid-room-winner-players_AB_unique" ON "_raid-room-winner-players"("A", "B");

-- CreateIndex
CREATE INDEX "_raid-room-winner-players_B_index" ON "_raid-room-winner-players"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_raid-room-lobby-players_AB_unique" ON "_raid-room-lobby-players"("A", "B");

-- CreateIndex
CREATE INDEX "_raid-room-lobby-players_B_index" ON "_raid-room-lobby-players"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_raid-defeated-players_AB_unique" ON "_raid-defeated-players"("A", "B");

-- CreateIndex
CREATE INDEX "_raid-defeated-players_B_index" ON "_raid-defeated-players"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_raid-winner-players_AB_unique" ON "_raid-winner-players"("A", "B");

-- CreateIndex
CREATE INDEX "_raid-winner-players_B_index" ON "_raid-winner-players"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_raid-lobby-players_AB_unique" ON "_raid-lobby-players"("A", "B");

-- CreateIndex
CREATE INDEX "_raid-lobby-players_B_index" ON "_raid-lobby-players"("B");

-- CreateIndex
CREATE UNIQUE INDEX "GameRoom_raidId_key" ON "GameRoom"("raidId");

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_raidRoomId_fkey" FOREIGN KEY ("raidRoomId") REFERENCES "RaidRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRoom" ADD CONSTRAINT "GameRoom_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "Raid"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Raid" ADD CONSTRAINT "Raid_currentRoomId_fkey" FOREIGN KEY ("currentRoomId") REFERENCES "RaidRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidRoom" ADD CONSTRAINT "RaidRoom_raidId_fkey" FOREIGN KEY ("raidId") REFERENCES "Raid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-room-defeated-players" ADD CONSTRAINT "_raid-room-defeated-players_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-room-defeated-players" ADD CONSTRAINT "_raid-room-defeated-players_B_fkey" FOREIGN KEY ("B") REFERENCES "RaidRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-room-winner-players" ADD CONSTRAINT "_raid-room-winner-players_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-room-winner-players" ADD CONSTRAINT "_raid-room-winner-players_B_fkey" FOREIGN KEY ("B") REFERENCES "RaidRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-room-lobby-players" ADD CONSTRAINT "_raid-room-lobby-players_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-room-lobby-players" ADD CONSTRAINT "_raid-room-lobby-players_B_fkey" FOREIGN KEY ("B") REFERENCES "RaidRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-defeated-players" ADD CONSTRAINT "_raid-defeated-players_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-defeated-players" ADD CONSTRAINT "_raid-defeated-players_B_fkey" FOREIGN KEY ("B") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-winner-players" ADD CONSTRAINT "_raid-winner-players_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-winner-players" ADD CONSTRAINT "_raid-winner-players_B_fkey" FOREIGN KEY ("B") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-lobby-players" ADD CONSTRAINT "_raid-lobby-players_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-lobby-players" ADD CONSTRAINT "_raid-lobby-players_B_fkey" FOREIGN KEY ("B") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;
