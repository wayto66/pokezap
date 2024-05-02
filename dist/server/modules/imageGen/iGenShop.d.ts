import { BaseItem } from '@prisma/client';
type TParams = {
    items: BaseItem[];
};
export declare const iGenShop: (data: TParams) => Promise<string>;
export {};
