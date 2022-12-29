import { resolve } from "path";
import {
    ensureDirSync,
    outputFileSync,
    readdirSync,
    readFileSync,
    removeSync,
} from "fs-extra";

import folderTree from "../folder-tree.json";
import { outputDir, convertDir } from "../constant.json";
import { Presets, SingleBar } from "cli-progress";

const bar: SingleBar = new SingleBar({}, Presets.shades_classic);

function setup(): void {
    removeSync(convertDir);
    ensureDirSync(convertDir);
}

let vulnerability: string;
let csvContent: string[];
let contracts: string[],
    contract: string,
    contractName: string,
    contractPath: string,
    contractSource: string;
let index: number;
let convertPath: string;

function main(): void {
    for (vulnerability of folderTree) {
        console.log(`Start conver in ${vulnerability}`);

        csvContent = ["ADDRESS,BYTECODE,LABEL"];
        contracts = readdirSync(resolve(outputDir, vulnerability));
        bar.start(contracts.length, 0);

        for (index = 0; index < contracts.length; index++) {
            bar.update(index + 1);

            try {
                contract = contracts[index];
                contractName = contract.replace(/\.[^/.]+$/, "");
                contractPath = resolve(outputDir, vulnerability, contract);
                contractSource = readFileSync(contractPath, "utf8");

                csvContent.push(`${contractName},${contractSource},1`);
            } catch (err) {
            } finally {
                contract = null;
                contractName = null;
                contractPath = null;
                contractSource = null;
            }
        }

        bar.stop();

        convertPath = resolve(
            convertDir,
            vulnerability,
            vulnerability.split("/").pop() + "csv"
        );
        outputFileSync(convertPath, csvContent.join("\n"));
    }
}

setup();
main();
