import { resolve } from "path";
import { lstatSync, readdirSync, readFileSync } from "fs-extra";

import { inputDir } from "./constant.json";
import { detectVersion } from "./utils";

const inputPath: string = resolve(inputDir);
const missingVersions: Set<string> = new Set();

function main(dir: string): void {
    readdirSync(dir).forEach((item) => {
        const itemPath = resolve(dir, item);
        if (lstatSync(itemPath).isDirectory()) {
            console.log(`Start detect in: ${itemPath}`);
            main(itemPath);
        } else {
            try {
                const source: string = readFileSync(itemPath, "utf8");
                const { avaiable, version } = detectVersion(source);
                if (!avaiable) missingVersions.add(version);
            } catch (err: any) {
                console.log(`Error: ${itemPath}`, err.message);
            }
        }
    });
}

main(inputPath);
console.log("Missing version:", missingVersions);
