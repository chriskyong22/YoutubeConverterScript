const { exec } = require("child_process");
const fs = require('fs')
const prompt = require('prompt-sync')({sigint: true});

const path = process.env.APPDATA + '\\youtube-dl\\config.txt';
let presetOptions = false;
console.log(path);
try {
    if(fs.existsSync(path)) {
        console.log("Found predetermined options file for youtube-dl, using the configuration.");
        presetOptions = true;
        var userOptions = "";
        var outputFolder = "";
    } else {
        console.log('No options file for youtube-dl.');
    }
} catch (err) {
    console.error(err);
}

if(!presetOptions){
    var userOptions = prompt("Please enter the arguments for conversion. See Youtube-dl documentation for list of options or leave blank for default options\n");
    if(userOptions === ""){
        userOptions = "-x --audio-format mp3";
    }
    var outputFolder = prompt("Please enter the folder you would like to store the converted videos, default will be ./temp with the name being youtube title's name + extension\n");
    if(outputFolder === ""){
        outputFolder = "-o ./temp/%(title)s.%(ext)s";
    }
    console.log(`Using arguments: ${userOptions}`);
    console.log(`Storing the files in: ${outputFolder}`);
}

fs.readFile('./urls.txt', 'ascii', function (err,data) {
    if (err) {
      return console.log(err);
    }
    urls = data.split("\r\n");
    console.log(urls);
    urls.forEach((url) => {
        console.log(`Command: youtube-dl.exe ${userOptions} ${outputFolder} ${url}`)
        exec(`youtube-dl.exe ${userOptions} ${outputFolder} ${url}`, (error, stdout, stderror) => {
            if(error){
                console.log(error.message);
            }
            if(stderror){
                console.log(stderror);
            }
            if(stdout){
                console.log(`Successfully downloaded: ${stdout}`);
            }
        });
    });
});
