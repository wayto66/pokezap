export interface IMessage {
    id: number;
    type: string;
    targets: any[];
    statusTrashed: boolean;
}
