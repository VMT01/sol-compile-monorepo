const semver = require("semver");
const { compileV0_4_24 } = require("./packages/v0.4.24");
const { compileV0_5_16 } = require("./packages/v0.5.16");
const { compileV0_6_12 } = require("./packages/v0.6.12");
const { compileV0_7_5 } = require("./packages/v0.7.5");

const detectVersion = (source, versions) => {
    const detectPragma = [...new Set(source.match(/pragma.solidity.*;/g))];
    const detectVersionRange = detectPragma
        .map((_) => _.slice(16, -1))
        .join(" ");

    for (const version of versions) {
        if (semver.satisfies(version, detectVersionRange))
            return { avaiable: true, version };
    }
    return { avaiable: false, version: detectVersionRange };
};

const getCompiler = (version) => {
    switch (version) {
        case "0.4.24":
            return compileV0_4_24;
        case "0.5.16":
            return compileV0_5_16;
        case "0.6.12":
            return compileV0_6_12;
        case "0.7.5":
            return compileV0_7_5;
        default:
            return undefined;
    }
};

module.exports = {
    detectVersion,
    getCompiler,
};
