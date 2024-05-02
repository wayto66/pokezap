-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "lastGymTry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PokeTeams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slot1Id" INTEGER NOT NULL,
    "slot2Id" INTEGER NOT NULL,
    "slot3Id" INTEGER NOT NULL,
    "slot4Id" INTEGER NOT NULL,
    "slot5Id" INTEGER NOT NULL,
    "slot6Id" INTEGER NOT NULL,
    "pokeIds" INTEGER NOT NULL,

    CONSTRAINT "PokeTeams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PokeTeams_name_id_key" ON "PokeTeams"("name", "id");
