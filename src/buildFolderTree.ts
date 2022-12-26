import { resolve } from "path";
import { lstatSync, readdirSync, PathLike, outputFileSync } from "fs-extra";

import { inputDir } from "../constant.json";

let itemPath: PathLike | undefined;
const folderTree: string[][] = [];
let output: string = "";

function main(dir: string, level: string[] = []): void {
    readdirSync(dir).map((item) => {
        itemPath = resolve(dir, item);
        if (lstatSync(itemPath).isDirectory()) {
            main(itemPath, [...level, item]);
            folderTree.push([...level, item]);
        }
    });
}

function configOutput() {
    output = `[\n\t"${folderTree[0].join("/")}"`;

    for (let i = 1; i < folderTree.length; i++) {
        output += `,\n\t"${folderTree[i].join("/")}"`;
    }

    output += "\n]";
}

main(inputDir);
configOutput();

outputFileSync("./folder-tree.json", output);
