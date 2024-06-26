import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Project directory and source directory
const projectDir = path.resolve();
const projectDirName = path.basename(projectDir);
const srcDir = path.join(projectDir, 'src');
const outputFile = path.join(projectDir, 'exportedFiles.txt');
const versionFile = path.join(projectDir, 'version.txt');
const preconfiguredFile = path.join(projectDir, 'preconfigured.json');
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

// Function to get user input from the command line
const getUserInput = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

// Validate task input
const validateTask = (task) => {
  const validTasks = ['onboarding', 'refactoring', 'testing', 'debugging', 'adding', 'removing', 'fixing', 'insights'];
  return validTasks.includes(task.toLowerCase());
};

// Function to gather detailed user input and confirm context
const gatherUserInput = async () => {
  let task;
  while (true) {
    task = await getUserInput('What is the purpose of this script execution? (onboarding/refactoring/testing/debugging/adding/removing/fixing/insights): ');
    if (validateTask(task)) {
      break;
    } else {
      console.log(`${colors.red}Invalid task. Please enter a valid task.${colors.reset}`);
    }
  }
  
  const specificMessage = await getUserInput('Please provide any specific message or instruction for the AI (optional): ');
  const contextConfirmation = await getUserInput('Is this context correct? (yes/no): ');

  if (contextConfirmation.toLowerCase() !== 'yes') {
    console.log('Please restart the script and provide the correct context.');
    process.exit(1);
  }

  return { task, specificMessage };
};

// Function to read preconfigured data from file
const readPreconfiguredData = async () => {
  try {
    const data = await fs.readFile(preconfiguredFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

// Function to write preconfigured data to file
const writePreconfiguredData = async (data) => {
  try {
    await fs.writeFile(preconfiguredFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`${colors.red}Error writing to preconfigured file: ${error}${colors.reset}`);
  }
};

// Function to check for a prefilled code and return corresponding data
const checkPrefilledCode = async () => {
  const preconfiguredData = await readPreconfiguredData();
  let code;
  let data;

  while (true) {
    code = await getUserInput('Enter prefilled code if you have one (press Enter to skip): ');
    if (!code) break;

    if (preconfiguredData[code]) {
      data = preconfiguredData[code];
      console.log(`Prefilled data found for code ${code}:`, data);
      const modify = await getUserInput('Do you want to modify it? (yes/no): ');
      if (modify.toLowerCase() === 'yes') {
        const { task, specificMessage } = await gatherUserInput();
        preconfiguredData[code] = { task, specificMessage };
        await writePreconfiguredData(preconfiguredData);
        return { task, specificMessage };
      }
      return preconfiguredData[code];
    } else {
      console.log(`${colors.red}Invalid code. Please enter a valid prefilled code or press Enter to skip.${colors.reset}`);
    }
  }

  const { task, specificMessage } = await gatherUserInput();
  const save = await getUserInput('Do you want to save this configuration for future use? (yes/no): ');
  if (save.toLowerCase() === 'yes') {
    const newCode = await getUserInput('Enter a code to save this configuration: ');
    preconfiguredData[newCode] = { task, specificMessage };
    await writePreconfiguredData(preconfiguredData);
  }

  return { task, specificMessage };
};

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

// Function to gather detailed information based on the task
const gatherDetailedInfo = async (task) => {
  let details = {};
  switch (task) {
    case 'refactoring':
      details = {
        largeFiles: await getUserInput('Do you need to refactor large or complex files? (yes/no): '),
        reduceDependencies: await getUserInput('Do you need to simplify code by reducing dependencies? (yes/no): '),
        optimizePerformance: await getUserInput('Do you need to optimize performance-critical sections? (yes/no): '),
        documentChanges: await getUserInput('Do you need to document refactoring changes? (yes/no): '),
        specificFile: await getUserInput('Is there a specific file to refactor? (provide file path or leave blank): ')
      };
      break;
    case 'onboarding':
      details = {
        codeWalkthrough: await getUserInput('Do you need detailed code walkthroughs? (yes/no): '),
        unitTests: await getUserInput('Do you need unit tests for key components? (yes/no): '),
        environmentSetup: await getUserInput('Do you need help with development environment setup? (yes/no): '),
        documentationReview: await getUserInput('Do you need documentation review? (yes/no): ')
      };
      break;
    case 'problem-solving':
      details = {
        problemStatement: await getUserInput('Please provide a detailed problem statement: '),
        objective: await getUserInput('What is the objective of solving this problem? ')
      };
      break;
    // Add similar cases for other tasks
    // ...
  }
  return details;
};

// Function to get dependencies of a specific file
const getFileDependencies = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return extractDependencies(content);
  } catch (error) {
    console.error(`${colors.red}Error reading file ${filePath}: ${error}${colors.reset}`);
    return [];
  }
};

// Function to propose actions based on the task and detailed info
const proposeActions = async (task, specificMessage, analysisResult, drillDown, details) => {
  let actionsProposal = `Based on the task '${task}', the following actions are proposed:\n\n`;

  if (drillDown) {
    switch (task) {
      case 'refactoring':
        if (details.largeFiles.toLowerCase() === 'yes') {
          actionsProposal += '1. Identify and refactor large or complex files.\n';
        }
        if (details.reduceDependencies.toLowerCase() === 'yes') {
          actionsProposal += '2. Simplify code by reducing dependencies.\n';
        }
        if (details.optimizePerformance.toLowerCase() === 'yes') {
          actionsProposal += '3. Optimize performance-critical sections.\n';
        }
        if (details.documentChanges.toLowerCase() === 'yes') {
          actionsProposal += '4. Document refactoring changes.\n';
        }
        if (details.specificFile) {
          const dependencies = await getFileDependencies(details.specificFile);
          actionsProposal += `5. Refactor specific file: ${details.specificFile}.\n`;
          actionsProposal += `   Dependencies: ${dependencies.join(', ')}\n`;
        }
        break;
      case 'onboarding':
        if (details.codeWalkthrough.toLowerCase() === 'yes') {
          actionsProposal += '1. Conduct detailed code walkthroughs.\n';
        }
        if (details.unitTests.toLowerCase() === 'yes') {
          actionsProposal += '2. Write unit tests for key components.\n';
        }
        if (details.environmentSetup.toLowerCase() === 'yes') {
          actionsProposal += '3. Set up development environment.\n';
        }
        if (details.documentationReview.toLowerCase() === 'yes') {
          actionsProposal += '4. Review documentation.\n';
        }
        break;
      case 'problem-solving':
        actionsProposal += `1. Define the problem statement: ${details.problemStatement}\n`;
        actionsProposal += `2. Set the objective: ${details.objective}\n`;
        actionsProposal += '3. Conduct root cause analysis.\n';
        actionsProposal += '4. Generate potential solutions.\n';
        actionsProposal += '5. Evaluate and select the best solution.\n';
        actionsProposal += '6. Implement the chosen solution.\n';
        actionsProposal += '7. Monitor and verify the solution’s effectiveness.\n';
        actionsProposal += '8. Document the problem-solving process and outcomes.\n';
        break;
      // Add similar cases for other tasks
      // ...
    }
  } else {
    actionsProposal += '1. General analysis and recommendations.\n';
  }

  if (specificMessage) {
    actionsProposal += `\nSpecific Message: ${specificMessage}\n`;
  }

  actionsProposal += `\nAnalysis Result:\n${analysisResult}`;
  return actionsProposal;
};

// Function to request clarification from the user
const requestClarification = async (question) => {
  const clarification = await getUserInput(question);
  return clarification;
};

// Function to provide progress updates to the user
const provideProgressUpdate = (update) => {
  console.log(`Progress Update: ${update}`);
};

// Function to handle feedback loop
const feedbackLoop = async (proposal) => {
  console.log(`Proposal: ${proposal}`);
  const userFeedback = await getUserInput('Do you have any feedback or changes to this proposal? (yes/no): ');

  if (userFeedback.toLowerCase() === 'yes') {
    const feedback = await getUserInput('Please provide your feedback: ');
    return feedback;
  }

  return null;
};

// Function to update version file and script version
const updateVersion = async () => {
  const currentVersion = await getCurrentVersion();
  const newVersion = incrementVersion(currentVersion);
  await fs.writeFile(versionFile, newVersion);

  const scriptContent = await fs.readFile(scriptPath, 'utf-8');
  const versionRegex = /const currentScriptVersion = '0.0.26';/;
  const updatedScriptContent = scriptContent.replace(versionRegex, `const currentScriptVersion = '${newVersion}';`);
  await fs.writeFile(scriptPath, updatedScriptContent);

  console.log(`${colors.green}Updated to version ${newVersion}${colors.reset}`);
};

// Function to perform initial analysis
const initialAnalysis = async () => {
  console.log('Performing initial analysis...');
  // Simulate analysis result
  const analysisResult = 'Analysis result: ...';
  return analysisResult;
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

// Main function
const main = async () => {
  console.log(`${colors.green}Starting process...${colors.reset}`);
  try {
    await fs.writeFile(outputFile, '');
    await updateVersion();
    const currentVersion = await getCurrentVersion();
    const timestamp = new Date().toISOString();

    const { task, specificMessage } = await checkPrefilledCode();
    provideProgressUpdate(`Task: ${task}`);
    provideProgressUpdate(`Specific Message: ${specificMessage}`);

    const drillDown = (await getUserInput('Do you want to drill down into detailed actions? (yes/no): ')).toLowerCase() === 'yes';
    const details = drillDown ? await gatherDetailedInfo(task) : {};

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

    const analysisResult = await initialAnalysis();
    let actionsProposal = await proposeActions(task, specificMessage, analysisResult, drillDown, details);

    provideProgressUpdate('Initial analysis completed.');

    let feedback;
    do {
      feedback = await feedbackLoop(actionsProposal);

      if (feedback) {
        actionsProposal = `Revised Proposal based on feedback:\n${feedback}\n\nOriginal Proposal:\n${actionsProposal}`;
        provideProgressUpdate('Proposal revised based on feedback.');
      }
    } while (feedback);

    const userApproval = await getUserInput('Do you approve these actions? (yes/no): ');

    if (userApproval.toLowerCase() !== 'yes') {
      console.log('Action proposal not approved. Please restart the script and provide new instructions.');
      process.exit(1);
    }

    console.log(`${colors.green}Proceeding with approved actions...${colors.reset}`);
    // Proceed with the rest of the script based on the approved actions

    await summarize();
    await fs.appendFile(outputFile, `\nAI Onboarding Instructions:\n${aiOnboardingInstructions(currentVersion, timestamp)}\n`);
    console.log(`${colors.green}AI onboarding instructions added.${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}An error occurred: ${error}${colors.reset}`);
  }
};

main();
