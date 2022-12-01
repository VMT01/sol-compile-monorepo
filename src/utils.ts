import { resolve } from "path";
import * as semver from "semver";

import { outputDir, errorDir, versions } from "./constant.json";
import { IDetectVersion } from "./Interfaces/detectVersion.interface";
import { IInput, INewInput, IOldInput } from "./Interfaces/input.interface";

import {
    v0_4_11,
    v0_4_14,
    v0_4_15,
    v0_4_18,
    v0_4_19,
    v0_4_20,
    v0_4_23,
    v0_4_24,
    v0_4_25,
    v0_4_26,
    v0_5_16,
} from "../packages";

export function detectVersion(source: string): IDetectVersion {
    const detectPragma: string[] = [
        ...new Set(source.match(/pragma.solidity.*;/g)),
    ];
    const detectVersionRange: string = detectPragma
        .map((item: string) =>
            item.slice(16, item.indexOf("//")).replace(";", "").trim()
        )
        .join(" ");

    for (const version of versions) {
        if (semver.satisfies(version, detectVersionRange)) {
            return { avaiable: true, version };
        }
    }
    return { avaiable: false, version: detectVersionRange };
}

export const createOutputPath = (
    level: string[],
    filename: string,
    extension: string = "txt"
) => resolve(outputDir, ...level, filename + "." + extension);

export const createErrorPath = (
    level: string[],
    filename: string,
    extension: string = "txt"
) => resolve(errorDir, ...level, filename + "." + extension);

export const createInput = (
    filename: string,
    source: string,
    version: string
) => {
    let input: IInput;
    if (semver.lt(version, "0.5.0")) {
        input = {
            sources: {
                [filename]: source,
            },
        } as IOldInput;
    } else {
        input = {
            language: "Solidity",
            sources: {
                [filename]: { content: source },
            },
            settings: {
                outputSelection: {
                    "*": {
                        "*": ["evm.bytecode.object"],
                    },
                },
            },
        } as INewInput;
    }
    return input;
};

export const compile = (filename: string, version: string, input: IInput) => {
    try {
        switch (version) {
            case "0.4.11":
                return v0_4_11(filename, input);
            case "0.4.14":
                return v0_4_14(filename, input);
            case "0.4.15":
                return v0_4_15(filename, input);
            case "0.4.18":
                return v0_4_18(filename, input);
            case "0.4.19":
                return v0_4_19(filename, input);
            case "0.4.20":
                return v0_4_20(filename, input);
            case "0.4.23":
                return v0_4_23(filename, input);
            case "0.4.24":
                return v0_4_24(filename, input);
            case "0.4.25":
                return v0_4_25(filename, input);
            case "0.4.26":
                return v0_4_26(filename, input);
            case "0.5.16":
                return v0_5_16(filename, input);
            default:
                return null;
        }
    } catch (err: any) {
        return null;
    }
};
