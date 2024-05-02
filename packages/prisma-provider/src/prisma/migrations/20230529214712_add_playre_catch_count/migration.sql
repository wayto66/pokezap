-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "caughtDbIds" INTEGER[],
ADD COLUMN     "caughtDexIds" INTEGER[],
ADD COLUMN     "statusLocked" BOOLEAN NOT NULL DEFAULT false;
