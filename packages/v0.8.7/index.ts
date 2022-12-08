import { compile } from "solc";

import { IInput } from "../../src/Interfaces/input.interface";

export const v0_8_7 = (filename: string, input: IInput) => {
    const output = JSON.parse(compile(JSON.stringify(input)));
    const contracts = output.contracts[filename];
    const bytecode = Object.keys(contracts).reduce(
        (pre, key) => pre + contracts[key].evm.bytecode.object,
        ""
    );

    return bytecode;
};
