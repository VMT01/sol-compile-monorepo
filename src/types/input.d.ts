export interface IOldInput {
    sources: {
        [key: string]: string;
    };
}

export interface INewInput {
    language: "Solidity";
    sources: { [key: string]: { content: string } };
    settings: { outputSelection: { "*": { "*": string[] } } };
}

export type IInput = IOldInput | INewInput;
