/*
  Warnings:

  - You are about to drop the column `teamPoke1` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `teamPoke2` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `teamPoke3` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `teamPoke4` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `teamPoke5` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `teamPoke6` on the `Player` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teamPokeId1]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamPokeId2]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamPokeId3]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamPokeId4]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamPokeId5]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamPokeId6]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "teamPoke1",
DROP COLUMN "teamPoke2",
DROP COLUMN "teamPoke3",
DROP COLUMN "teamPoke4",
DROP COLUMN "teamPoke5",
DROP COLUMN "teamPoke6",
ADD COLUMN     "teamPokeId1" INTEGER,
ADD COLUMN     "teamPokeId2" INTEGER,
ADD COLUMN     "teamPokeId3" INTEGER,
ADD COLUMN     "teamPokeId4" INTEGER,
ADD COLUMN     "teamPokeId5" INTEGER,
ADD COLUMN     "teamPokeId6" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Player_teamPokeId1_key" ON "Player"("teamPokeId1");

-- CreateIndex
CREATE UNIQUE INDEX "Player_teamPokeId2_key" ON "Player"("teamPokeId2");

-- CreateIndex
CREATE UNIQUE INDEX "Player_teamPokeId3_key" ON "Player"("teamPokeId3");

-- CreateIndex
CREATE UNIQUE INDEX "Player_teamPokeId4_key" ON "Player"("teamPokeId4");

-- CreateIndex
CREATE UNIQUE INDEX "Player_teamPokeId5_key" ON "Player"("teamPokeId5");

-- CreateIndex
CREATE UNIQUE INDEX "Player_teamPokeId6_key" ON "Player"("teamPokeId6");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamPokeId1_fkey" FOREIGN KEY ("teamPokeId1") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamPokeId2_fkey" FOREIGN KEY ("teamPokeId2") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamPokeId3_fkey" FOREIGN KEY ("teamPokeId3") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamPokeId4_fkey" FOREIGN KEY ("teamPokeId4") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamPokeId5_fkey" FOREIGN KEY ("teamPokeId5") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamPokeId6_fkey" FOREIGN KEY ("teamPokeId6") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
