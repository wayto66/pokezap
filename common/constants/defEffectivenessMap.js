"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defEffectivenessMap = void 0;
exports.defEffectivenessMap = new Map([
    [
        'normal',
        {
            innefective: [''],
            effective: ['fighting'],
            noDamage: ['ghost'],
        },
    ],
    [
        'fire',
        {
            innefective: ['grass', 'ice', 'bug', 'steel', 'fire', 'fairy'],
            effective: ['water', 'rock', 'ground'],
            noDamage: [''],
        },
    ],
    [
        'water',
        {
            innefective: ['fire', 'water', 'ice', 'steel'],
            effective: ['electric', 'grass'],
            noDamage: [''],
        },
    ],
    [
        'electric',
        {
            innefective: ['steel', 'electric', 'flying'],
            effective: ['ground'],
            noDamage: [''],
        },
    ],
    [
        'grass',
        {
            innefective: ['water', 'ground', 'electric', 'grass'],
            effective: ['fire', 'ice', 'poison', 'flying', 'bug'],
            noDamage: [''],
        },
    ],
    [
        'ice',
        {
            innefective: ['ice'],
            effective: ['fire', 'fighting', 'rock', 'steel'],
            noDamage: [''],
        },
    ],
    [
        'fighting',
        {
            innefective: ['bug', 'rock', 'dark'],
            effective: ['flying', 'psychic', 'fairy'],
            noDamage: [''],
        },
    ],
    [
        'poison',
        {
            innefective: ['grass', 'fairy', 'fighting', 'poison', 'bug'],
            effective: ['psychic', 'ground'],
            noDamage: [''],
        },
    ],
    [
        'ground',
        {
            innefective: ['poison', 'rock'],
            effective: ['grass', 'water', 'ice'],
            noDamage: ['electric'],
        },
    ],
    [
        'flying',
        {
            innefective: ['grass', 'fighting', 'bug'],
            effective: ['electric', 'rock', 'ice'],
            noDamage: ['ground'],
        },
    ],
    [
        'psychic',
        {
            innefective: ['fighting', 'psychic'],
            effective: ['bug', 'ghost', 'dark'],
            noDamage: [''],
        },
    ],
    [
        'bug',
        {
            innefective: ['grass', 'fighting', 'ground'],
            effective: ['fire', 'rock', 'flying'],
            noDamage: [''],
        },
    ],
    [
        'rock',
        {
            innefective: ['fire', 'normal', 'flying', 'poison'],
            effective: ['fighting', 'ground', 'steel', 'water', 'grass'],
            noDamage: [''],
        },
    ],
    [
        'ghost',
        {
            innefective: ['poison', 'bug'],
            effective: ['dark', 'ghost'],
            noDamage: ['normal', 'fighting'],
        },
    ],
    [
        'dragon',
        {
            innefective: ['grass', 'fire', 'electric', 'water'],
            effective: ['dragon', 'ice', 'fairy'],
            noDamage: [''],
        },
    ],
    [
        'dark',
        {
            innefective: ['dark', 'ghost'],
            effective: ['fighting', 'bug', 'fairy'],
            noDamage: ['psychic'],
        },
    ],
    [
        'steel',
        {
            innefective: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'dragon', 'steel', 'rock', 'fairy'],
            effective: ['fire', 'ground', 'fighting'],
            noDamage: ['poison'],
        },
    ],
    [
        'fairy',
        {
            innefective: ['fighting', 'bug', 'dark'],
            effective: ['poison', 'steel'],
            noDamage: ['dragon'],
        },
    ],
]);
