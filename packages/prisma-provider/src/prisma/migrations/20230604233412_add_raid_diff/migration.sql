/*
  Warnings:

  - Added the required column `difficulty` to the `Raid` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pokemon" DROP CONSTRAINT "Pokemon_raidRoomId_fkey";

-- AlterTable
ALTER TABLE "Raid" ADD COLUMN     "difficulty" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RaidPokemon" (
    "id" SERIAL NOT NULL,
    "basePokemonId" INTEGER NOT NULL,
    "raidRoomId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "spriteUrl" TEXT NOT NULL DEFAULT '',
    "hp" INTEGER NOT NULL,
    "atk" INTEGER NOT NULL,
    "def" INTEGER NOT NULL,
    "spAtk" INTEGER NOT NULL,
    "spDef" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "isShiny" BOOLEAN NOT NULL DEFAULT false,
    "talentId1" INTEGER NOT NULL,
    "talentId2" INTEGER NOT NULL,
    "talentId3" INTEGER NOT NULL,
    "talentId4" INTEGER NOT NULL,
    "talentId5" INTEGER NOT NULL,
    "talentId6" INTEGER NOT NULL,
    "talentId7" INTEGER NOT NULL,
    "talentId8" INTEGER NOT NULL,
    "talentId9" INTEGER NOT NULL,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaidPokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_raid-pokemon-activeSkills" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_raid-pokemon-activeSkills_AB_unique" ON "_raid-pokemon-activeSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_raid-pokemon-activeSkills_B_index" ON "_raid-pokemon-activeSkills"("B");

-- AddForeignKey
ALTER TABLE "RaidPokemon" ADD CONSTRAINT "RaidPokemon_talentId1_fkey" FOREIGN KEY ("talentId1") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidPokemon" ADD CONSTRAINT "RaidPokemon_talentId2_fkey" FOREIGN KEY ("talentId2") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidPokemon" ADD CONSTRAINT "RaidPokemon_talentId3_fkey" FOREIGN KEY ("talentId3") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidPokemon" ADD CONSTRAINT "RaidPokemon_talentId4_fkey" FOREIGN KEY ("talentId4") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidPokemon" ADD CONSTRAINT "RaidPokemon_talentId5_fkey" FOREIGN KEY ("talentId5") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidPokemon" ADD CONSTRAINT "RaidPokemon_talentId6_fkey" FOREIGN KEY ("talentId6") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidPokemon" ADD CONSTRAINT "RaidPokemon_talentId7_fkey" FOREIGN KEY ("talentId7") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidPokemon" ADD CONSTRAINT "RaidPokemon_talentId8_fkey" FOREIGN KEY ("talentId8") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidPokemon" ADD CONSTRAINT "RaidPokemon_talentId9_fkey" FOREIGN KEY ("talentId9") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidPokemon" ADD CONSTRAINT "RaidPokemon_raidRoomId_fkey" FOREIGN KEY ("raidRoomId") REFERENCES "RaidRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaidPokemon" ADD CONSTRAINT "RaidPokemon_basePokemonId_fkey" FOREIGN KEY ("basePokemonId") REFERENCES "BasePokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-pokemon-activeSkills" ADD CONSTRAINT "_raid-pokemon-activeSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "RaidPokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raid-pokemon-activeSkills" ADD CONSTRAINT "_raid-pokemon-activeSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
