-- CreateEnum
CREATE TYPE "EBerryNames" AS ENUM ('COBA', 'KEBIA', 'SHUCA', 'BABIRI', 'PAYAPA');

-- CreateEnum
CREATE TYPE "EBerryTreePhases" AS ENUM ('SEED', 'SPROUT', 'TALL', 'BLOOM', 'BERRY', 'DECEASED');

-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "isSellable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isUnique" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Ranch" (
    "id" SERIAL NOT NULL,
    "gameroomId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RanchSlot" (
    "id" SERIAL NOT NULL,
    "ranchId" INTEGER NOT NULL,
    "wetness" INTEGER NOT NULL DEFAULT 1,
    "lastWetnessUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RanchSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BerryTree" (
    "id" SERIAL NOT NULL,
    "ranchSlotId" INTEGER NOT NULL,
    "berry" "EBerryNames" NOT NULL,
    "phase" "EBerryTreePhases" NOT NULL,
    "lastPhaseUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextPhaseUpdate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BerryTree_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ranch" ADD CONSTRAINT "Ranch_gameroomId_fkey" FOREIGN KEY ("gameroomId") REFERENCES "GameRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RanchSlot" ADD CONSTRAINT "RanchSlot_ranchId_fkey" FOREIGN KEY ("ranchId") REFERENCES "Ranch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BerryTree" ADD CONSTRAINT "BerryTree_ranchSlotId_fkey" FOREIGN KEY ("ranchSlotId") REFERENCES "RanchSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
