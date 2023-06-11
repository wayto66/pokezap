-- DropForeignKey
ALTER TABLE "HeldItem" DROP CONSTRAINT "HeldItem_holderId_fkey";

-- AlterTable
ALTER TABLE "HeldItem" ALTER COLUMN "holderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "HeldItem" ADD CONSTRAINT "HeldItem_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
