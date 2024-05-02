-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "lastEliteFourTry" TIMESTAMP(3),
ADD COLUMN     "lastGymTry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Badge" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymLeader" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GymLeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BadgeToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BadgeToPlayer_AB_unique" ON "_BadgeToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_BadgeToPlayer_B_index" ON "_BadgeToPlayer"("B");

-- AddForeignKey
ALTER TABLE "GymPokemon" ADD CONSTRAINT "GymPokemon_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "GymLeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgeToPlayer" ADD CONSTRAINT "_BadgeToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgeToPlayer" ADD CONSTRAINT "_BadgeToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
