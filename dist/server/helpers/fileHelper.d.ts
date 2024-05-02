import { TCanvas2D } from './canvasHelper';
export declare const saveFileOnDisk: (canvas2d: TCanvas2D) => Promise<string>;
export declare const removeFileFromDisk: (filepath: string, timestamp?: number) => void;
