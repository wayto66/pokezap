-- DropForeignKey
ALTER TABLE "_demand" DROP CONSTRAINT "_demand_A_fkey";

-- DropForeignKey
ALTER TABLE "_demand" DROP CONSTRAINT "_demand_B_fkey";

-- AddForeignKey
ALTER TABLE "_demand" ADD CONSTRAINT "_demand_A_fkey" FOREIGN KEY ("A") REFERENCES "MarketOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_demand" ADD CONSTRAINT "_demand_B_fkey" FOREIGN KEY ("B") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
