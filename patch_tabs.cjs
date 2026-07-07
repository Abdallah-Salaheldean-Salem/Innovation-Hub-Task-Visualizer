const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldTabs = `  const tabItems = [
    { value: "activity" as AppView, label: "Daily Logs", icon: "☕" },
    { value: "board" as AppView, label: "Board View", icon: "📊" },
    { value: "list" as AppView, label: "Spreadsheet", icon: "📋" },
    { value: "calendar" as AppView, label: "Calendar Grid", icon: "📅" },
    { value: "team" as AppView, label: "Team View", icon: "👥" },
    { value: "gantt" as AppView, label: "Gantt Chart", icon: "📈" },
    { value: "ideas" as AppView, label: "Ideas & Priorities", icon: "💡" },
    { value: "settings" as AppView, label: "Settings", icon: "⚙️" },
  ];`;

const newTabs = `  const tabItems = [
    { value: "activity" as AppView, label: "Daily Logs", icon: "☕" },
    { value: "board" as AppView, label: "Board View", icon: "📊" },
    { value: "list" as AppView, label: "Spreadsheet", icon: "📋" },
    { value: "calendar" as AppView, label: "Calendar Grid", icon: "📅" },
    { value: "gantt" as AppView, label: "Gantt Chart", icon: "📈" },
    { value: "team" as AppView, label: "Team View", icon: "👥" },
    { value: "ideas" as AppView, label: "Ideas & Priorities", icon: "💡" },
    { value: "settings" as AppView, label: "Settings", icon: "⚙️" },
  ];`;

content = content.replace(oldTabs, newTabs);
fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log("Tabs reordered in App.tsx");
