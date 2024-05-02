-- AlterTable
ALTER TABLE "BaseItem" ADD COLUMN     "rarityName" TEXT NOT NULL DEFAULT 'common';

-- AlterTable
ALTER TABLE "GameRoom" ADD COLUMN     "region" TEXT NOT NULL DEFAULT 'default';
