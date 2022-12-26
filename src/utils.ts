import * as semver from "semver";

import { IVersion } from "./types/version";
import { IInput, INewInput, IOldInput } from "./types/input";
import { IError } from "./types/output";

import { versions } from "../constant.json";
import compiler from "../packages";

let pragmaSet: Set<string> = new Set();
let pragmas: string[], pragma: string, optimizedPragma: string;
let range: string;
let version: string;
let index: number;

export function detectVersion(source: string, name?: string): IVersion {
    pragmaSet.clear();
    range = "";

    pragmas = source.match(/pragma.solidity.*;/g);
    if (pragmas === null) throw new Error("\tMissing pragma solidity")

    for (pragma of source.match(/pragma.solidity.*;/g)) {
        pragmaSet.add(pragma);
    }
    pragmas = [...pragmaSet];

    for (pragma of pragmas) {
        optimizedPragma = pragma
            .slice(16, pragma.indexOf("//"))
            .replace(";", "")
            .trim();
        range += optimizedPragma + " ";
    }

    for (version of versions) {
        if (semver.satisfies(version, range)) {
            return {
                available: true,
                version,
                isNew: !semver.lt(version, "0.5.0"),
            };
        }
    }
    return { available: false, version: range, isNew: undefined };
}

export function createInput(
    filename: string,
    source: string,
    version: IVersion
): IInput {
    return version.isNew
        ? ({
              language: "Solidity",
              sources: { [filename]: { content: source } },
              settings: {
                  outputSelection: { "*": { "*": ["evm.bytecode"] } },
              },
          } as INewInput)
        : ({ sources: { [filename]: source } } as IOldInput);
}

export function compile(
    filename: string,
    version: IVersion,
    input: IInput
): string {
    index = versions.indexOf(version.version);
    if (index === -1)
        throw new Error(`Version ${version.version} is not avaiable`);
    if (!compiler[index])
        throw new Error(`Compiler ${version.version} is not avaiable`);

    return compiler[index](filename, input);
}

export function error(isNew: boolean = true) {
    global.contractError = "";
    if (isNew) {
        for (index = 0; index < global.compileOutput.errors.length; index++) {
            global.contractErrorItem = global.compileOutput.errors[index] as IError;
            global.contractError += `\t${global.contractErrorItem.message}\n`;
        }
        return global.contractError;
    }

    for (index = 0; index < global.compileOutput.errors.length; index++) {
        global.contractErrorItem = global.compileOutput.errors[index] as string;
        global.contractError += `\t${global.contractErrorItem}\n`;
    }
    return global.contractError;
}

export function bytecode(isNew: boolean = false, filename?: string): string {
    return isNew ? 
        Object.keys(global.compileOutput.contracts[filename]).reduce((pre, key) => pre + global.compileOutput.contracts[filename][key].evm.bytecode.object, "") :
        Object.keys(global.compileOutput.contracts).reduce((pre, key) => pre + global.compileOutput.contracts[key].bytecode, "");
}