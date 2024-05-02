/*
  Warnings:

  - You are about to drop the `_raid-defeated-players` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_raid-lobby-players` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_raid-room-defeated-players` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_raid-room-lobby-players` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_raid-room-winner-players` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_raid-winner-players` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_raid-defeated-players" DROP CONSTRAINT "_raid-defeated-players_A_fkey";

-- DropForeignKey
ALTER TABLE "_raid-defeated-players" DROP CONSTRAINT "_raid-defeated-players_B_fkey";

-- DropForeignKey
ALTER TABLE "_raid-lobby-players" DROP CONSTRAINT "_raid-lobby-players_A_fkey";

-- DropForeignKey
ALTER TABLE "_raid-lobby-players" DROP CONSTRAINT "_raid-lobby-players_B_fkey";

-- DropForeignKey
ALTER TABLE "_raid-room-defeated-players" DROP CONSTRAINT "_raid-room-defeated-players_A_fkey";

-- DropForeignKey
ALTER TABLE "_raid-room-defeated-players" DROP CONSTRAINT "_raid-room-defeated-players_B_fkey";

-- DropForeignKey
ALTER TABLE "_raid-room-lobby-players" DROP CONSTRAINT "_raid-room-lobby-players_A_fkey";

-- DropForeignKey
ALTER TABLE "_raid-room-lobby-players" DROP CONSTRAINT "_raid-room-lobby-players_B_fkey";

-- DropForeignKey
ALTER TABLE "_raid-room-winner-players" DROP CONSTRAINT "_raid-room-winner-players_A_fkey";

-- DropForeignKey
ALTER TABLE "_raid-room-winner-players" DROP CONSTRAINT "_raid-room-winner-players_B_fkey";

-- DropForeignKey
ALTER TABLE "_raid-winner-players" DROP CONSTRAINT "_raid-winner-players_A_fkey";

-- DropForeignKey
ALTER TABLE "_raid-winner-players" DROP CONSTRAINT "_raid-winner-players_B_fkey";

-- DropTable
DROP TABLE "_raid-defeated-players";

-- DropTable
DROP TABLE "_raid-lobby-players";

-- DropTable
DROP TABLE "_raid-room-defeated-players";

-- DropTable
DROP TABLE "_raid-room-lobby-players";

-- DropTable
DROP TABLE "_raid-room-winner-players";

-- DropTable
DROP TABLE "_raid-winner-players";

-- CreateTable
CREATE TABLE "_raid-room-defeated-pokemons" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_raid-room-winner-pokemons" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_raid-room-lobby-pokemons" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_raid-defeated-pokemons" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_raid-winner-pokemons" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_raid-lobby-pokemons" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_raid-room-defeated-pokemons_AB_unique" ON "_raid-room-defeated-pokemons"("A", "B");

-- CreateIndex
CREATE INDEX "_raid-room-defeated-pokemons_B_index" ON "_raid-room-defeated-pokemons"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_raid-room-winner-pokemons_AB_unique" ON "_raid-room-winner-pokemons"("A", "B");

-- CreateIndex
CREATE INDEX "_raid-room-winner-pokemons_B_index" ON "_raid-room-winner-pokemons"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_raid-room-lobby-pokemons_AB_unique" ON "_raid-room-lobby-pokemons"("A", "B");

-- CreateIndex
CREATE INDEX "_raid-room-lobby-pokemons_B_index" ON "_raid-room-lobby-pokemons"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_raid-defeated-pokemons_AB_unique" ON "_raid-defeated-pokemons"("A", "B");

-- CreateIndex
CREATE INDEX "_raid-defeated-pokemons_B_index" ON "_raid-defeated-pokemons"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_raid-winner-pokemons_AB_unique" ON "_raid-winner-pokemons"("A", "B");

-- CreateIndex
CREATE INDEX "_raid-winner-pokemons_B_index" ON "_raid-winner-pokemons"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_raid-lobby-pokemons_AB_unique" ON "_raid-lobby-pokemons"("A", "B");

-- CreateIndex
CREATE INDEX "_raid-lobby-pokemons_B_index" ON "_raid-lobby-pokemons"("B");

-- AddForeignKey
ALTER TABLE "_raid-room-defeated-pokemons" ADD CONSTRAINT "_raid-room-defeated-pokemons_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-room-defeated-pokemons" ADD CONSTRAINT "_raid-room-defeated-pokemons_B_fkey" FOREIGN KEY ("B") REFERENCES "RaidRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-room-winner-pokemons" ADD CONSTRAINT "_raid-room-winner-pokemons_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-room-winner-pokemons" ADD CONSTRAINT "_raid-room-winner-pokemons_B_fkey" FOREIGN KEY ("B") REFERENCES "RaidRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-room-lobby-pokemons" ADD CONSTRAINT "_raid-room-lobby-pokemons_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-room-lobby-pokemons" ADD CONSTRAINT "_raid-room-lobby-pokemons_B_fkey" FOREIGN KEY ("B") REFERENCES "RaidRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-defeated-pokemons" ADD CONSTRAINT "_raid-defeated-pokemons_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-defeated-pokemons" ADD CONSTRAINT "_raid-defeated-pokemons_B_fkey" FOREIGN KEY ("B") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-winner-pokemons" ADD CONSTRAINT "_raid-winner-pokemons_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-winner-pokemons" ADD CONSTRAINT "_raid-winner-pokemons_B_fkey" FOREIGN KEY ("B") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-lobby-pokemons" ADD CONSTRAINT "_raid-lobby-pokemons_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-lobby-pokemons" ADD CONSTRAINT "_raid-lobby-pokemons_B_fkey" FOREIGN KEY ("B") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;
