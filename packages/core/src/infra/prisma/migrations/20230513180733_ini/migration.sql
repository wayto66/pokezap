/*
  Warnings:

  - You are about to drop the `_Genes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `talentId1` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentId2` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentId3` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentId4` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentId5` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentId6` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentId7` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentId8` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentId9` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_Genes" DROP CONSTRAINT "_Genes_A_fkey";

-- DropForeignKey
ALTER TABLE "_Genes" DROP CONSTRAINT "_Genes_B_fkey";

-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "talentId1" INTEGER NOT NULL,
ADD COLUMN     "talentId2" INTEGER NOT NULL,
ADD COLUMN     "talentId3" INTEGER NOT NULL,
ADD COLUMN     "talentId4" INTEGER NOT NULL,
ADD COLUMN     "talentId5" INTEGER NOT NULL,
ADD COLUMN     "talentId6" INTEGER NOT NULL,
ADD COLUMN     "talentId7" INTEGER NOT NULL,
ADD COLUMN     "talentId8" INTEGER NOT NULL,
ADD COLUMN     "talentId9" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_Genes";

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_talentId1_fkey" FOREIGN KEY ("talentId1") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_talentId2_fkey" FOREIGN KEY ("talentId2") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_talentId3_fkey" FOREIGN KEY ("talentId3") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_talentId4_fkey" FOREIGN KEY ("talentId4") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_talentId5_fkey" FOREIGN KEY ("talentId5") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_talentId6_fkey" FOREIGN KEY ("talentId6") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_talentId7_fkey" FOREIGN KEY ("talentId7") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_talentId8_fkey" FOREIGN KEY ("talentId8") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_talentId9_fkey" FOREIGN KEY ("talentId9") REFERENCES "Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
