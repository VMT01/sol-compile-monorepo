import { resolve } from "path";
import {
    ensureDirSync,
    outputFileSync,
    readdirSync,
    readFileSync,
    removeSync,
} from "fs-extra";

import { outputDir, convertDir } from "./constant.json";
import { createConvertPath } from "./utils";

const outputPath: string = resolve(outputDir);
const convertPath: string = resolve(convertDir);

function setup(): void {
    removeSync(convertPath);
    ensureDirSync(convertPath);
}

function main(dir: string): void {
    const vulnerabilities: string[] = readdirSync(dir);
    for (const vulnerability of vulnerabilities) {
        if (vulnerability === "Other") continue;

        console.log(`Start compile in ${vulnerability}`);

        const vulnerabilityPath: string = resolve(dir, vulnerability);
        const csvContent = ["ADDRESS,BYTECODE,LABEL"];

        readdirSync(vulnerabilityPath).forEach((item) => {
            const filename = item.replace(/\.[^/.]+$/, "");
            const filepath = resolve(vulnerabilityPath, item);
            const source: string = readFileSync(filepath, "utf8");

            try {
                csvContent.push(`${filename},${source},1`);
            } catch (err) {}
        });

        const convertPath: string = createConvertPath([], vulnerability, "csv");
        outputFileSync(convertPath, csvContent.join("\n"));
    }
}

setup();
main(outputPath);
