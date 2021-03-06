#!/usr/bin/env node
// ---------------------------------------------------------------------------------------------------------------------
// This script is intended to execute all benchmark tests.
//
// Note: Use '--save' flag to store the benchmark results in local file.
//       Example: "npm run test-benchmark -- --save"
// ---------------------------------------------------------------------------------------------------------------------

const chalk = require('chalk'),
    { exec } = require('shelljs');

module.exports = function (exit) {
    console.info(chalk.yellow.bold('Running benchmark tests'));

    var saveResults = '';

    process.argv.forEach(function (arg) {
        if (arg.trim() === '--save') {
            saveResults = '--save benchmark/benchmark-results.json';
        }
    });

    exec('bipbip test/benchmark/ ' +
         '--compare benchmark/benchmark-results.json ' +
         saveResults, exit);
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(process.exit);
