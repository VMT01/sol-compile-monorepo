import { IInput } from "src/types/input";
import { IOldOutput } from "src/types/output";

import { bytecode, error } from "../../src/utils";

import { compile } from "solc";

export function v0_4_14(_: string, input: IInput): string {
    global.compileOutput = compile(input, 1) as IOldOutput;
    if (global.compileOutput.errors) throw new Error(error(false));

    return bytecode();
}
