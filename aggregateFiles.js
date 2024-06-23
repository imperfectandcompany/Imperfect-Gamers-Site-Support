import fs from 'fs/promises';
import path from 'path';

// Project directory and source directory
const projectDir = path.resolve();
const srcDir = path.join(projectDir, 'src');
const outputFile = path.join(projectDir, 'exportedFiles.txt');
const specificFiles = [
  'index.html',
  'package.json',
  'postcss.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
];

// ANSI escape codes for colors
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
};

// Function to extract dependencies from a file's content
const extractDependencies = (content) => {
  const importRegex = /import\s.*\sfrom\s['"](.*)['"];?/g;
  const dependencies = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    dependencies.push(match[1]);
  }
  return dependencies;
};

// Function to write file content to the output file asynchronously
const appendFileContent = async (filePath) => {
  try {
    const relativeFilePath = path.relative(projectDir, filePath); // Get relative path from project root
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);

    // Extract dependencies
    const dependencies = extractDependencies(content);
    const dependencyList = dependencies.length > 0 ? `Dependencies: ${dependencies.join(', ')}\n` : '';

    // Generate file metadata
    const fileMetadata = `File: /${relativeFilePath}\nSize: ${stats.size} bytes\nCreated: ${stats.birthtime}\nModified: ${stats.mtime}\n`;

    // Generate file type categorization
    const fileType = path.extname(filePath).substring(1); // Get file extension without the dot
    const fileCategory = `Category: ${fileType.toUpperCase()}\n`;

    // Append metadata, categorization, dependencies, and content to the output file
    await fs.appendFile(outputFile, `${fileMetadata}${fileCategory}${dependencyList}\n${content}\n\n`);
    console.log(`${colors.green}Appended content from ${relativeFilePath}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error processing file ${filePath}: ${error}${colors.reset}`);
  }
};

// Recursive function to process each file/directory in the src directory asynchronously
const processDirectory = async (dir) => {
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory() && file !== 'node_modules') {
        await processDirectory(filePath); // Recurse into subdirectories
      } else if (stat.isFile()) {
        await appendFileContent(filePath); // Append file content to the output file
      }
    }
  } catch (error) {
    console.error(`${colors.red}Error processing directory ${dir}: ${error}${colors.reset}`);
  }
};

// Function to append specific project files
const appendSpecificFiles = async () => {
  for (const fileName of specificFiles) {
    const filePath = path.join(projectDir, fileName);
    try {
      if (await fs.stat(filePath)) {
        await appendFileContent(filePath);
      }
    } catch (error) {
      console.log(`${colors.red}File not found: ${filePath}${colors.reset}`);
    }
  }
};

// Function to provide a summary of processed files
const summarize = async () => {
  try {
    const summary = await fs.readFile(outputFile, 'utf-8');
    const fileCount = (summary.match(/File: /g) || []).length;
    const summaryContent = `
      Project Overview:
      - Total files processed: ${fileCount}
      - Project directory: ${projectDir}
      - Source directory: ${srcDir}

      Specific files included:
      ${specificFiles.map(file => `- ${file}`).join('\n')}

      This summary provides an overview of the project structure and key files to assist in understanding the codebase.
    `;
    await fs.appendFile(outputFile, `\n${summaryContent}`);
    console.log(`${colors.green}Summary: Processed ${fileCount} files.${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error reading summary: ${error}${colors.reset}`);
  }
};

// Main function to orchestrate the appending process with progress logging
const main = async () => {
  console.log(`${colors.green}Starting process...${colors.reset}`);
  try {
    // Ensure the output file is empty before starting
    await fs.writeFile(outputFile, '');
    console.log(`${colors.green}Processing src directory...${colors.reset}`);
    // Start processing the src directory
    await processDirectory(srcDir);
    console.log(`${colors.green}Src directory processed. Appending specific files...${colors.reset}`);
    // After processing the src directory, append specific files
    await appendSpecificFiles();
    console.log(`${colors.green}Specific files appended.${colors.reset}`);
    console.log(`${colors.green}Exported file contents to ${outputFile}${colors.reset}`);
    // Provide a summary of processed files
    await summarize();
  } catch (error) {
    console.error(`${colors.red}An error occurred: ${error}${colors.reset}`);
  }
};

main();
