// Import required modules
let inputArr = process.argv.slice(2); // Extract command line arguments
let fs = require("fs"); // Import the Node.js File System module
let path = require("path"); // Import the Node.js Path module

// Define file types and their corresponding categories
let types = {
    media: ['mp4', 'mkv', 'mpeg'], // Media file extensions
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"], // Archive file extensions
    documents: ["docx", "doc", "pdf", "xlxs", "xls", "odt", "ods", "odp", "odg", "odf", "txt", "ps"], // Document file extensions
    app: ["exe", "dmg", "deb", "pkg"] // Application file extensions
}

// Extract the user's command from command line arguments
let command = inputArr[0];

// Check the user's command and execute the corresponding function
switch (command) {
    case "tree":
        treeFn(inputArr[1]); // Execute the 'treeFn' function
        break;
    case "organize":
        organizeFn(inputArr[1]); // Execute the 'organizeFn' function
        break;
    case "help":
        helpFn(); // Execute the 'helpFn' function
        break;
    default:
        console.log("Please enter the correct command. Use 'help' for command reference.");
}

// Function to display the tree structure of a directory
function treeFn(dirPath) {
    if (dirPath == undefined) {
        console.log("Please enter the path of the folder you want to organize.");
        return;
    } else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            treeHelper(dirPath, "");
        } else {
            console.log("Please enter the correct path.");
            return;
        }
    }
}

// Function to organize files in a directory based on their types
function organizeFn(dirPath) {
    let destPath;
    if (dirPath == undefined) {
        console.log("Please enter the path of the folder you want to organize.");
        return;
    } else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            destPath = path.join(dirPath, "Organized Files");
            if (fs.existsSync(destPath) === false) {
                fs.mkdirSync(destPath);
            }
        } else {
            console.log("Please enter the correct path.");
            return;
        }
    }
    organizeHelper(dirPath, destPath);
}

// Function to display a help message with available commands
function helpFn() {
    console.log(`List of all Commands:
        node main.js tree directoryPath
        node main.js organize directoryPath
        node main.js help
    `);
}

// Function to categorize and organize files
function organizeHelper(src, dest) {
    let childNames = fs.readdirSync(src);
    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {
            let category = getCategory(childNames[i]);
            sendFiles(childAddress, dest, category);
        }
    }
}

// Function to categorize files based on their extensions
function getCategory(name) {
    let ext = path.extname(name).slice(1);
    for (let type in types) {
        let cTypeArray = types[type];
        if (cTypeArray.includes(ext)) {
            return type;
        }
    }
    return "others";
}

// Function to copy files to their respective categories
function sendFiles(srcFilePath, dest, category) {
    let categoryPath = path.join(dest, category);
    if (!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    console.log(fileName, "copied to", categoryPath);
}

// Function to display the tree structure of a directory recursively
function treeHelper(dirPath, indent) {
    let isFile = fs.lstatSync(dirPath).isFile();
    if (isFile) {
        let filename = path.basename(dirPath);
        console.log(indent + " ├── " + filename);
    } else {
        let dirName = path.basename(dirPath);
        console.log(indent + " └── " + dirName);
        let children = fs.readdirSync(dirPath);
        for (let child of children) {
            treeHelper(path.join(dirPath, child), indent + " │   ");
        }
    }
}