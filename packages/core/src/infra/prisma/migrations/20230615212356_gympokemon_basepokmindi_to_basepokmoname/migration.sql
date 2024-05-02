/*
  Warnings:

  - You are about to drop the column `basePokemonId` on the `GymPokemon` table. All the data in the column will be lost.
  - Added the required column `basePokemonName` to the `GymPokemon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GymPokemon" DROP CONSTRAINT "GymPokemon_basePokemonId_fkey";

-- AlterTable
ALTER TABLE "GymPokemon" DROP COLUMN "basePokemonId",
ADD COLUMN     "basePokemonName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GymPokemon" ADD CONSTRAINT "GymPokemon_basePokemonName_fkey" FOREIGN KEY ("basePokemonName") REFERENCES "BasePokemon"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
