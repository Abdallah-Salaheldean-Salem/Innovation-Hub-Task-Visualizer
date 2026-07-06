const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add import
content = content.replace(
  'import { INITIAL_PROJECTS } from "./data";',
  'import { INITIAL_PROJECTS } from "./data";\nimport { fetchProjects, saveProjectsBulk } from "./lib/supabase-sync";'
);

// Add fetch on mount
content = content.replace(
  'const [projects, setProjects] = useState<Project[]>(() => {',
  `// Fetch from Supabase on mount (if configured)
  useEffect(() => {
    fetchProjects().then((data) => {
      if (data && data.length > 0) {
        setProjects(data);
      }
    });
  }, []);

  const [projects, setProjects] = useState<Project[]>(() => {`
);

// Add save to Supabase
content = content.replace(
  /  \/\/ Sync to localStorage\n  useEffect\(\(\) => \{\n    localStorage\.setItem\("clickup_projects", JSON\.stringify\(projects\)\);\n  \}, \[projects\]\);/,
  `  // Sync to localStorage and Supabase
  useEffect(() => {
    localStorage.setItem("clickup_projects", JSON.stringify(projects));
    saveProjectsBulk(projects).catch(console.error);
  }, [projects]);`
);

fs.writeFileSync('src/App.tsx', content);
