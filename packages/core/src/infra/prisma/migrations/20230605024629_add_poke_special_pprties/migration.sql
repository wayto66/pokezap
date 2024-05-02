-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "hasMegaEvolution" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMega" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRegional" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "megaEvolutionId" INTEGER;
