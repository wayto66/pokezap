-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "clan" TEXT;

-- CreateTable
CREATE TABLE "MarketOffer" (
    "id" SERIAL NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "demandPlayerId" INTEGER NOT NULL,
    "cashOffer" INTEGER NOT NULL DEFAULT 0,
    "cashDemand" INTEGER NOT NULL DEFAULT 0,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemToMarketOffer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MarketOfferToPokemon" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_demand" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToMarketOffer_AB_unique" ON "_ItemToMarketOffer"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToMarketOffer_B_index" ON "_ItemToMarketOffer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MarketOfferToPokemon_AB_unique" ON "_MarketOfferToPokemon"("A", "B");

-- CreateIndex
CREATE INDEX "_MarketOfferToPokemon_B_index" ON "_MarketOfferToPokemon"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_demand_AB_unique" ON "_demand"("A", "B");

-- CreateIndex
CREATE INDEX "_demand_B_index" ON "_demand"("B");

-- AddForeignKey
ALTER TABLE "_ItemToMarketOffer" ADD CONSTRAINT "_ItemToMarketOffer_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToMarketOffer" ADD CONSTRAINT "_ItemToMarketOffer_B_fkey" FOREIGN KEY ("B") REFERENCES "MarketOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketOfferToPokemon" ADD CONSTRAINT "_MarketOfferToPokemon_A_fkey" FOREIGN KEY ("A") REFERENCES "MarketOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketOfferToPokemon" ADD CONSTRAINT "_MarketOfferToPokemon_B_fkey" FOREIGN KEY ("B") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_demand" ADD CONSTRAINT "_demand_A_fkey" FOREIGN KEY ("A") REFERENCES "MarketOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_demand" ADD CONSTRAINT "_demand_B_fkey" FOREIGN KEY ("B") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
