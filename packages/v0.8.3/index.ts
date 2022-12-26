import { IInput } from "src/types/input";
import { INewOutput } from "src/types/output";

import { bytecode, error } from "../../src/utils";

const solc = require("solc");

export function v0_8_3(filename: string, input: IInput): string {
    global.compileOutput = JSON.parse(solc.compile(JSON.stringify(input))) as INewOutput;
    if (global.compileOutput.errors) throw new Error(error());

    return bytecode(true, filename);
};