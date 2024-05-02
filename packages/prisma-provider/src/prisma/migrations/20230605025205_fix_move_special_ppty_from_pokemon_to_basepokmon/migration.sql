/*
  Warnings:

  - You are about to drop the column `hasMegaEvolution` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `isMega` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `isRegional` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `megaEvolutionId` on the `Pokemon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BasePokemon" ADD COLUMN     "hasMegaEvolution" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMega" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRegional" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "megaEvolutionId" INTEGER;

-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "hasMegaEvolution",
DROP COLUMN "isMega",
DROP COLUMN "isRegional",
DROP COLUMN "megaEvolutionId";
