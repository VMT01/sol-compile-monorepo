const path = require("path");
const fs = require("fs-extra");

const { inputDir, outputDir, versions } = require("./constant.json");
const { detectVersion, getCompiler } = require("./utils");

// Fetch path
const inputPath = path.resolve(inputDir);
const outputPath = path.resolve(outputDir);
fs.removeSync(outputPath);
fs.ensureDirSync(outputPath);

// Start reading files - 2 layers: vulnerablities name and contracts file
const vulnerabilities = fs.readdirSync(inputPath);

for (const vulnerability of vulnerabilities) {
    const contractsPath = path.resolve(inputPath, vulnerability);
    const contracts = fs.readdirSync(contractsPath);

    for (const contract of contracts) {
        const filepath = path.resolve(contractsPath, contract);

        const source = fs.readFileSync(filepath, "utf8");
        const { avaiable, version } = detectVersion(source, versions);

        // check version
        if (avaiable) {
            const compiler = getCompiler(version);
            if (compiler) {
                const output = compiler(contract, source);
                const outputFilepath = path.resolve(
                    outputPath,
                    vulnerability,
                    contract + ".bin"
                );
                fs.outputFileSync(outputFilepath, output);
            } else {
                console.log(`Missing compiler version ${version}`);
            }
        } else {
            console.log(`Missing version from ${contract}: ${version}`);
        }
    }
}
