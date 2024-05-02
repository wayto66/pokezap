-- CreateTable
CREATE TABLE "_ranAwayFrom" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ranAwayFrom_AB_unique" ON "_ranAwayFrom"("A", "B");

-- CreateIndex
CREATE INDEX "_ranAwayFrom_B_index" ON "_ranAwayFrom"("B");

-- AddForeignKey
ALTER TABLE "_ranAwayFrom" ADD CONSTRAINT "_ranAwayFrom_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ranAwayFrom" ADD CONSTRAINT "_ranAwayFrom_B_fkey" FOREIGN KEY ("B") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
