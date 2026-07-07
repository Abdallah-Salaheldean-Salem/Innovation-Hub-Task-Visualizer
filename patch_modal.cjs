const fs = require('fs');
let content = fs.readFileSync('src/components/TaskModal.tsx', 'utf8');

const replacements = [
  { search: /bg-white rounded-xl/g, replace: "bg-white dark:bg-[#1C1F26] rounded-xl" },
  { search: /border border-slate-200/g, replace: "border border-slate-200 dark:border-[#1E222B]" },
  { search: /text-slate-800/g, replace: "text-slate-800 dark:text-slate-200" },
  { search: /bg-slate-50/g, replace: "bg-slate-50 dark:bg-[#0F1115]" },
  { search: /border-slate-100/g, replace: "border-slate-100 dark:border-[#161A22]" },
  { search: /bg-indigo-100/g, replace: "bg-indigo-100 dark:bg-indigo-500/10" },
  { search: /text-indigo-700/g, replace: "text-indigo-700 dark:text-indigo-400" },
  { search: /border-indigo-200/g, replace: "border-indigo-200 dark:border-indigo-500/20" },
  { search: /hover:bg-slate-200/g, replace: "hover:bg-slate-200 dark:hover:bg-[#1E222B]" },
  { search: /text-slate-900/g, replace: "text-slate-900 dark:text-white" },
  { search: /text-slate-700/g, replace: "text-slate-700 dark:text-slate-300" },
  { search: /hover:text-slate-500/g, replace: "hover:text-slate-500 dark:hover:text-slate-400" },
  { search: /bg-white/g, replace: "bg-white dark:bg-[#14171C]" },
  { search: /hover:bg-slate-100/g, replace: "hover:bg-slate-100 dark:hover:bg-[#1E222B]" },
  { search: /border-slate-300/g, replace: "border-slate-300 dark:border-slate-600" },
];

replacements.forEach(r => {
  content = content.replace(r.search, r.replace);
});

// Since we replaced bg-white with bg-white dark:bg-[#14171C], let's fix the first one which became bg-white dark:bg-[#14171C] dark:bg-[#1C1F26] rounded-xl
content = content.replace(/bg-white dark:bg-\[\#14171C\] dark:bg-\[\#1C1F26\]/g, "bg-white dark:bg-[#1C1F26]");

fs.writeFileSync('src/components/TaskModal.tsx', content, 'utf8');
console.log("Patched TaskModal.tsx");
