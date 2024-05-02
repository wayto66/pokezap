export type ServerResponse = {
    status: number;
    message: string;
    data?: any;
    imageUrl?: string;
    actions?: string[];
    react?: string;
    afterMessage?: string;
    afterMessageActions?: string[];
    afterMessageDelay?: number;
    isAnimated?: boolean;
    preventDelete?: boolean;
};
