/*
  Warnings:

  - A unique constraint covering the columns `[gymLeaderId]` on the table `Badge` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[badgeId]` on the table `GymLeader` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spriteUrl` to the `Badge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Badge" ADD COLUMN     "gymLeaderId" INTEGER,
ADD COLUMN     "spriteUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GymLeader" ADD COLUMN     "badgeId" INTEGER;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "activeTournamentId" INTEGER,
ADD COLUMN     "defeatedTournamentId" INTEGER;

-- CreateTable
CREATE TABLE "Tournament" (
    "id" SERIAL NOT NULL,
    "gameroomId" INTEGER NOT NULL,
    "gymLeaderId" INTEGER NOT NULL,
    "cashPrize" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Badge_gymLeaderId_key" ON "Badge"("gymLeaderId");

-- CreateIndex
CREATE UNIQUE INDEX "GymLeader_badgeId_key" ON "GymLeader"("badgeId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_activeTournamentId_fkey" FOREIGN KEY ("activeTournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_defeatedTournamentId_fkey" FOREIGN KEY ("defeatedTournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymLeader" ADD CONSTRAINT "GymLeader_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_gameroomId_fkey" FOREIGN KEY ("gameroomId") REFERENCES "GameRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_gymLeaderId_fkey" FOREIGN KEY ("gymLeaderId") REFERENCES "GymLeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
