const fs = require('fs');

const dataTsPath = 'src/data.ts';
let dataTsContent = fs.readFileSync(dataTsPath, 'utf8');

const projectData = fs.readFileSync('parsed_project.json', 'utf8');

// Find the last `];` before `// Seed classification`
const targetStr = `  }\n];`;
const replaceStr = `  },\n${projectData}\n];`;

if (dataTsContent.includes(targetStr)) {
  dataTsContent = dataTsContent.replace(targetStr, replaceStr);
  fs.writeFileSync(dataTsPath, dataTsContent);
  console.log("Successfully injected the parsed project into src/data.ts");
} else {
  console.log("Could not find the target string to replace in src/data.ts");
}
