const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /bg-\[#0F1115\]/g, replace: 'bg-slate-50 dark:bg-[#0F1115]' },
  { search: /bg-\[#14171C\]/g, replace: 'bg-white dark:bg-[#14171C]' },
  { search: /bg-\[#17191E\]/g, replace: 'bg-white dark:bg-[#17191E]' },
  { search: /bg-\[#1C1F26\]/g, replace: 'bg-slate-50 dark:bg-[#1C1F26]' },
  { search: /bg-\[#0B0D11\]/g, replace: 'bg-slate-100 dark:bg-[#0B0D11]' },
  { search: /bg-\[#1A1F26\]/g, replace: 'bg-slate-200 dark:bg-[#1A1F26]' },
  { search: /bg-\[#1C2027\]/g, replace: 'bg-slate-200 dark:bg-[#1C2027]' },
  { search: /bg-\[#07090C\]/g, replace: 'bg-slate-200 dark:bg-[#07090C]' },
  { search: /bg-\[#2E3541\]/g, replace: 'bg-slate-300 dark:bg-[#2E3541]' },
  { search: /bg-\[#101216\]/g, replace: 'bg-white dark:bg-[#101216]' },
  { search: /border-\[#1E222B\]/g, replace: 'border-slate-200 dark:border-[#1E222B]' },
  { search: /border-\[#161A22\]/g, replace: 'border-slate-200 dark:border-[#161A22]' },
  { search: /border-\[#1A1F26\]/g, replace: 'border-slate-200 dark:border-[#1A1F26]' },
  { search: /border-\[#2E3541\]/g, replace: 'border-slate-300 dark:border-[#2E3541]' },
  { search: /border-slate-800/g, replace: 'border-slate-200 dark:border-slate-800' },
  { search: /border-slate-850/g, replace: 'border-slate-200 dark:border-slate-800' },
  { search: /border-slate-700/g, replace: 'border-slate-300 dark:border-slate-700' },
  { search: /text-slate-200/g, replace: 'text-slate-800 dark:text-slate-200' },
  { search: /text-slate-300/g, replace: 'text-slate-700 dark:text-slate-300' },
  { search: /text-slate-400/g, replace: 'text-slate-500 dark:text-slate-400' },
  { search: /text-slate-500/g, replace: 'text-slate-500 dark:text-slate-400' },
  { search: /text-slate-600/g, replace: 'text-slate-500 dark:text-slate-600' },
  { search: /text-white/g, replace: 'text-slate-900 dark:text-white' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Guard to prevent double replacing if script is run multiple times
  // Not strictly perfect but good enough for a one-off
  
  replacements.forEach(({ search, replace }) => {
    // Only replace if not already part of a dark: class
    content = content.replace(search, (match, offset, string) => {
      const precedingStr = string.slice(Math.max(0, offset - 5), offset);
      if (precedingStr.includes('dark:')) return match;
      if (precedingStr.includes('hover:')) return match; // handle hover separately if needed
      return replace;
    });
  });

  // Handle hovers manually
  content = content.replace(/hover:bg-\[#1C1F26\]/g, 'hover:bg-slate-100 dark:hover:bg-[#1C1F26]');
  content = content.replace(/hover:bg-\[#14171C\]/g, 'hover:bg-slate-100 dark:hover:bg-[#14171C]');
  content = content.replace(/hover:bg-\[#1C2027\]/g, 'hover:bg-slate-300 dark:hover:bg-[#1C2027]');
  content = content.replace(/hover:bg-\[#2E3541\]/g, 'hover:bg-slate-300 dark:hover:bg-[#2E3541]');
  content = content.replace(/hover:bg-\[#1E222B\]/g, 'hover:bg-slate-200 dark:hover:bg-[#1E222B]');
  content = content.replace(/hover:text-white/g, 'hover:text-slate-900 dark:hover:text-white');
  content = content.replace(/hover:text-slate-200/g, 'hover:text-slate-800 dark:hover:text-slate-200');
  content = content.replace(/hover:border-slate-700/g, 'hover:border-slate-400 dark:hover:border-slate-700');

  // Specific fixes
  content = content.replace(/dark:text-slate-800 dark:text-slate-200/g, 'dark:text-slate-200');
  content = content.replace(/dark:text-slate-500 dark:text-slate-400/g, 'dark:text-slate-400');
  content = content.replace(/dark:text-slate-700 dark:text-slate-300/g, 'dark:text-slate-300');
  content = content.replace(/dark:text-slate-900 dark:text-white/g, 'dark:text-white');
  content = content.replace(/text-slate-900 dark:text-white font-bold flex items-center justify-center/g, 'text-white font-bold flex items-center justify-center');
  content = content.replace(/text-slate-900 dark:text-white font-extrabold flex items-center justify-center/g, 'text-white font-extrabold flex items-center justify-center');
  // Revert buttons/badges text color that should just stay white
  content = content.replace(/bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white/g, 'bg-indigo-600 hover:bg-indigo-500 text-white');
  content = content.replace(/bg-indigo-500 text-slate-900 dark:text-white/g, 'bg-indigo-500 text-white');
  content = content.replace(/bg-rose-500 text-slate-900 dark:text-white/g, 'bg-rose-500 text-white');
  content = content.replace(/bg-emerald-500 text-slate-900 dark:text-white/g, 'bg-emerald-500 text-white');

  fs.writeFileSync(filePath, content, 'utf8');
}

const dir = path.join(__dirname, 'src/components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(f => {
  processFile(path.join(dir, f));
});
processFile(path.join(__dirname, 'src/App.tsx'));

console.log("Done");
