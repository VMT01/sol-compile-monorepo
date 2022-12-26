export interface IOldOutput {
    contracts: object;
    errors?: string[];
    sourceList: string[];
    sources: {
        [key: string]: {
            AST: {
                attributes: {
                    absolutePath: string;
                    exportedSymbols: object;
                    nodes: any[];
                };
                id: number;
                name: string;
                src: string;
            };
        };
    };
}

interface IError {
    component: string;
    errorCode: string;
    formattedMessage: string;
    message: string;
    severity: string;
    sourceLocation: { start: number; end: number; file: string };
    type: string;
}

export interface INewOutput {
    contracts?: {
        [key: string]: {
            [key: string]: {
                evm: {
                    bytecode: {
                        linkReferences: object;
                        object: string;
                        opcodes: string;
                        sourceMap: string;
                    };
                };
            };
        };
    };
    errors?: IError[];
    sources?: { [key: string]: { id: number } };
}

export type IOutput = IOldOutput | INewOutput;
