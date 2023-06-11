-- AlterTable
ALTER TABLE "RoomUpgrades" ADD COLUMN     "lastUse" TIMESTAMP(3),
ADD COLUMN     "lastUsedByIds" INTEGER[],
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1;
