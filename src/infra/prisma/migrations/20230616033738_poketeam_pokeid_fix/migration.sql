/*
  Warnings:

  - The `pokeIds` column on the `PokeTeam` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PokeTeam" DROP COLUMN "pokeIds",
ADD COLUMN     "pokeIds" INTEGER[];
