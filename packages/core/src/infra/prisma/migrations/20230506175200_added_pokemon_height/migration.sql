/*
  Warnings:

  - Added the required column `height` to the `BasePokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BasePokemon" ADD COLUMN     "height" INTEGER NOT NULL;
