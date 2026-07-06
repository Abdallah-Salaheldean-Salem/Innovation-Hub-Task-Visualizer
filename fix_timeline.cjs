const fs = require('fs');

let content = fs.readFileSync('src/components/TimelineView.tsx', 'utf8');

// Replace standard cases where the right side has a dark: prefix already
// Wait, actually let's just use a regex to combine them carefully.
content = content.replace(/isLight \? "([^"]*)" : "([^"]*)"/g, (match, left, right) => {
  // If left is just text/icons that don't conflict, and right is dark only
  // Let's do this: we extract all classes from both sides.
  let classes = new Set();
  
  // 1. If the right side has `dark:` prefixes, it usually means my previous sed hit it.
  // We can just use the right side, but we should make sure we preserve any missing light classes.
  // Actually, the right side usually has `bg-white dark:bg-[#14171C]` so the light class IS there!
  // But for something like `isLight ? "text-indigo-600" : "text-indigo-400"`, the right side is just `"text-indigo-400"`.
  
  const rightParts = right.split(' ').filter(Boolean);
  const leftParts = left.split(' ').filter(Boolean);
  
  // If the right side doesn't contain any `dark:` classes, we prefix every right class with `dark:` and combine with left.
  const rightHasDark = rightParts.some(p => p.startsWith('dark:'));
  
  if (!rightHasDark && leftParts.length > 0 && rightParts.length > 0) {
    if (left === "Classic Light Mode" || left === "dark") return match; // Skip text and button logic
    const newRight = rightParts.map(p => `dark:${p}`).join(' ');
    return `"${left} ${newRight}"`;
  }
  
  // If the right side already has dark classes from previous mass-sed
  if (rightHasDark) {
    // The previous mass-sed replaced "bg-[#14171C]" with "bg-white dark:bg-[#14171C]".
    // This means the right side already contains BOTH light and dark mode classes!
    // So we can often just return the right side.
    // Let's verify by just returning the right side.
    return `"${right}"`;
  }
  
  return match;
});

// Remove the theme button logic manually
content = content.replace(/<button[^>]*onClick=\{\(\) => setThemeMode\(isLight \? "dark" : "light"\)\}[^>]*>[\s\S]*?<\/button>/, '');
// Remove the isLight definition
content = content.replace(/const isLight = themeMode === "light";/, 'const isLight = true; // DEPRECATED');

fs.writeFileSync('src/components/TimelineView.tsx', content, 'utf8');
