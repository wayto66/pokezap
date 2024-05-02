export interface IItem {
    id: number;
    holderId: number | null | undefined;
    ownerdId: number;
    type: string;
    name: string;
}
