import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Project directory and source directory
const projectDir = path.resolve();
const projectDirName = path.basename(projectDir);
const srcDir = path.join(projectDir, 'src');
const outputFile = path.join(projectDir, 'exportedFiles.txt');
const versionFile = path.join(projectDir, 'version.txt');
const scriptPath = fileURLToPath(import.meta.url);
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

const dependenciesMap = new Map();
const fileTypesMap = new Map();

// Function to get the current version from the version file
const getCurrentVersion = async () => {
  try {
    const versionContent = await fs.readFile(versionFile, 'utf-8');
    return versionContent.trim();
  } catch (error) {
    return '0.0.0';
  }
};

const incrementVersion = (version) => {
  const [major, minor, patch] = version.split('.').map(Number);
  return `${major}.${minor}.${patch + 1}`;
};

// Function to categorize dependencies
const categorizeDependencies = (dependencies) => {
  const localFiles = dependencies.filter(dep => dep.startsWith('.'));
  const externalPackages = dependencies.filter(dep => !dep.startsWith('.'));
  return { localFiles, externalPackages };
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
    const categorizedDependencies = categorizeDependencies(dependencies);
    const dependencyList = dependencies.length > 0 
      ? `Dependencies: ${dependencies.join(', ')}\n`
      : '';

    // Track dependencies for summary
    dependencies.forEach(dep => {
      dependenciesMap.set(dep, (dependenciesMap.get(dep) || 0) + 1);
    });

    // Generate file metadata
    const fileMetadata = `File: /${relativeFilePath}\nSize: ${stats.size} bytes\nCreated: ${stats.birthtime}\nModified: ${stats.mtime}\n`;

    // Generate file type categorization
    const fileType = path.extname(filePath).substring(1); // Get file extension without the dot
    const fileCategory = `Category: ${fileType.toUpperCase()}\n`;

    // Track file types for summary
    fileTypesMap.set(fileType, (fileTypesMap.get(fileType) || 0) + 1);

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

    // Extracting files and their dependencies into a structured format
    let fileDependencies = [];
    const fileRegex = /File: (.*?)\n.*?Dependencies: (.*?)\n/gs;
    let match;
    while ((match = fileRegex.exec(summary)) !== null) {
      const [, filePath, dependencies] = match;
      const dependencyArray = dependencies.split(', ').filter(dep => dep !== '');
      fileDependencies.push({ filePath, dependencyCount: dependencyArray.length });
    }

    // Sort files by the number of dependencies
    fileDependencies.sort((a, b) => b.dependencyCount - a.dependencyCount);

    // Generate the summary content for files with the most dependencies
    const filesWithMostDependenciesSummary = fileDependencies.slice(0, 10)
      .map(({ filePath, dependencyCount }) => `- ${filePath}: ${dependencyCount} dependencies`)
      .join('\n');

    const summaryContent = `
Project Overview:
- Total files processed: ${fileCount}
- Project directory: ${projectDirName}
- Source directory: ${path.join(projectDirName, 'src')}

Specific files included:
${specificFiles.map(file => `- ${file}`).join('\n')}

### File Types Distribution
${[...fileTypesMap.entries()].map(([type, count]) => `- ${type.toUpperCase()}: ${count}`).join('\n')}

### Most Common Dependencies
${[...dependenciesMap.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([dep, count]) => `- ${dep}: ${count} occurrences`)
  .join('\n')}

### Files with the Most Dependencies
${filesWithMostDependenciesSummary}
`;
    await fs.appendFile(outputFile, `\n${summaryContent}`);
    console.log(`${colors.green}Summary: Processed ${fileCount} files.${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error reading summary: ${error}${colors.reset}`);
  }
};

// Function to generate a file tree for the src directory and specific files
const generateFileTree = async (dir, prefix = '') => {
  let tree = '';
  try {
    const files = await fs.readdir(dir);
    for (const [index, file] of files.entries()) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      const isLast = index === files.length - 1;
      const newPrefix = prefix + (isLast ? '└── ' : '├── ');

      tree += `${newPrefix}${file}\n`;
      if (stat.isDirectory() && file !== 'node_modules') {
        tree += await generateFileTree(filePath, prefix + (isLast ? '    ' : '│   '));
      }
    }
  } catch (error) {
    console.error(`${colors.red}Error generating file tree for directory ${dir}: ${error}${colors.reset}`);
  }
  return tree;
};

// Function to onboard AI to use the output effectively
const aiOnboardingInstructions = (version, timestamp) => `
To strategically use the output of this script, follow these guidelines based on the context provided:

1. **Understand the Entire Codebase:**
   - Start with the Project Overview to get a high-level understanding.
   - Review the file tree structure to see the organization of files and directories.
   - Examine the dependencies of each file to understand how they interact.

2. **Refactor:**
   - Identify files with many dependencies as potential candidates for refactoring.
   - Look for large files or files with complex dependencies that could be simplified.

3. **Help Write Tests:**
   - Focus on files with fewer dependencies first to write unit tests.
   - For files with complex dependencies, consider writing integration tests.

4. **Debug:**
   - Use the dependency list to trace through the flow of data and identify potential issues.
   - Check the file modification times to find recently changed files that might be causing issues.

5. **Extend Functionality:**
   - Identify related files by their dependencies to understand where new functionality might fit in.
   - Use the file tree to locate where new files should be added in the directory structure.


   Key Files and Directories:
   ### Root Directory Files
   - index.html: The main HTML file that sets up the structure of the web page.
   - package.json: Contains metadata about the project and manages dependencies and scripts.
   - postcss.config.js: Configuration for PostCSS, used for transforming styles with JavaScript plugins.
   - tailwind.config.js: Configuration for Tailwind CSS, a utility-first CSS framework.
   - tsconfig.json: TypeScript configuration file.
   - tsconfig.node.json: TypeScript configuration file for Node.js.
   - vite.config.ts: Configuration for Vite, a build tool that aims to provide a faster and leaner development experience.

   ### Source Directory Files
   - src/app.tsx: The main application file, sets up the Preact Router and initial state management.
   - src/assets: Contains static assets like images.
   - src/components: Contains React components that form the building blocks of the application.
     - Article.tsx: Displays an article based on the given ID.
     - ArticleView.tsx: Provides the detailed view of an article.
     - Categories.tsx: Lists all categories.
     - CategoryItems.tsx: Lists items under a specific category.
     - FeatureCard.tsx: Displays a card with a feature.
     - Footer.tsx: The footer component of the application.
     - Header.tsx: The header component, including the search bar.
     - Home.tsx: The home page component.
     - MainContent.tsx: Displays the main content of the page.
     - NotFound.tsx: Displays a 404 page when a route is not found.
     - Section.tsx: Represents a section of the content.
     - SkeletonLoader.tsx: Provides a loading skeleton UI.
   - src/content.ts: Contains the content structure and data for the application.
   - src/index.css: Main stylesheet for the application.
   - src/main.tsx: The entry point for the Preact application.
   - src/tests: Contains test files for the application components.
   - src/utils.ts: Utility functions used throughout the application.
   - src/vite-env.d.ts: TypeScript declaration file for Vite.


## Tech Stack Overview

### Frontend Framework
- **Preact:** A fast, 3kB alternative to React with the same modern API.
- **Preact Router:** A simple router for Preact.

### Build and Development Tools
- **Vite:** A build tool that provides a fast development experience and optimized builds.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.

### CSS and Styling
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **PostCSS:** A tool for transforming CSS with JavaScript plugins.

### State Management
- **useReducer:** A React hook for managing complex state logic.

### Testing
- **Vitest:** A fast unit test framework heavily inspired by Jest.
- **@testing-library/preact:** Provides utilities to test Preact components.
- **jest-dom:** Custom Jest matchers to test the state of the DOM.

### Utility Libraries
- **Autoprefixer:** A PostCSS plugin that adds vendor prefixes to CSS rules.
- **Highlight.js:** Used for syntax highlighting in code.

## Key Features and Functionalities
1. **Dynamic Routing:** Preact Router is used to handle dynamic routes and navigation.
2. **State Management:** Managed using \`useReducer\` for complex state logic.
3. **Content Management:** The content of the site is structured and managed through \`src/content.ts\`.
4. **Styling:** Tailwind CSS is used for styling, providing utility classes to speed up development.
5. **Testing:** Comprehensive testing setup using Vitest and Preact Testing Library.

## Dependencies and Their Roles
- **preact:** Core library for building UI components.
- **preact-router:** Router library for handling client-side routing.
- **@testing-library/preact:** Provides utilities to test Preact components.
- **tailwindcss:** CSS framework for styling.
- **vite:** Build tool for development and production.
- **typescript:** Adds static types to JavaScript.
- **autoprefixer, postcss:** Tools for processing and transforming CSS.

Remember to stick to the structure and content provided, and refrain from making unsolicited corrections or additions. Focus on analyzing and understanding the existing content.
`;

// Function to update version file and script version
const updateVersion = async () => {
  const currentVersion = await getCurrentVersion();
  const newVersion = incrementVersion(currentVersion);
  await fs.writeFile(versionFile, newVersion);

  const scriptContent = await fs.readFile(scriptPath, 'utf-8');
  const versionRegex = /const currentScriptVersion = '0.0.5';/;
  const updatedScriptContent = scriptContent.replace(versionRegex, `const currentScriptVersion = '${newVersion}';`);
  await fs.writeFile(scriptPath, updatedScriptContent);

  console.log(`${colors.green}Updated to version ${newVersion}${colors.reset}`);
};

const main = async () => {
  console.log(`${colors.green}Starting process...${colors.reset}`);
  try {
    await fs.writeFile(outputFile, '');
    await updateVersion();
    const currentVersion = await getCurrentVersion();
    const timestamp = new Date().toISOString();

    await fs.appendFile(outputFile, `Version: ${currentVersion}\nTimestamp: ${timestamp}\n\n`);

    console.log(`${colors.green}Generating file tree...${colors.reset}`);
    let fileTree = `${projectDirName}\n`;
    fileTree += specificFiles.map(file => `├── ${file}`).join('\n') + '\n';
    fileTree += '├── src\n';
    const srcTree = await generateFileTree(srcDir, '│   ');
    fileTree += srcTree;
    await fs.appendFile(outputFile, `${fileTree}\n\n`);

    console.log(`${colors.green}Processing src directory...${colors.reset}`);
    await processDirectory(srcDir);
    console.log(`${colors.green}Src directory processed. Appending specific files...${colors.reset}`);
    await appendSpecificFiles();
    console.log(`${colors.green}Specific files appended.${colors.reset}`);
    console.log(`${colors.green}Exported file contents to ${outputFile}${colors.reset}`);

    await summarize();
    await fs.appendFile(outputFile, `\nAI Onboarding Instructions:\n${aiOnboardingInstructions(currentVersion, timestamp)}\n`);
    console.log(`${colors.green}AI onboarding instructions added.${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}An error occurred: ${error}${colors.reset}`);
  }
};


main();
