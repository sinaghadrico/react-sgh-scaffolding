const inquirer = require('inquirer');
const CURR_DIR = process.cwd();
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const clear = require('clear')
const fs = require('fs-extra')
const chalk = require('chalk');
const editJsonFile = require("edit-json-file");
/**
 * questions
 * @type {*[]}
 */
const Questions = [
    {
        type: 'input',
        name: 'component_name',
        message: 'Enter your component name : ',
        validate: function (input) {
            if (fs.existsSync(input)) {
                return "component with this name exists!"
            }
            if (/^([a-z\-\_\d])+$/.test(input)) return true;
            else return 'Component name may only include letters(lowercase), numbers, underscores and hashes.';
        }
    },
    {
        type: 'list',
        name: 'extension',
        message: 'Enter your component extension : ',
        choices: [
            {
                name: 'ts',
            },
            new inquirer.Separator(),
            {
                name: 'js',
            }
        ]
    },
    {
        type: 'list',
        name: 'type',
        message: 'Enter your component type : ',
        choices: [
            {
                name: 'class',
            },
            new inquirer.Separator(),
            {
                name: 'function',
            },
            new inquirer.Separator(),
            {
                name: 'pure',
            },
            new inquirer.Separator(),
            {
                name: disable('memo'),
                disabled: warning("Coming soon")
            },
        ]
    },
    {
        type: 'input',
        name: 'component_route',
        message: 'Enter your component route or (ignore) : '
       
    },
    {
        type: 'confirm',
        name: 'css',
        message: 'Do you need a style file ? '
    },

    
];


//warning style
function warning(text) {
    return chalk.yellow(text)
}

//disable style
function disable(text) {
    return chalk.grey(text)
}

/**
 * clear and run program
 */
function firstRun() {
    clear();
    console.log(
        chalk.blue('React SGH CLI \n')
    );
}

/**
 * create directory and copy skeleton into project folder
 * @param templatePath
 * @param newProjectPath
 * @param projectName
 */
function createDirectoryContents(templatePath, newProjectPath, projectName) {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
        const origFilePath = `${templatePath}/${file}`;

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        if (stats.isFile()) {
            let contents = fs.readFileSync(origFilePath, 'utf8');

            if (file === "package.json") {
                let jsonPackage = editJsonFile(`${templatePath}/${file}`);

                //change project name
                jsonPackage.set("name", projectName);

                jsonPackage.save();

            }
                const writePath = `${newProjectPath}/${file}`;
                fs.writeFileSync(writePath, contents, 'utf8');


        }

        if (stats.isDirectory()) {
            fs.copy(templatePath, newProjectPath, error => {
                return true;
            }) // copies file
        }
    });
}

/**
 * get version of node
 * @returns {Promise<*>}
 */
async function getVersion() {
    const {stdout} = await execFile('node', ['--version']);
    return stdout;
}

function changeDirectory(directory) {
    process.chdir(directory);
}

async function installDependencies(project_name) {
    changeDirectory(project_name);
    const {stdout} = await execFile('npm', ['install']);

    return stdout
}

module.exports = {
    createDirectoryContents,
    CURR_DIR,
    installDependencies,
    changeDirectory,
    Questions,
    firstRun
}
