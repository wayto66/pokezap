/*
  Warnings:

  - You are about to drop the `PokeTeams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PokeTeams";

-- CreateTable
CREATE TABLE "PokeTeam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "slot1Id" INTEGER NOT NULL,
    "slot2Id" INTEGER NOT NULL,
    "slot3Id" INTEGER NOT NULL,
    "slot4Id" INTEGER NOT NULL,
    "slot5Id" INTEGER NOT NULL,
    "slot6Id" INTEGER NOT NULL,
    "pokeIds" INTEGER NOT NULL,

    CONSTRAINT "PokeTeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PokeTeam_name_ownerId_key" ON "PokeTeam"("name", "ownerId");

-- AddForeignKey
ALTER TABLE "PokeTeam" ADD CONSTRAINT "PokeTeam_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
