/*
  Warnings:

  - Added the required column `isMale` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "isMale" BOOLEAN NOT NULL;
