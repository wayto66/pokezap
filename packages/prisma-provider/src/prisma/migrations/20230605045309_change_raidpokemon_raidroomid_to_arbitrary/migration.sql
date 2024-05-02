-- DropForeignKey
ALTER TABLE "RaidPokemon" DROP CONSTRAINT "RaidPokemon_raidRoomId_fkey";

-- AlterTable
ALTER TABLE "RaidPokemon" ALTER COLUMN "raidRoomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RaidPokemon" ADD CONSTRAINT "RaidPokemon_raidRoomId_fkey" FOREIGN KEY ("raidRoomId") REFERENCES "RaidRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
