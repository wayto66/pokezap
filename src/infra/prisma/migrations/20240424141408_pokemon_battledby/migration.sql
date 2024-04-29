-- CreateTable
CREATE TABLE "_battledBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_battledBy_AB_unique" ON "_battledBy"("A", "B");

-- CreateIndex
CREATE INDEX "_battledBy_B_index" ON "_battledBy"("B");

-- AddForeignKey
ALTER TABLE "_battledBy" ADD CONSTRAINT "_battledBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_battledBy" ADD CONSTRAINT "_battledBy_B_fkey" FOREIGN KEY ("B") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
