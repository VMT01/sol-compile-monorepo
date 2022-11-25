const solc = require("solc");

const compile = (filename, source) => {
    const input = {
        sources: {
            [filename]: source,
        },
    };

    const output = solc.compile(input, 1);
    const contracts = output.contracts;
    const bytecode = Object.keys(contracts).reduce(
        (pre, key) => pre + contracts[key].bytecode,
        ""
    );

    return bytecode;
};

module.exports = {
    compileV0_4_24: compile,
};
