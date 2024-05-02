"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeEffectivenessMap = void 0;
exports.typeEffectivenessMap = new Map([
    [
        'normal',
        {
            effective: [''],
            ineffective: ['rock', 'steel'],
            noDamage: ['ghost'],
        },
    ],
    [
        'fire',
        {
            effective: ['grass', 'ice', 'bug', 'steel'],
            ineffective: ['fire', 'water', 'rock', 'dragon'],
            noDamage: [],
        },
    ],
    [
        'water',
        {
            effective: ['fire', 'ground', 'rock'],
            ineffective: ['water', 'grass', 'dragon'],
            noDamage: [],
        },
    ],
    [
        'electric',
        {
            effective: ['water', 'flying'],
            ineffective: ['electric', 'grass', 'dragon'],
            noDamage: ['ground'],
        },
    ],
    [
        'grass',
        {
            effective: ['water', 'ground', 'rock'],
            ineffective: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
            noDamage: [],
        },
    ],
    [
        'ice',
        {
            effective: ['grass', 'ground', 'flying', 'dragon'],
            ineffective: ['fire', 'water', 'ice', 'steel'],
            noDamage: [],
        },
    ],
    [
        'fighting',
        {
            effective: ['normal', 'ice', 'rock', 'dark', 'steel'],
            ineffective: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
            noDamage: ['ghost'],
        },
    ],
    [
        'poison',
        {
            effective: ['grass', 'fairy'],
            ineffective: ['poison', 'ground', 'rock', 'ghost'],
            noDamage: ['steel'],
        },
    ],
    [
        'ground',
        {
            effective: ['fire', 'electric', 'poison', 'rock', 'steel'],
            ineffective: ['grass', 'bug'],
            noDamage: ['flying'],
        },
    ],
    [
        'flying',
        {
            effective: ['grass', 'fighting', 'bug'],
            ineffective: ['electric', 'rock', 'steel'],
            noDamage: [],
        },
    ],
    [
        'psychic',
        {
            effective: ['fighting', 'poison'],
            ineffective: ['psychic', 'steel'],
            noDamage: ['dark'],
        },
    ],
    [
        'bug',
        {
            effective: ['grass', 'psychic', 'dark'],
            ineffective: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
            noDamage: [],
        },
    ],
    [
        'rock',
        {
            effective: ['fire', 'ice', 'flying', 'bug'],
            ineffective: ['fighting', 'ground', 'steel'],
            noDamage: [],
        },
    ],
    [
        'ghost',
        {
            effective: ['psychic', 'ghost'],
            ineffective: ['dark'],
            noDamage: ['normal'],
        },
    ],
    [
        'dragon',
        {
            effective: ['dragon'],
            ineffective: ['steel'],
            noDamage: ['fairy'],
        },
    ],
    [
        'dark',
        {
            effective: ['psychic', 'ghost'],
            ineffective: ['fighting', 'dark', 'fairy'],
            noDamage: [],
        },
    ],
    [
        'steel',
        {
            effective: ['ice', 'rock', 'fairy'],
            ineffective: ['fire', 'water', 'electric', 'steel'],
            noDamage: [],
        },
    ],
    [
        'fairy',
        {
            effective: ['fighting', 'dragon', 'dark'],
            ineffective: ['fire', 'poison', 'steel'],
            noDamage: [],
        },
    ],
]);
