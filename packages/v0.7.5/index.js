const solc = require("solc");

const compile = (filename, source) => {
    const input = {
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
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const contracts = output.contracts[filename];
    const bytecode = Object.keys(contracts).reduce(
        (pre, key) => pre + contracts[key].evm.bytecode.object,
        ""
    );
    return bytecode;
};

module.exports = {
    compileV0_7_5: compile,
};
