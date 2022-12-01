export interface IOldInput {
    sources: {
        [key: string]: string;
    };
}

export interface INewInput {
    language: string;
    sources: {
        [key: string]: { content: string };
    };
    settings: {
        outputSelection: {
            "*": {
                "*": string[];
            };
        };
    };
}

export type IInput = IOldInput | INewInput;
