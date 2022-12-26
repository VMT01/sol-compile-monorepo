import { resolve } from "path";
import {
    ensureDirSync,
    outputFileSync,
    readdirSync,
    readFileSync,
    removeSync,
} from "fs-extra";
import { Presets, SingleBar } from "cli-progress";

import { IVersion } from "./types/version";
import { IInput } from "./types/input";
import { IError } from "./types/output";

import folderTree from "../folder-tree.json";
import { inputDir, outputDir, errorDir } from "../constant.json";

import { compile, createInput, detectVersion } from "./utils";

const bar: SingleBar = new SingleBar({}, Presets.shades_classic);

let vulnerability: string;
let contracts: string[],
    contract: string,
    contractName: string,
    contractPath: string,
    contractSource: string,
    contractVersion: IVersion;
let index: number;
let input: IInput;
let outputPath: string, errorPath: string;

function setup(): void {
    // remove old folder
    removeSync(outputDir);
    ensureDirSync(outputDir);
    removeSync(errorDir);
    ensureDirSync(errorDir);

    // set global value
    global.compileOutput = undefined;
    global.contractBytecode = undefined;
}

function main(): void {
    for (vulnerability of folderTree) {
        console.log(`Start compile in ${vulnerability}`);

        contracts = readdirSync(resolve(inputDir, vulnerability));
        bar.start(contracts.length, 0);

        for (index = 0; index < contracts.length; index++) {
            bar.update(index + 1);
            try {
                contract = contracts[index];
                contractName = contract.replace(/\.[^/.]+$/, "");
                contractPath = resolve(inputDir, vulnerability, contract);
                contractSource = readFileSync(contractPath, "utf8");
                contractVersion = detectVersion(contractSource);

                if (!contractVersion.available) {
                    throw new Error(`Version ${contractVersion.version} is not avaiable`);
                }

                input = createInput(contractName, contractSource, contractVersion);
                global.contractBytecode = compile(contractName, contractVersion, input);

                outputPath = resolve(outputDir, vulnerability, contractName + ".txt");
                outputFileSync(outputPath, global.contractBytecode);
            } catch (err: any) {
                errorPath = resolve(errorDir, vulnerability, contractName + ".txt");
                outputFileSync(errorPath, `Error:\n${err.message}\nSolidity version: ${contractVersion.version}`);
            }
        }

        bar.stop();
    }
}

setup();
main();
