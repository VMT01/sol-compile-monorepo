import { resolve } from "path";
import {
    ensureDirSync,
    lstatSync,
    outputFileSync,
    readdirSync,
    readFileSync,
    removeSync,
} from "fs-extra";

import { inputDir, outputDir, errorDir } from "./constant.json";
import {
    compile,
    createErrorPath,
    createInput,
    createOutputPath,
    detectVersion,
} from "./utils";
import { IInput } from "./Interfaces/input.interface";

const inputPath: string = resolve(inputDir);
const outputPath: string = resolve(outputDir);
const errorPath: string = resolve(errorDir);

function setup(): void {
    removeSync(outputPath);
    ensureDirSync(outputPath);
    removeSync(errorPath);
    ensureDirSync(errorPath);
}

function main(dir: string): void {
    const vulnerabilities: string[] = readdirSync(dir);
    for (const vulnerability of vulnerabilities) {
        if (vulnerability === "Other") continue;

        const vulnerabilityPath: string = resolve(dir, vulnerability);
        readdirSync(vulnerabilityPath).forEach((item) => {
            const filename = item.replace(/\.[^/.]+$/, "");
            const filepath = resolve(vulnerabilityPath, item);
            const source: string = readFileSync(filepath, "utf8");

            try {
                const { avaiable, version } = detectVersion(source);
                if (!avaiable) throw new Error();

                const outPath: string = createOutputPath(
                    [vulnerability],
                    filename
                );
                const input: IInput = createInput(filename, source, version);
                const output: string | null = compile(filename, version, input);

                if (output !== null) outputFileSync(outPath, output);
            } catch (err: any) {
                console.log(err.message);

                const errPath: string = createErrorPath(
                    [vulnerability],
                    filename
                );
                outputFileSync(errPath, source);
            }
        });
    }
    // readdirSync(dir).forEach((item) => {
    //     const itemPath = resolve(dir, item);
    //     if (lstatSync(itemPath).isDirectory()) {
    //         console.log(`Start compile in: ${itemPath}`);
    //         main(itemPath, [...level, item]);
    //     } else {
    //         const filename = item.replace(/\.[^/.]+$/, "");
    //         const source: string = readFileSync(itemPath, "utf8");

    //         try {
    //             const { avaiable, version } = detectVersion(source);
    //             if (!avaiable) throw new Error();

    //             const outPath: string = createOutputPath(level, filename);
    //             const input: IInput = createInput(filename, source, version);
    //             const output: string | null = compile(filename, version, input);

    //             if (output !== null) outputFileSync(outPath, output);
    //         } catch (err: any) {
    //             console.log(err.message);

    //             const errPath: string = createErrorPath(level, filename);
    //             outputFileSync(errPath, source);
    //         }
    //     }
    // });
}

setup();
main(inputPath);
