const inquirer = require('inquirer');
var process = require('child_process');
const fs = require('fs');
const {installDependencies, firstRun, createDirectoryContents, CURR_DIR, Questions} = require('./scripts/helpers')
const _cliProgress = require('cli-progress');
const _colors = require('colors');
const chalk = require('chalk');
const bar = new _cliProgress.Bar({
    fps: 5,
    format: _colors.blue('installing [{bar}] {percentage}% '),
    stream: process.stdout,
    barsize: 100,
    position: 'center',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591'
}, _cliProgress.Presets.shades_grey);

function run () {
    firstRun();
    inquirer
        .prompt(Questions)
        .then(answers => {
            const {component_route,extension,cssType ,css,type, component_name} = answers;

            let bash=`node ${__dirname}/index.js`;
            if(component_name)
            {
                bash=bash+' --name='+component_name
            }
            if(type)
            {
                bash=bash+' --template='+type
            }
            if(component_route)
            {
                bash=bash+' --path='+component_route
            }
            if(extension)
            {
                bash=bash+' --fileType='+extension
            }
            if(css)
            {
                bash=bash+' --css'
            }
            console.log(bash)
            process.exec(bash,function (err,stdout,stderr) {
                if (err) {
                    console.log("\n"+"err:"+stderr);
                } else {
                    console.log(chalk.green(stdout));
                }
            });

        });
}

module.exports = {
    run
}


