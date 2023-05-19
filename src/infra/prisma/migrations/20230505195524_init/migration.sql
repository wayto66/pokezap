-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "spriteUrl" TEXT NOT NULL DEFAULT '',
    "elo" INTEGER NOT NULL DEFAULT 1200,
    "cash" INTEGER NOT NULL DEFAULT 500,
    "energy" INTEGER NOT NULL DEFAULT 20,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BasePokemon" (
    "id" SERIAL NOT NULL,
    "pokedexId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "defaultSpriteUrl" TEXT NOT NULL,
    "shinySpriteUrl" TEXT NOT NULL,
    "type1Name" TEXT NOT NULL,
    "type2Name" TEXT,
    "BaseHp" INTEGER NOT NULL,
    "BaseAtk" INTEGER NOT NULL,
    "BaseDef" INTEGER NOT NULL,
    "BaseSpAtk" INTEGER NOT NULL,
    "BaseSpDef" INTEGER NOT NULL,
    "BaseSpeed" INTEGER NOT NULL,
    "BaseAllStats" INTEGER NOT NULL,
    "BaseExperience" INTEGER NOT NULL,
    "skillTable" BYTEA[],
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BasePokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER,
    "basePokemonId" INTEGER NOT NULL,
    "gameRoomId" INTEGER,
    "savage" BOOLEAN NOT NULL,
    "level" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "atk" INTEGER NOT NULL,
    "def" INTEGER NOT NULL,
    "spAtk" INTEGER NOT NULL,
    "spDef" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "isAdult" BOOLEAN NOT NULL,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,
    "requiredLevel" INTEGER NOT NULL,
    "attackPower" INTEGER NOT NULL,
    "isPhysical" BOOLEAN NOT NULL,
    "isSpecial" BOOLEAN NOT NULL,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Talent" (
    "id" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Talent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaseItem" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "spriteUrl" TEXT NOT NULL,
    "npcPrice" INTEGER NOT NULL DEFAULT 0,
    "sellable" BOOLEAN NOT NULL DEFAULT false,
    "rarity" INTEGER NOT NULL DEFAULT 0,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BaseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaseHeldItem" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "spriteUrl" TEXT NOT NULL,
    "npcPrice" INTEGER NOT NULL DEFAULT 0,
    "sellable" BOOLEAN NOT NULL DEFAULT false,
    "rarity" INTEGER NOT NULL DEFAULT 0,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BaseHeldItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeldItem" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "holderId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "HeldItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "mode" TEXT NOT NULL,
    "isInProgress" BOOLEAN NOT NULL DEFAULT false,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameRoom" (
    "id" SERIAL NOT NULL,
    "mode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "experience" INTEGER NOT NULL,
    "activeIncense" TEXT,
    "incenseCharges" INTEGER,
    "isInProgress" BOOLEAN NOT NULL DEFAULT false,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomUpgrades" (
    "id" SERIAL NOT NULL,
    "baseId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "RoomUpgrades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaseRoomUpgrades" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bonusType" TEXT NOT NULL,
    "bonusAmount" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "BaseRoomUpgrades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "msgId" TEXT NOT NULL,
    "gameRoomId" INTEGER,
    "type" TEXT NOT NULL,
    "body" TEXT,
    "actions" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_defeatedBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PlayerToSession" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BasePokemonToSkill" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Genes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_activeSkills" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PokemonToSession" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_GameRoomToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_pendent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_fullfiled" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_phone_key" ON "Player"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Type_name_key" ON "Type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BasePokemon_name_key" ON "BasePokemon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BaseItem_name_key" ON "BaseItem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BaseHeldItem_name_key" ON "BaseHeldItem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HeldItem_holderId_key" ON "HeldItem"("holderId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_msgId_key" ON "Message"("msgId");

-- CreateIndex
CREATE UNIQUE INDEX "_defeatedBy_AB_unique" ON "_defeatedBy"("A", "B");

-- CreateIndex
CREATE INDEX "_defeatedBy_B_index" ON "_defeatedBy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlayerToSession_AB_unique" ON "_PlayerToSession"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayerToSession_B_index" ON "_PlayerToSession"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BasePokemonToSkill_AB_unique" ON "_BasePokemonToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_BasePokemonToSkill_B_index" ON "_BasePokemonToSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Genes_AB_unique" ON "_Genes"("A", "B");

-- CreateIndex
CREATE INDEX "_Genes_B_index" ON "_Genes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_activeSkills_AB_unique" ON "_activeSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_activeSkills_B_index" ON "_activeSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonToSession_AB_unique" ON "_PokemonToSession"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonToSession_B_index" ON "_PokemonToSession"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GameRoomToPlayer_AB_unique" ON "_GameRoomToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_GameRoomToPlayer_B_index" ON "_GameRoomToPlayer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_pendent_AB_unique" ON "_pendent"("A", "B");

-- CreateIndex
CREATE INDEX "_pendent_B_index" ON "_pendent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_fullfiled_AB_unique" ON "_fullfiled"("A", "B");

-- CreateIndex
CREATE INDEX "_fullfiled_B_index" ON "_fullfiled"("B");

-- AddForeignKey
ALTER TABLE "BasePokemon" ADD CONSTRAINT "BasePokemon_type1Name_fkey" FOREIGN KEY ("type1Name") REFERENCES "Type"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BasePokemon" ADD CONSTRAINT "BasePokemon_type2Name_fkey" FOREIGN KEY ("type2Name") REFERENCES "Type"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_basePokemonId_fkey" FOREIGN KEY ("basePokemonId") REFERENCES "BasePokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_typeName_fkey" FOREIGN KEY ("typeName") REFERENCES "Type"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Talent" ADD CONSTRAINT "Talent_typeName_fkey" FOREIGN KEY ("typeName") REFERENCES "Type"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_name_fkey" FOREIGN KEY ("name") REFERENCES "BaseItem"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeldItem" ADD CONSTRAINT "HeldItem_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeldItem" ADD CONSTRAINT "HeldItem_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeldItem" ADD CONSTRAINT "HeldItem_name_fkey" FOREIGN KEY ("name") REFERENCES "BaseHeldItem"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUpgrades" ADD CONSTRAINT "RoomUpgrades_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "BaseRoomUpgrades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUpgrades" ADD CONSTRAINT "RoomUpgrades_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "GameRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "GameRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_defeatedBy" ADD CONSTRAINT "_defeatedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_defeatedBy" ADD CONSTRAINT "_defeatedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToSession" ADD CONSTRAINT "_PlayerToSession_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToSession" ADD CONSTRAINT "_PlayerToSession_B_fkey" FOREIGN KEY ("B") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BasePokemonToSkill" ADD CONSTRAINT "_BasePokemonToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "BasePokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BasePokemonToSkill" ADD CONSTRAINT "_BasePokemonToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Genes" ADD CONSTRAINT "_Genes_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Genes" ADD CONSTRAINT "_Genes_B_fkey" FOREIGN KEY ("B") REFERENCES "Talent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_activeSkills" ADD CONSTRAINT "_activeSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_activeSkills" ADD CONSTRAINT "_activeSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToSession" ADD CONSTRAINT "_PokemonToSession_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToSession" ADD CONSTRAINT "_PokemonToSession_B_fkey" FOREIGN KEY ("B") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameRoomToPlayer" ADD CONSTRAINT "_GameRoomToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "GameRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameRoomToPlayer" ADD CONSTRAINT "_GameRoomToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pendent" ADD CONSTRAINT "_pendent_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pendent" ADD CONSTRAINT "_pendent_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fullfiled" ADD CONSTRAINT "_fullfiled_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fullfiled" ADD CONSTRAINT "_fullfiled_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
