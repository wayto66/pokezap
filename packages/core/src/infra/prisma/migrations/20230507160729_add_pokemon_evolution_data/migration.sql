/*
  Warnings:

  - Added the required column `evolutionData` to the `BasePokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isFirstEvolution` to the `BasePokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BasePokemon" ADD COLUMN     "evolutionData" JSONB NOT NULL,
ADD COLUMN     "isFirstEvolution" BOOLEAN NOT NULL;
