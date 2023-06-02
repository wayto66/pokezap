/*
  Warnings:

  - Added the required column `name` to the `InvasionSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvasionSession" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "catchable" BOOLEAN NOT NULL DEFAULT true;
