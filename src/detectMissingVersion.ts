import { resolve } from "path";
import { readdirSync, readFileSync } from "fs-extra";
import { Presets, SingleBar } from "cli-progress";

import { IVersion } from "./types/version";

import folderTree from "../folder-tree.json";
import { inputDir } from "../constant.json";

import { detectVersion } from "./utils";

const missingVersions: Set<string> = new Set();
const bar: SingleBar = new SingleBar({}, Presets.shades_classic);

let vulnerability: string;
let contracts: string[],
    contract: string,
    contractPath: string,
    contractSource: string,
    contractVersion: IVersion;
let index: number;

function main() {
    for (vulnerability of folderTree) {
        console.log(`Start detect in: ${vulnerability}`);

        contracts = readdirSync(resolve(inputDir, vulnerability));
        bar.start(contracts.length, 0);

        for (index = 0; index < contracts.length; index++) {
            bar.update(index + 1);
            try {
                contract = contracts[index];
                contractPath = resolve(inputDir, vulnerability, contract);
                contractSource = readFileSync(contractPath, "utf8");
                contractVersion = detectVersion(contractSource, contract);

                if (!contractVersion.available) missingVersions.add(contractVersion.version);
            } catch (err) {}
        }

        bar.stop();
    }
}

main();
console.log("Missing version:", missingVersions);
