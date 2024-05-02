export declare const skillsData: ({
    name: string;
    id: number;
    type: string;
    target: string;
    pp: number;
    class: string;
    power: null;
    statChanges: {
        change: number;
        stat: string;
    }[];
} | {
    name: string;
    id: number;
    type: string;
    target: string;
    pp: number;
    class: string;
    power: number;
    statChanges: {
        change: number;
        stat: string;
    }[];
} | {
    name: string;
    id: number;
    type: string;
    target: string;
    pp: null;
    class: string;
    power: number;
    statChanges: never[];
} | {
    name: string;
    id: number;
    type: string;
    target: string;
    pp: null;
    class: string;
    power: null;
    statChanges: never[];
})[];
