/*
  Warnings:

  - You are about to drop the column `bonusAmount` on the `BaseRoomUpgrades` table. All the data in the column will be lost.
  - Added the required column `imageLayer` to the `BaseRoomUpgrades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `BaseRoomUpgrades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BaseRoomUpgrades" DROP COLUMN "bonusAmount",
ADD COLUMN     "imageLayer" INTEGER NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;
