/*
  Warnings:

  - A unique constraint covering the columns `[megaEvolutionItemName]` on the table `BasePokemon` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BaseItem" ADD COLUMN     "megaEvolutionId" INTEGER;

-- AlterTable
ALTER TABLE "BasePokemon" ADD COLUMN     "megaEvolutionItemName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BasePokemon_megaEvolutionItemName_key" ON "BasePokemon"("megaEvolutionItemName");

-- AddForeignKey
ALTER TABLE "BasePokemon" ADD CONSTRAINT "BasePokemon_megaEvolutionItemName_fkey" FOREIGN KEY ("megaEvolutionItemName") REFERENCES "BaseItem"("name") ON DELETE SET NULL ON UPDATE CASCADE;
