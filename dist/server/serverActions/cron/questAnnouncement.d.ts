import { PrismaClient } from '@prisma/client';
import { Client } from 'whatsapp-web.js';
type TParams = {
    prismaClient: PrismaClient;
    zapClient: Client;
    needIncense?: boolean;
};
export declare const questAnnouncement: (data: TParams) => Promise<void>;
export {};
