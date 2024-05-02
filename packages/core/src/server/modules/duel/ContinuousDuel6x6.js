"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTalentPermission = exports.ContinuousDuel6x6 = void 0;
const iGenDuelX6Rounds_1 = require("../../../../../image-generator/src/iGenDuelX6Rounds");
const src_1 = __importDefault(require("../../../../../prisma-provider/src"));
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const logger_1 = require("../../../infra/logger");
const defEffectivenessMap_1 = require("../../constants/defEffectivenessMap");
const plateTypeMap_1 = require("../../constants/plateTypeMap");
const talentIdMap_1 = require("../../constants/talentIdMap");
const findKeyByValue_1 = require("../../helpers/findKeyByValue");
const getBestSkillSet_1 = require("../../helpers/getBestSkillSet");
const getTeamBonuses_1 = require("./getTeamBonuses");
const ContinuousDuel6x6 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { leftTeam, rightTeam } = data;
    const leftPlayerIds = leftTeam.map(poke => {
        if (!poke.ownerId)
            throw new AppErrors_1.UnexpectedError(`Owner id not found for #${poke.id} in duelNX1.`);
        return poke.ownerId;
    });
    const rightPlayerIds = rightTeam
        .map(poke => {
        if (!('ownerId' in poke))
            return NaN;
        if (!poke.ownerId && !data.wildBattle)
            throw new AppErrors_1.UnexpectedError(`Owner id not found for #${poke.id} in duelNX1.`);
        return Number(poke.ownerId);
    })
        .filter(id => id !== null && id !== undefined && !isNaN(id));
    const leftPlayersPokeTeamsData = yield src_1.default.player.findMany({
        where: {
            id: {
                in: leftPlayerIds,
            },
        },
        include: {
            teamPoke1: {
                include: {
                    baseData: true,
                },
            },
            teamPoke2: {
                include: {
                    baseData: true,
                },
            },
            teamPoke3: {
                include: {
                    baseData: true,
                },
            },
            teamPoke4: {
                include: {
                    baseData: true,
                },
            },
            teamPoke5: {
                include: {
                    baseData: true,
                },
            },
            teamPoke6: {
                include: {
                    baseData: true,
                },
            },
        },
    });
    const rightPlayersPokeTeamsData = rightPlayerIds.length > 0
        ? yield src_1.default.player.findMany({
            where: {
                id: {
                    in: rightPlayerIds,
                },
            },
            include: {
                teamPoke1: {
                    include: {
                        baseData: true,
                    },
                },
                teamPoke2: {
                    include: {
                        baseData: true,
                    },
                },
                teamPoke3: {
                    include: {
                        baseData: true,
                    },
                },
                teamPoke4: {
                    include: {
                        baseData: true,
                    },
                },
                teamPoke5: {
                    include: {
                        baseData: true,
                    },
                },
                teamPoke6: {
                    include: {
                        baseData: true,
                    },
                },
            },
        })
        : [];
    const leftPokesBonusesMap = new Map([]);
    const rightPokesBonusesMap = new Map([]);
    for (const poke of leftTeam) {
        const player = leftPlayersPokeTeamsData.find(player => player.id === poke.ownerId);
        if (!player)
            throw new AppErrors_1.UnexpectedError('player not found in duelNX1');
        leftPokesBonusesMap.set(poke.id, yield (0, getTeamBonuses_1.getTeamBonuses)({
            poke,
            team: [
                player.teamPoke1,
                player.teamPoke2,
                player.teamPoke3,
                player.teamPoke4,
                player.teamPoke5,
                player.teamPoke6,
            ],
        }));
    }
    if (!data.wildBattle)
        for (const poke of rightTeam) {
            if (!('ownerId' in poke))
                continue;
            const player = rightPlayersPokeTeamsData.find(player => player.id === poke.ownerId);
            if (!player)
                throw new AppErrors_1.UnexpectedError('player not found in duelNX1');
            rightPokesBonusesMap.set(poke.id, yield (0, getTeamBonuses_1.getTeamBonuses)({
                poke,
                team: [
                    player.teamPoke1,
                    player.teamPoke2,
                    player.teamPoke3,
                    player.teamPoke4,
                    player.teamPoke5,
                    player.teamPoke6,
                ],
            }));
        }
    const rightPokesSkillMap = new Map([]);
    const leftPokesSkillMap = new Map([]);
    for (const poke of leftTeam) {
        leftPokesSkillMap.set(poke.id, yield getBestSkills({
            attacker: poke,
            defenders: rightTeam,
        }));
    }
    for (const poke of rightTeam) {
        rightPokesSkillMap.set(poke.id, yield getBestSkills({
            attacker: poke,
            defenders: leftTeam,
        }));
    }
    const leftTeamData = [];
    const rightTeamData = [];
    for (const poke of leftTeam) {
        if (!poke.ownerId)
            throw new AppErrors_1.UnexpectedError(`Owner id not found for #${poke.id} in duelNX1.`);
        const pokeSkill = leftPokesSkillMap.get(poke.id);
        const pokeBonusData = leftPokesBonusesMap.get(poke.id);
        const roleBonuses = {
            damage: 0,
            defense: 0,
            support: 0,
        };
        if (poke.role === 'TANKER')
            roleBonuses.defense = 0.1;
        if (poke.role === 'DAMAGE')
            roleBonuses.damage = 0.1;
        if (poke.role === 'SUPPORT')
            roleBonuses.support = 0.1;
        leftTeamData.push({
            name: poke.baseData.name,
            id: poke.id,
            pokemonBaseData: poke,
            ownerId: poke.ownerId,
            heldItemName: ((_a = poke.heldItem) === null || _a === void 0 ? void 0 : _a.baseItem.name) || undefined,
            team: 'left',
            role: (_b = poke.role) !== null && _b !== void 0 ? _b : 'DAMAGE',
            spriteUrl: poke.spriteUrl,
            type1: poke.baseData.type1Name,
            type2: poke.baseData.type2Name,
            level: poke.level,
            maxHp: 6 * poke.hp,
            isGiant: poke.isGiant,
            hp: 6 * poke.hp,
            atk: poke.atk,
            spAtk: poke.spAtk,
            def: poke.def,
            spDef: poke.spDef,
            damageResistance: (((_c = poke.heldItem) === null || _c === void 0 ? void 0 : _c.baseItem.name) === 'x-defense' ? 0.15 : 0) + roleBonuses.defense,
            damageAmplifying: roleBonuses.damage,
            speed: poke.speed,
            skillMap: pokeSkill,
            crit: false,
            block: false,
            mana: 0,
            roleBonusDamage: roleBonuses.damage,
            manaBonus: (pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.manaBonus) || 0,
            lifeSteal: (pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.lifeSteal) || 0,
            critChance: (pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.critChance) || 0,
            blockChance: (pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.blockChance) || 0,
            crescentBonuses: pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.crescentBonuses,
            statusCleanseChance: pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.statusCleanseChance,
            healingBonus: pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.healingBonus,
            buffBonus: pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.buffBonus,
            totalDamageDealt: 0,
            totalHealing: 0,
            totalDamageReceived: 0,
            buffData: {
                atk: 0,
                spAtk: 0,
                def: 0,
                spDef: 0,
            },
        });
    }
    for (const poke of rightTeam) {
        const pokeSkill = rightPokesSkillMap.get(poke.id);
        const pokeBonusData = rightPokesBonusesMap.get(poke.id);
        const roleBonuses = {
            damage: 0,
            defense: 0,
            support: 0,
        };
        if ('role' in poke && poke.role === 'TANKER')
            roleBonuses.defense = 0.1;
        if ('role' in poke && poke.role === 'DAMAGE')
            roleBonuses.damage = 0.1;
        if ('role' in poke && poke.role === 'SUPPORT')
            roleBonuses.support = 0.1;
        rightTeamData.push({
            name: poke.baseData.name,
            pokemonBaseData: poke,
            id: poke.id,
            ownerId: 'ownerId' in poke ? poke.ownerId : undefined,
            heldItemName: ((_d = poke.heldItem) === null || _d === void 0 ? void 0 : _d.baseItem.name) || undefined,
            team: 'right',
            role: 'role' in poke && poke.role ? poke.role : 'DAMAGE',
            spriteUrl: poke.spriteUrl,
            type1: poke.baseData.type1Name,
            type2: poke.baseData.type2Name,
            level: poke.level,
            isGiant: 'isGiant' in poke && poke.isGiant,
            maxHp: 6 * poke.hp,
            hp: 6 * poke.hp,
            atk: poke.atk,
            spAtk: poke.spAtk,
            def: poke.def,
            spDef: poke.spDef,
            damageResistance: (((_e = poke.heldItem) === null || _e === void 0 ? void 0 : _e.baseItem.name) === 'x-defense' ? 0.15 : 0) + roleBonuses.defense,
            damageAmplifying: roleBonuses.damage,
            speed: poke.speed,
            skillMap: pokeSkill,
            crit: false,
            block: false,
            mana: 0,
            roleBonusDamage: roleBonuses.damage,
            manaBonus: (pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.manaBonus) || 0,
            lifeSteal: (pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.lifeSteal) || 0,
            critChance: (pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.critChance) || 0,
            blockChance: (pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.blockChance) || 0,
            crescentBonuses: pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.crescentBonuses,
            statusCleanseChance: pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.statusCleanseChance,
            healingBonus: pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.healingBonus,
            buffBonus: pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.buffBonus,
            totalDamageDealt: 0,
            totalHealing: 0,
            totalDamageReceived: 0,
            buffData: {
                atk: 0,
                spAtk: 0,
                def: 0,
                spDef: 0,
            },
        });
    }
    const duelMap = new Map([]);
    let duelFinished = false;
    const isDraw = false;
    let roundCount = 1;
    let winnerTeam = [];
    let loserTeam = [];
    let winnerSide;
    duelMap.set(1, {
        leftTeamData: [...leftTeamData],
        rightTeamData: [...rightTeamData],
    });
    const defeatedPokemonsIds = [];
    let pokemonsInDuelOrder = [rightTeamData[0], rightTeamData[1], leftTeamData[0], leftTeamData[1]]
        .flat()
        .sort((a, b) => b.speed - a.speed);
    let nextAliveLeftPokemonIndex = 2;
    let nextAliveRightPokemonIndex = 2;
    while (duelFinished === false) {
        roundCount++;
        console.log({
            currentPokes: pokemonsInDuelOrder.map(p => {
                return {
                    name: p.name,
                    team: p.team,
                };
            }),
        });
        const roundStart = (poke) => {
            if (poke.hp <= 0) {
                pokemonsInDuelOrder = pokemonsInDuelOrder.filter(p => p.id !== poke.id).filter(p => p !== undefined);
                if (poke.team === 'left') {
                    if (nextAliveLeftPokemonIndex >= 7) {
                        console.log('right team wins');
                        winnerTeam = rightTeamData;
                        loserTeam = leftTeamData;
                        winnerSide = 'right';
                        duelFinished = true;
                    }
                    const nextPoke = leftTeamData[nextAliveLeftPokemonIndex];
                    if (nextPoke)
                        pokemonsInDuelOrder.push(nextPoke);
                    nextAliveLeftPokemonIndex++;
                }
                else {
                    if (nextAliveRightPokemonIndex >= 7) {
                        console.log('left team wins');
                        winnerTeam = leftTeamData;
                        loserTeam = rightTeamData;
                        winnerSide = 'left';
                        duelFinished = true;
                    }
                    const nextPoke = rightTeamData[nextAliveRightPokemonIndex];
                    if (nextPoke)
                        pokemonsInDuelOrder.push(nextPoke);
                    nextAliveRightPokemonIndex++;
                }
                if (data.returnOnlyPlayerPokemonDefeatedIds) {
                    if (!poke.ownerId)
                        return;
                }
                defeatedPokemonsIds.push(poke.id);
                return;
            }
            poke.crit = false;
            poke.block = false;
            if (poke.crescentBonuses) {
                if (poke.crescentBonuses.block)
                    poke.blockChance = Math.min(poke.crescentBonuses.block * roundCount, 0.2);
            }
            if (poke.mana < 100)
                poke.mana += 23 * (0.7 + Math.random() * 0.6) + poke.manaBonus;
            if (poke.mana > 100)
                poke.mana = 100;
            poke.crit = Math.random() + poke.critChance > 0.93;
            poke.block = Math.random() + poke.blockChance > 0.93;
            if (!poke.crit && poke.mana >= 100) {
                poke.crit = true;
                poke.mana = 0;
            }
        };
        for (const poke of pokemonsInDuelOrder)
            roundStart(poke);
        const getCurrentSkillForDamageRole = (attacker, enemies) => {
            var _a;
            const skillSelectionMap = new Map([]);
            if (!attacker.skillMap) {
                logger_1.logger.error(`no skill map for ${attacker.name}`);
                return undefined;
            }
            for (const [skill, skillMap] of attacker.skillMap.damageSkills) {
                if (['selected-pokemon', 'random-oponent', 'selected-pokemon-me-first'].includes(skill.target)) {
                    for (const enemy of enemies) {
                        skillSelectionMap.set(skill, { pwr: (_a = skillMap.get(enemy.name)) !== null && _a !== void 0 ? _a : 0, targets: [enemy] });
                    }
                }
                if (['all-other-pokemon', 'all-oponents'].includes(skill.target)) {
                    const totalDamage = enemies.reduce((accumulator, pokemon) => {
                        var _a;
                        return accumulator + ((_a = skillMap.get(pokemon.name)) !== null && _a !== void 0 ? _a : 0);
                    }, 0);
                    skillSelectionMap.set(skill, { pwr: totalDamage, targets: enemies });
                }
            }
            let bestSkill = {
                skill: undefined,
                pwr: 0,
                targets: [],
            };
            for (const [skill, attackData] of skillSelectionMap) {
                if (attackData.pwr > bestSkill.pwr) {
                    bestSkill = {
                        skill,
                        pwr: attackData.pwr,
                        targets: attackData.targets,
                    };
                }
            }
            return bestSkill;
        };
        const dealDamage = (attacker, enemies) => {
            var _a;
            if (!enemies) {
                logger_1.logger.error('no enemies found in round ' + roundCount);
                return;
            }
            const currentSkillData = getCurrentSkillForDamageRole(attacker, enemies);
            if (!currentSkillData || !currentSkillData.skill) {
                return;
            }
            if ((_a = attacker.crescentBonuses) === null || _a === void 0 ? void 0 : _a.damage)
                currentSkillData.pwr = currentSkillData.pwr * attacker.crescentBonuses.damage * roundCount;
            attacker.currentSkillName = currentSkillData.skill.name;
            attacker.currentSkillType = currentSkillData.skill.typeName;
            attacker.currentSkillPower = currentSkillData.pwr;
            attacker.currentSkillPP = currentSkillData.skill.pp;
            currentSkillData.skill.pp -= 1;
            for (const target of currentSkillData.targets) {
                const adratio = adRatio(currentSkillData.skill, attacker, target);
                const pwrWithADRatio = attacker.currentSkillPower * adratio * (1 + attacker.damageAmplifying);
                const pwrDividedByTargets = pwrWithADRatio / currentSkillData.targets.length;
                if (!target.block) {
                    target.hp -= pwrDividedByTargets * (0.9 + Math.random() * 0.2) * (1 - target.damageResistance);
                    attacker.hp += pwrDividedByTargets * attacker.lifeSteal * (1 - target.damageResistance);
                    attacker.totalDamageDealt += pwrDividedByTargets * (0.9 + Math.random() * 0.2) * (1 - target.damageResistance);
                }
                if (attacker.crit) {
                    if (!target.block) {
                        target.hp -= pwrDividedByTargets * (0.9 + Math.random() * 0.2) * 0.5 * (1 - target.damageResistance);
                        attacker.hp += pwrDividedByTargets * attacker.lifeSteal * 0.5 * (1 - target.damageResistance);
                        attacker.totalDamageDealt +=
                            pwrDividedByTargets * (0.9 + Math.random() * 0.2) * 0.5 * (1 - target.damageResistance);
                    }
                }
                if (attacker.hp > attacker.maxHp)
                    attacker.hp = attacker.maxHp;
            }
        };
        const getEnemyTargets = (enemies) => {
            const aliveTargets = enemies.filter(poke => poke.hp > 0);
            const aliveDefenders = aliveTargets.filter(t => t.role === 'TANKER' && t.hp > 0);
            if (aliveDefenders.length > 0)
                return aliveDefenders;
            return aliveTargets;
        };
        const getCurrentSkillForSupportRole = (pokemon, allies) => {
            var _a;
            let suggestedSkillCategory = 'net-good-stats';
            const lowHpAllies = allies.filter(p => p.hp < p.maxHp * 0.67);
            lowHpAllies.sort((a, b) => a.hp - b.hp);
            if (lowHpAllies.length > 0)
                suggestedSkillCategory = 'heal';
            const skills = (_a = pokemon.skillMap) === null || _a === void 0 ? void 0 : _a.supportSkills;
            if (!skills) {
                return undefined;
            }
            const healingSkills = skills.filter(s => s.category === 'heal');
            const buffSkills = skills.filter(s => s.category === 'net-good-stats');
            if (suggestedSkillCategory === 'heal' && healingSkills.length > 0) {
                return {
                    skill: healingSkills[0],
                    targets: [lowHpAllies[0]],
                };
            }
            if (buffSkills.length > 0) {
                // try to buff the tanker def/spdef
                const tankers = allies.filter(p => p.role === 'TANKER');
                const defensiveBuffSkills = buffSkills.filter(s => ['defense', 'special-defense'].includes(s.statChangeName));
                const defensiveBuffSkill = defensiveBuffSkills[Math.floor(Math.random() * defensiveBuffSkills.length)];
                const offensiveBuffSkills = buffSkills.filter(s => ['attack', 'special-attack'].includes(s.statChangeName));
                const offensiveBuffSkill = offensiveBuffSkills[Math.floor(Math.random() * offensiveBuffSkills.length)];
                const getOffensiveBuffTargets = (skill, allies) => {
                    if (['selected-pokemon', 'ally'].includes(skill.target)) {
                        const damagers = allies.filter(p => p.role === 'DAMAGE');
                        if (damagers.length > 0)
                            return [damagers[Math.floor(Math.random() * damagers.length)]];
                        return [allies[Math.floor(Math.random() * allies.length)]];
                    }
                    if (skill.target === 'user-and-allies')
                        return allies;
                    return [];
                };
                const getDeffensiveBuffTargets = (skill, allies) => {
                    if (['selected-pokemon', 'ally'].includes(skill.target)) {
                        const tankers = allies.filter(p => p.role === 'TANKER');
                        if (tankers.length > 0)
                            return [tankers[Math.floor(Math.random() * tankers.length)]];
                        return [allies[Math.floor(Math.random() * allies.length)]];
                    }
                    if (skill.target === 'user-and-allies')
                        return allies;
                    return [];
                };
                if (tankers.length > 0 && defensiveBuffSkills.length > 0) {
                    const skill = defensiveBuffSkill;
                    return {
                        skill,
                        targets: getDeffensiveBuffTargets(skill, allies),
                    };
                }
                if (offensiveBuffSkill) {
                    const skill = offensiveBuffSkill;
                    return {
                        skill,
                        targets: getOffensiveBuffTargets(offensiveBuffSkill, allies),
                    };
                }
            }
            return undefined;
        };
        const support = (pokemon, allies) => __awaiter(void 0, void 0, void 0, function* () {
            if (!allies) {
                logger_1.logger.error(`No allies found in round ${roundCount} for ${pokemon.name}`);
                return;
            }
            const currentSkillData = getCurrentSkillForSupportRole(pokemon, allies);
            if (!currentSkillData || !currentSkillData.skill) {
                handleRoundActions({
                    poke: pokemon,
                    forceAttack: true,
                });
                return;
            }
            pokemon.currentSkillName = currentSkillData.skill.name;
            pokemon.currentSkillType = currentSkillData.skill.typeName;
            pokemon.currentSkillPower = 0;
            pokemon.currentSkillPP = currentSkillData.skill.pp;
            currentSkillData.skill.pp -= 1;
            if (currentSkillData.skill.category === 'heal') {
                const talentData = yield (0, exports.verifyTalentPermission)(pokemon.pokemonBaseData, currentSkillData.skill);
                const talentBonus = talentData.count * 0.04;
                const healingPower = currentSkillData.skill.healing +
                    Math.pow((4 * (pokemon.spAtk / 200)), 4.15) *
                        getHeldItemMultiplier(pokemon.pokemonBaseData, currentSkillData.skill, 'x-acuraccy') *
                        (1 + talentBonus);
                for (const target of currentSkillData.targets) {
                    if (target.hp > 0)
                        target.hp += healingPower;
                    pokemon.totalHealing += healingPower;
                }
            }
            if (currentSkillData.skill.category === 'net-good-stats') {
                const talentData = yield (0, exports.verifyTalentPermission)(pokemon.pokemonBaseData, currentSkillData.skill);
                const talentBonus = talentData.count * 0.06;
                const nameFixMap = new Map([
                    ['attack', 'atk'],
                    ['defense', 'def'],
                    ['special-attack', 'spAtk'],
                    ['special-defense', 'spDef'],
                ]);
                const statName = nameFixMap.get(currentSkillData.skill.statChangeName);
                if (!statName) {
                    logger_1.logger.error(`failed to find statname for ${currentSkillData.skill.statChangeName}`);
                    return;
                }
                const statChangePower = currentSkillData.skill.statChangeAmount * 0.05 * (1 + talentBonus) * (1 + pokemon.spAtk / 2000);
                for (const target of currentSkillData.targets) {
                    if (target.hp <= 0)
                        continue;
                    target[statName] += target[statName] * statChangePower;
                    pokemon.buffData[statName] += target[statName] * (1 - statChangePower);
                }
            }
        });
        const getCurrentSkillForTankerRole = (pokemon, allies, enemies) => {
            var _a;
            const skills = (_a = pokemon.skillMap) === null || _a === void 0 ? void 0 : _a.tankerSkills;
            if (!skills || skills.length === 0) {
                handleRoundActions({
                    poke: pokemon,
                    forceAttack: true,
                });
                return;
            }
            const skill = skills[Math.floor(Math.random() * skills.length)];
            let targets = [];
            if (skill.target === 'user')
                targets = [pokemon];
            if (skill.target === 'user-and-allies')
                targets = allies;
            if (skill.target === 'selected-pokemon' && skill.category.includes('damage'))
                targets = [enemies[0]];
            if (skill.target === 'all-oponents' && skill.category.includes('damage'))
                targets = enemies;
            if (targets.length === 0) {
                logger_1.logger.error('no targets for: ' + skill.name);
                return undefined;
            }
            return {
                skill,
                targets,
            };
        };
        const tank = (pokemon, allies, enemies) => __awaiter(void 0, void 0, void 0, function* () {
            var _f;
            if (!allies) {
                logger_1.logger.error(`No allies found in round ${roundCount} for ${pokemon.name} in tank`);
                return;
            }
            if (!enemies) {
                logger_1.logger.error(`No enemies found in round ${roundCount} for ${pokemon.name} in tank`);
                return;
            }
            const currentSkillData = getCurrentSkillForTankerRole(pokemon, allies, enemies);
            if (!currentSkillData || !currentSkillData.skill) {
                handleRoundActions({
                    poke: pokemon,
                    forceAttack: true,
                });
                return;
            }
            pokemon.currentSkillName = currentSkillData.skill.name;
            pokemon.currentSkillType = currentSkillData.skill.typeName;
            pokemon.currentSkillPower = currentSkillData.skill.attackPower;
            pokemon.currentSkillPP = currentSkillData.skill.pp;
            currentSkillData.skill.pp -= 1;
            if (currentSkillData.skill.category === 'damage+heal') {
                for (const target of currentSkillData.targets) {
                    const pwrWithADRatio = (((_f = pokemon.currentSkillPower) !== null && _f !== void 0 ? _f : 0) * adRatio(currentSkillData.skill, pokemon, target)) / 50;
                    const pwrDividedByTargets = pwrWithADRatio / currentSkillData.targets.length;
                    if (!target.block) {
                        target.hp -= pwrDividedByTargets * (0.9 + Math.random() * 0.2) * (1 - target.damageResistance);
                        pokemon.hp +=
                            pwrDividedByTargets *
                                pokemon.lifeSteal *
                                (1 - target.damageResistance) *
                                (1 + currentSkillData.skill.drain / 100);
                        pokemon.totalDamageDealt +=
                            pwrDividedByTargets * (0.9 + Math.random() * 0.2) * (1 - target.damageResistance);
                    }
                    if (pokemon.crit) {
                        if (!target.block) {
                            target.hp -= pwrDividedByTargets * (0.9 + Math.random() * 0.2) * 0.5 * (1 - target.damageResistance);
                            pokemon.hp +=
                                pwrDividedByTargets *
                                    pokemon.lifeSteal *
                                    0.5 *
                                    (1 - target.damageResistance) *
                                    (1 + currentSkillData.skill.drain / 100);
                            pokemon.totalDamageDealt +=
                                pwrDividedByTargets * (0.9 + Math.random() * 0.2) * 0.5 * (1 - target.damageResistance);
                        }
                    }
                    if (pokemon.hp > pokemon.maxHp)
                        pokemon.hp = pokemon.maxHp;
                }
            }
            if (currentSkillData.skill.category === 'net-good-stats') {
                const talentData = yield (0, exports.verifyTalentPermission)(pokemon.pokemonBaseData, currentSkillData.skill);
                const talentBonus = talentData.count * 0.06;
                const nameFixMap = new Map([
                    ['attack', 'atk'],
                    ['defense', 'def'],
                    ['special-attack', 'spAtk'],
                    ['special-defense', 'spDef'],
                ]);
                const statName = nameFixMap.get(currentSkillData.skill.statChangeName);
                if (!statName) {
                    logger_1.logger.error(`failed to find statname for ${currentSkillData.skill.statChangeName}`);
                    return;
                }
                const statChangePower = currentSkillData.skill.statChangeAmount * 0.05 * (1 + talentBonus) * (1 + pokemon.spAtk / 2000);
                for (const target of currentSkillData.targets) {
                    target[statName] += target[statName] * statChangePower;
                    pokemon.buffData[statName] += target[statName] * (1 - statChangePower);
                }
            }
        });
        const handleRoundActions = (_g) => __awaiter(void 0, [_g], void 0, function* ({ poke, forceAttack }) {
            var _h;
            if ((_h = !poke) !== null && _h !== void 0 ? _h : poke.hp <= 0)
                return;
            const currentLeftTeam = pokemonsInDuelOrder.filter(p => p.team === 'left');
            const currentRightTeam = pokemonsInDuelOrder.filter(p => p.team === 'right');
            const team = poke.team === 'right' ? currentRightTeam : currentLeftTeam;
            const aliveTeam = team.filter(p => p.hp > 0);
            const targets = poke.team === 'right' ? getEnemyTargets(currentLeftTeam) : getEnemyTargets(currentRightTeam);
            if (forceAttack) {
                dealDamage(poke, targets);
                return;
            }
            if ('role' in poke && poke.role === 'SUPPORT') {
                if (aliveTeam.every(p => p.role === 'SUPPORT') ||
                    aliveTeam.filter(p => ['DAMAGE', 'TANKER'].includes(p.role)).length === 0) {
                    dealDamage(poke, targets);
                    return;
                }
                yield support(poke, aliveTeam);
                return;
            }
            if ('role' in poke && poke.role === 'TANKER') {
                if (aliveTeam.every(p => p.role === 'TANKER') ||
                    aliveTeam.filter(p => ['DAMAGE'].includes(p.role)).length === 0) {
                    dealDamage(poke, targets);
                    return;
                }
                yield tank(poke, team, targets);
                return;
            }
            dealDamage(poke, targets);
        });
        for (const poke of pokemonsInDuelOrder) {
            if (!poke)
                continue;
            handleRoundActions({
                poke,
            });
        }
        const leftTeamRoundData = [];
        const rightTeamRoundData = [];
        for (const poke of pokemonsInDuelOrder) {
            if (!poke)
                continue;
            if (poke.team === 'left')
                leftTeamRoundData.push(Object.assign({}, poke));
            else
                rightTeamRoundData.push(Object.assign({}, poke));
        }
        duelMap.set(roundCount, {
            leftTeamData: [...leftTeamRoundData],
            rightTeamData: [...rightTeamRoundData],
        });
        if (roundCount > 360) {
            throw new AppErrors_1.UnexpectedError('duel exceeded 360 rounds.');
        }
    }
    if (!winnerTeam || !loserTeam)
        throw new AppErrors_1.UnexpectedError('Time vencedor/perdedor do duelo não foi determinado');
    if (!winnerSide || !['right', 'left'].includes(winnerSide)) {
        throw new AppErrors_1.UnexpectedError('Índice do time vencedor/perdedor do duelo não foi determinado');
    }
    console.log({
        winner: winnerSide,
        winnerTeam: winnerTeam.map(p => {
            return {
                name: p.name,
                hp: p.hp,
            };
        }),
        loserTeam: loserTeam.map(p => {
            return {
                name: p.name,
                hp: p.hp,
            };
        }),
    });
    const imageUrl = yield (0, iGenDuelX6Rounds_1.iGenDuelX6Rounds)({
        duelMap: duelMap,
        roundCount,
        leftTeam: leftTeamData,
        rightTeam: rightTeamData,
        winnerSide,
        staticImage: data.staticImage,
        backgroundTypeName: data.backgroundTypeName,
    });
    console.log('finished: ' + imageUrl);
    const damageDealtMessage = `
  ${[...leftTeamData]
        .map(p => {
        return `*${p.id}-${p.name}* causou ${p.totalDamageDealt.toFixed(0)} de dano.`;
    })
        .filter((m) => m.length > 0)
        .join('\n')}
  
  ${[...leftTeamData]
        .map(p => {
        if (p.totalHealing > 0)
            return `*${p.name}* curou ${p.totalHealing.toFixed(0)}.`;
        return '';
    })
        .filter((m) => m.length > 0)
        .join('\n')}
  
  ${[...leftTeamData]
        .map(p => {
        const messages = [];
        for (const key in p.buffData) {
            if (p.buffData[key] > 0) {
                messages.push(`*${p.name}* aumentou a ${key} de seu time em ${p.buffData[key]}.`);
            }
        }
        return messages.join('\n');
    })
        .filter((m) => m.length > 5)
        .join('\n')}
  `;
    return {
        message: `DUELO X2`,
        isDraw: isDraw,
        winnerTeam: winnerTeam,
        loserTeam: loserTeam,
        imageUrl,
        defeatedPokemonsIds,
        damageDealtMessage,
    };
});
exports.ContinuousDuel6x6 = ContinuousDuel6x6;
const getBestTypes = (defenders) => {
    const efDatas = [];
    for (const defender of defenders) {
        const efDataOfType1 = defEffectivenessMap_1.defEffectivenessMap.get(defender.baseData.type1Name);
        if (efDataOfType1)
            efDatas.push(efDataOfType1);
        if (defender.baseData.type2Name) {
            const efDataOfType2 = defEffectivenessMap_1.defEffectivenessMap.get(defender.baseData.type2Name);
            if (efDataOfType2)
                efDatas.push(efDataOfType2);
        }
    }
    if (efDatas.length === 0)
        throw new AppErrors_1.UnexpectedError('efData object could not be created.');
    const typeScoreObj = {
        normal: 0,
        fire: 0,
        water: 0,
        electric: 0,
        grass: 0,
        ice: 0,
        fighting: 0,
        poison: 0,
        ground: 0,
        flying: 0,
        psychic: 0,
        bug: 0,
        rock: 0,
        ghost: 0,
        dragon: 0,
        dark: 0,
        steel: 0,
        fairy: 0,
    };
    for (const efData of efDatas) {
        for (const type of efData.effective) {
            if (type === '')
                continue;
            typeScoreObj[type] += 1;
        }
        for (const type of efData.innefective) {
            if (type === '')
                continue;
            typeScoreObj[type] -= 1;
        }
        for (const type of efData.noDamage) {
            if (type === '')
                continue;
            typeScoreObj[type] -= 2;
        }
    }
    delete typeScoreObj[''];
    delete typeScoreObj[' '];
    const typeScoreObjEntries = Object.entries(typeScoreObj);
    return {
        best: typeScoreObjEntries.filter(entry => entry[1] >= defenders.length * 1).map(entry => entry[0]),
        good: typeScoreObjEntries.filter(entry => entry[1] >= defenders.length * 0.5).map(entry => entry[0]),
        neutral: typeScoreObjEntries.filter(entry => entry[1] === 0).map(entry => entry[0]),
        bad: typeScoreObjEntries.filter(entry => entry[1] <= defenders.length * -0.5).map(entry => entry[0]),
        worse: typeScoreObjEntries.filter(entry => entry[1] <= defenders.length * -1).map(entry => entry[0]),
    };
};
const getBestSkills = (_j) => __awaiter(void 0, [_j], void 0, function* ({ attacker, defenders }) {
    const efData = getBestTypes(defenders);
    const skills = attacker.baseData.skills;
    const skillTable = attacker.baseData.skillTable;
    const learnedSkills = [];
    for (const skill of skillTable) {
        const split = skill.split('%');
        if (Number(split[1]) <= attacker.level) {
            learnedSkills.push(split[0]);
            continue;
        }
    }
    const finalSkillMap = [];
    for (const skill of skills) {
        if (!learnedSkills.includes(skill.name)) {
            continue;
        }
        const talentCheck = yield (0, exports.verifyTalentPermission)(attacker, skill);
        if (!talentCheck.permit) {
            continue;
        }
        const stab = () => {
            if (attacker.baseData.type1Name === skill.typeName)
                return 1.025;
            if (attacker.baseData.type2Name === skill.typeName)
                return 1.025;
            return 1;
        };
        const talentBonus = 0.06 * talentCheck.count;
        const getEffectivenessMultiplier = () => {
            if (efData.best.includes(skill.typeName))
                return 2.25;
            if (efData.good.includes(skill.typeName))
                return 1.55;
            if (efData.neutral.includes(skill.typeName))
                return 1;
            if (efData.bad.includes(skill.typeName))
                return 0.65;
            if (efData.worse.includes(skill.typeName))
                return 0.35;
            return 1;
        };
        const power = skill.attackPower *
            getEffectivenessMultiplier() *
            stab() *
            (1 + talentBonus) *
            getHeldItemMultiplier(attacker, skill, 'x-attack');
        finalSkillMap.push([power, skill]);
    }
    return (0, getBestSkillSet_1.getBestSkillSet)(finalSkillMap, attacker, defenders);
});
const verifyTalentPermission = (poke, skill) => __awaiter(void 0, void 0, void 0, function* () {
    const talents = [
        poke.talentId1,
        poke.talentId2,
        poke.talentId3,
        poke.talentId4,
        poke.talentId5,
        poke.talentId6,
        poke.talentId7,
        poke.talentId8,
        poke.talentId9,
    ];
    const typeId = (0, findKeyByValue_1.findKeyByValue)(talentIdMap_1.talentIdMap, skill.typeName);
    const count = talents.reduce((count, current) => count + (current === typeId ? 1 : 0), 0);
    if (count >= 3 ||
        (count >= 2 && skill.attackPower <= 75) ||
        (count === 1 && skill.attackPower <= 40) ||
        (skill.typeName === 'normal' && skill.attackPower <= 50) ||
        poke.baseData.type1Name === skill.typeName ||
        poke.baseData.type2Name === skill.typeName)
        return {
            permit: true,
            count,
        };
    return {
        permit: false,
        count,
    };
});
exports.verifyTalentPermission = verifyTalentPermission;
const getHeldItemMultiplier = (pokemon, skill, xItemName) => {
    var _a, _b, _c, _d, _e, _f;
    if (((_a = pokemon.heldItem) === null || _a === void 0 ? void 0 : _a.baseItem.name) && plateTypeMap_1.plateTypeMap.get((_b = pokemon.heldItem) === null || _b === void 0 ? void 0 : _b.baseItem.name) === skill.typeName)
        return 1.07;
    if (((_c = pokemon.heldItem) === null || _c === void 0 ? void 0 : _c.baseItem.name) && ((_d = pokemon.heldItem) === null || _d === void 0 ? void 0 : _d.baseItem.name) === skill.typeName + '-gem')
        return 1.15;
    if (((_e = pokemon.heldItem) === null || _e === void 0 ? void 0 : _e.baseItem.name) && ((_f = pokemon.heldItem) === null || _f === void 0 ? void 0 : _f.baseItem.name) === xItemName)
        return 1.11;
    return 1;
};
const adRatio = (skill, attacker, defender) => {
    if (skill.isPhysical)
        return attacker.atk / defender.def;
    return attacker.spAtk / defender.spDef;
};
