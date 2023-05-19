/*
  Warnings:

  - You are about to drop the `_PlayerToSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PokemonToSession` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitedId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PlayerToSession" DROP CONSTRAINT "_PlayerToSession_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlayerToSession" DROP CONSTRAINT "_PlayerToSession_B_fkey";

-- DropForeignKey
ALTER TABLE "_PokemonToSession" DROP CONSTRAINT "_PokemonToSession_A_fkey";

-- DropForeignKey
ALTER TABLE "_PokemonToSession" DROP CONSTRAINT "_PokemonToSession_B_fkey";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "creatorId" INTEGER NOT NULL,
ADD COLUMN     "invitedId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PlayerToSession";

-- DropTable
DROP TABLE "_PokemonToSession";

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_invitedId_fkey" FOREIGN KEY ("invitedId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
