import bootstrap from "./bootstrap/bootstrap.js";
import {development, production} from "./bootstrap/configs.js";

let config = development;
if(process.env.BUILD_ENV === "production"){
    config = production;
}

console.log("Collecting files...");
let fileInputs = await bootstrap.collectFileInputs('../../../../../../../app/');

if(!fileInputs || Object.keys(fileInputs).length === 0){
    console.log("No rollup.config.js found. Stop bundling.")
    process.exit(0);
}

export default {
    input: fileInputs,
    ...config
}
