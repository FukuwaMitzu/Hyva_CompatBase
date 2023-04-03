import glob from 'glob';
import path from 'path';

const bundleMapping = new Map();


/**
 * Looking for roll up config files in code folder
 *
 * @param rootPath
 * @returns {*}
 */
function crawlFiles(rootPath) {
    //Get the current theme name
    const currentProcessDir = process.cwd();
    const checkMatchCurrentDir = /design\/frontend\/(.+)\/web\/rollup/;

    const matchTheme = currentProcessDir.match(checkMatchCurrentDir);

    //Find the module first...
    const moduleRegex = /code\/(.+)\/(.+)\/view\/frontend\/web\/(.*)/;
    const absolutePath = path.resolve(rootPath);
    glob.sync(path.join(absolutePath, 'code/*/*/view/frontend/web/**/*.js')).map(file => {
        const match = file.match(moduleRegex);
        if (match) {
            const vendor_module = `${match[1]}_${match[2]}`;
            const relativePath = match[3];
            bundleMapping.set(`${vendor_module}::${relativePath}`, {
                vendor_module: vendor_module,
                filePath: file
            });
        }
    });

    //Then find the theme dir
    const themeRegex = `frontend/${matchTheme[1]}/([^\/]+)_([^\/]+)/web/(.*)`
    glob.sync(path.join(absolutePath, `design/frontend/${matchTheme[1]}/**/*.js`)).map(file => {
        const match = file.match(themeRegex);
        if (match) {
            const vendor_module = `${match[1]}_${match[2]}`;
            const relativePath = match[3];
            bundleMapping.set(`${vendor_module}::${relativePath}`, {
                vendor_module: vendor_module,
                filePath: file
            });
        }
    });
    return bundleMapping;
}


function crawlConfig(rootPath) {
    //Get the current theme name
    const currentProcessDir = process.cwd();
    const checkMatchCurrentDir = /design\/frontend\/(.+)\/web\/rollup/;

    const matchTheme = currentProcessDir.match(checkMatchCurrentDir);
    const configMapping = new Map();

    //Find the module first...
    const moduleRegex = /code\/(.+)\/(.+)\/view\/frontend\/rollup\.config\.js/;
    const absolutePath = path.resolve(rootPath);
    glob.sync(path.join(absolutePath, 'code/*/*/view/frontend/**/rollup.config.js')).map(file => {
        const match = file.match(moduleRegex);
        if (match) {
            const vendor_module = `${match[1]}_${match[2]}`;
            configMapping.set(`${vendor_module}`, {
                vendor_module: vendor_module,
                filePath: file
            });
        }
    });

    //Then find the theme dir
    const themeRegex = `frontend/${matchTheme[1]}/([^\/]+)_([^\/]+)/rollup.config.js`
    glob.sync(path.join(absolutePath, `design/frontend/${matchTheme[1]}/**/rollup.config.js`)).map(file => {
        const match = file.match(themeRegex);
        if (match) {
            const vendor_module = `${match[1]}_${match[2]}`;
            configMapping.set(`${vendor_module}`, {
                vendor_module: vendor_module,
                filePath: file
            });
        }
    });
    return configMapping;
}

/**
 * Generate bundle inputs
 *
 * @param rollUpConfigList
 * @returns {Promise<{[p: string]: any}>}
 */
async function generateBundleInputs(rollUpConfigList) {
    let inputs = new Map();
    for (const [alias, config] of rollUpConfigList) {
        const configModule = await import(config.filePath);
        if (configModule.default && configModule.default.entries) {
            let entries = configModule.default.entries;
            entries.forEach(entryPath => {
                const aliasPath = `${alias}::${entryPath}`;
                const bundlePath = bundleMapping.get(aliasPath);
                if (bundlePath)
                    inputs.set(aliasPath.replace('::', '/'), bundlePath.filePath);
            });
        }
    }
    return inputs;
}


async function collectFileInputs(rootPath) {
    crawlFiles(rootPath);
    let configs = crawlConfig(rootPath);
    let fileInputs = await generateBundleInputs(configs);
    return Object.fromEntries(fileInputs);
}


function moduleAliasResolver() {
    return {
        name: 'hyva-rollup-aliases',
        resolveId(source, importer) {
            const bundle = bundleMapping.get(source);
            if(bundle){
                return bundle.filePath;
            }
        }
    }
}

export default {moduleAliasResolver, collectFileInputs};
