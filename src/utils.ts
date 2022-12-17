import { resolve } from "path";
import * as semver from "semver";

import { outputDir, errorDir, convertDir, versions } from "./constant.json";
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
    v0_5_0,
    v0_5_2,
    v0_5_3,
    v0_5_6,
    v0_5_7,
    v0_5_8,
    v0_5_9,
    v0_5_10,
    v0_5_11,
    v0_5_12,
    v0_5_13,
    v0_5_14,
    v0_5_15,
    v0_5_16,
    v0_5_17,
    v0_6_0,
    v0_6_1,
    v0_6_2,
    v0_6_4,
    v0_6_6,
    v0_6_7,
    v0_6_8,
    v0_6_9,
    v0_6_10,
    v0_6_11,
    v0_6_12,
    v0_7_0,
    v0_7_3,
    v0_7_4,
    v0_7_5,
    v0_7_6,
    v0_8_0,
    v0_8_1,
    v0_8_2,
    v0_8_3,
    v0_8_4,
    v0_8_5,
    v0_8_6,
    v0_8_7,
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

export const createConvertPath = (
    level: string[],
    filename: string,
    extension: string = "txt"
) => resolve(convertDir, ...level, filename + "." + extension);

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
            case "0.5.0":
                return v0_5_0(filename, input);
            case "0.5.2":
                return v0_5_2(filename, input);
            case "0.5.3":
                return v0_5_3(filename, input);
            case "0.5.6":
                return v0_5_6(filename, input);
            case "0.5.7":
                return v0_5_7(filename, input);
            case "0.5.8":
                return v0_5_8(filename, input);
            case "0.5.9":
                return v0_5_9(filename, input);
            case "0.5.10":
                return v0_5_10(filename, input);
            case "0.5.11":
                return v0_5_11(filename, input);
            case "0.5.12":
                return v0_5_12(filename, input);
            case "0.5.13":
                return v0_5_13(filename, input);
            case "0.5.14":
                return v0_5_14(filename, input);
            case "0.5.15":
                return v0_5_15(filename, input);
            case "0.5.16":
                return v0_5_16(filename, input);
            case "0.5.17":
                return v0_5_17(filename, input);
            case "0.6.0":
                return v0_6_0(filename, input);
            case "0.6.1":
                return v0_6_1(filename, input);
            case "0.6.2":
                return v0_6_2(filename, input);
            case "0.6.4":
                return v0_6_4(filename, input);
            case "0.6.6":
                return v0_6_6(filename, input);
            case "0.6.7":
                return v0_6_7(filename, input);
            case "0.6.8":
                return v0_6_8(filename, input);
            case "0.6.9":
                return v0_6_9(filename, input);
            case "0.6.10":
                return v0_6_10(filename, input);
            case "0.6.11":
                return v0_6_11(filename, input);
            case "0.6.12":
                return v0_6_12(filename, input);
            case "0.7.0":
                return v0_7_0(filename, input);
            case "0.7.3":
                return v0_7_3(filename, input);
            case "0.7.4":
                return v0_7_4(filename, input);
            case "0.7.5":
                return v0_7_5(filename, input);
            case "0.7.6":
                return v0_7_6(filename, input);
            case "0.8.0":
                return v0_8_0(filename, input);
            case "0.8.1":
                return v0_8_1(filename, input);
            case "0.8.2":
                return v0_8_2(filename, input);
            case "0.8.3":
                return v0_8_3(filename, input);
            case "0.8.4":
                return v0_8_4(filename, input);
            case "0.8.5":
                return v0_8_5(filename, input);
            case "0.8.6":
                return v0_8_6(filename, input);
            case "0.8.7":
                return v0_8_7(filename, input);
            default:
                return null;
        }
    } catch (err: any) {
        return null;
    }
};
