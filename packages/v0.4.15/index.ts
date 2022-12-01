import { compile } from "solc";

import { IInput } from "../../src/Interfaces/input.interface";

export const v0_4_15 = (_: string, input: IInput) => {
    const output = compile(input, 1);
    const contracts = output.contracts;
    const bytecode = Object.keys(contracts).reduce(
        (pre, key) => pre + contracts[key].bytecode,
        ""
    );

    return bytecode;
};
