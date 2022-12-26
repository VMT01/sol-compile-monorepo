import { IError, IOutput } from "./output";

declare global {
    var compileOutput: IOutput;
    var contractBytecode: string;
    var contractErrorItem: IError | string;
    var contractError: string;
}

export {};
