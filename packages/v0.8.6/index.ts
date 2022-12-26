import { IInput } from "src/types/input";
import { INewOutput } from "src/types/output";

import { bytecode, error } from "../../src/utils";

import { compile } from "solc";

export function v0_8_6(filename: string, input: IInput): string {
    global.compileOutput = JSON.parse(compile(JSON.stringify(input))) as INewOutput;
    if (global.compileOutput.errors) throw new Error(error());

    return bytecode(true, filename);
};