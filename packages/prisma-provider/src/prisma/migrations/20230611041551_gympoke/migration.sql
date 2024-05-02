-- CreateTable
CREATE TABLE "GymPokemon" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "basePokemonId" INTEGER NOT NULL,
    "gameRoomId" INTEGER,
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

    CONSTRAINT "GymPokemon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GymPokemon" ADD CONSTRAINT "GymPokemon_talentId1_fkey" FOREIGN KEY ("talentId1") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymPokemon" ADD CONSTRAINT "GymPokemon_talentId2_fkey" FOREIGN KEY ("talentId2") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymPokemon" ADD CONSTRAINT "GymPokemon_talentId3_fkey" FOREIGN KEY ("talentId3") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymPokemon" ADD CONSTRAINT "GymPokemon_talentId4_fkey" FOREIGN KEY ("talentId4") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymPokemon" ADD CONSTRAINT "GymPokemon_talentId5_fkey" FOREIGN KEY ("talentId5") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymPokemon" ADD CONSTRAINT "GymPokemon_talentId6_fkey" FOREIGN KEY ("talentId6") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymPokemon" ADD CONSTRAINT "GymPokemon_talentId7_fkey" FOREIGN KEY ("talentId7") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymPokemon" ADD CONSTRAINT "GymPokemon_talentId8_fkey" FOREIGN KEY ("talentId8") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymPokemon" ADD CONSTRAINT "GymPokemon_talentId9_fkey" FOREIGN KEY ("talentId9") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymPokemon" ADD CONSTRAINT "GymPokemon_basePokemonId_fkey" FOREIGN KEY ("basePokemonId") REFERENCES "BasePokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
