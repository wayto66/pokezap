/*
  Warnings:

  - You are about to drop the column `raidRoomId` on the `RaidPokemon` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RaidPokemon" DROP CONSTRAINT "RaidPokemon_raidRoomId_fkey";

-- AlterTable
ALTER TABLE "RaidPokemon" DROP COLUMN "raidRoomId";

-- CreateTable
CREATE TABLE "_RaidPokemonToRaidRoom" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RaidPokemonToRaidRoom_AB_unique" ON "_RaidPokemonToRaidRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_RaidPokemonToRaidRoom_B_index" ON "_RaidPokemonToRaidRoom"("B");

-- AddForeignKey
ALTER TABLE "_RaidPokemonToRaidRoom" ADD CONSTRAINT "_RaidPokemonToRaidRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "RaidPokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RaidPokemonToRaidRoom" ADD CONSTRAINT "_RaidPokemonToRaidRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "RaidRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
