const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

const ideas = [
  { id: "idea-1", timeHorizon: "Next Month", title: "Define policies & entities", description: "", targetDate: "", status: "Ready", priority: "High", zone: "Zone 1: Ready to Start (Important and Urgent)" },
  { id: "idea-2", timeHorizon: "Next Month", title: "Build fixed-asset report (safety focus)", description: "", targetDate: "", status: "Ready", priority: "High", zone: "Zone 1: Ready to Start (Important and Urgent)" },
  { id: "idea-3", timeHorizon: "Next Month", title: "Roll out QR-code system for assets", description: "", targetDate: "", status: "Ready", priority: "High", zone: "Zone 1: Ready to Start (Important and Urgent)" },
  { id: "idea-4", timeHorizon: "Next Month", title: "Set up electronic / general workbench", description: "", targetDate: "", status: "Ready", priority: "High", zone: "Zone 1: Ready to Start (Important and Urgent)" },
  { id: "idea-5", timeHorizon: "Someday", title: "Safety: manufacturing lab & all equipment", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-6", timeHorizon: "Someday", title: "CNC Router - register as fixed asset", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-7", timeHorizon: "Someday", title: "Set up data logger", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-8", timeHorizon: "Someday", title: "Innovation content on LinkedIn", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-9", timeHorizon: "Someday", title: "Document sequence of operation", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-10", timeHorizon: "Someday", title: "Project: Mobile robot", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-11", timeHorizon: "Someday", title: "Project: Tesla coil", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-12", timeHorizon: "Someday", title: "Project: 3D Watcher", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-13", timeHorizon: "Someday", title: "Project: [unclear name]", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-14", timeHorizon: "Someday", title: "Project: Tool Watcher", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-15", timeHorizon: "Someday", title: "Project: Motor control", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-16", timeHorizon: "Someday", title: "Project: [unclear name]", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-17", timeHorizon: "Someday", title: "Project: [unclear name]", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-18", timeHorizon: "Someday", title: "Project: Cold welding + [unclear]", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-19", timeHorizon: "Someday", title: "Project: Inverter", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-20", timeHorizon: "Someday", title: "Project: Automate Visualizer [unclear]", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-21", timeHorizon: "Someday", title: "Project: PID controller", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-22", timeHorizon: "Someday", title: "Project: [unclear] printer", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-23", timeHorizon: "Someday", title: "Tool-handout system & project", description: "", targetDate: "", status: "In Progress", priority: "Medium", zone: "Zone 2: Building / Refining (Important and Not Urgent)" },
  { id: "idea-24", timeHorizon: "Someday", title: "Email automation + work dashboard + decision log", description: "", targetDate: "", status: "In Progress", priority: "Medium", zone: "Zone 2: Building / Refining (Important and Not Urgent)" },
  { id: "idea-25", timeHorizon: "Someday", title: "Establish PCB production line", description: "", targetDate: "", status: "In Progress", priority: "Medium", zone: "Zone 2: Building / Refining (Important and Not Urgent)" },
  { id: "idea-26", timeHorizon: "Someday", title: "Run LinkedIn sessions", description: "", targetDate: "", status: "In Progress", priority: "Medium", zone: "Zone 2: Building / Refining (Important and Not Urgent)" },
  { id: "idea-27", timeHorizon: "Someday", title: "KPI emails + Microsoft Forms", description: "", targetDate: "", status: "In Progress", priority: "Medium", zone: "Zone 2: Building / Refining (Important and Not Urgent)" },
  { id: "idea-28", timeHorizon: "Someday", title: "Odoo crash course - Inventory", description: "", targetDate: "", status: "In Progress", priority: "Medium", zone: "Zone 2: Building / Refining (Important and Not Urgent)" },
  { id: "idea-29", timeHorizon: "Next Month", title: "Resolve chair problem", description: "", targetDate: "", status: "Pending", priority: "High", zone: "Zone 3: Planning / Defining (Not Important and Urgent)" },
  { id: "idea-30", timeHorizon: "Next Month", title: "PCB session - green light & prep", description: "", targetDate: "", status: "Pending", priority: "High", zone: "Zone 3: Planning / Defining (Not Important and Urgent)" },
  { id: "idea-31", timeHorizon: "Next Month", title: "Add gamification to Project Map", description: "", targetDate: "", status: "Ready", priority: "High", zone: "Zone 1: Ready to Start (Important and Urgent)" },
  { id: "idea-32", timeHorizon: "Next Month", title: "Action item: Ahmed Ibrahim", description: "", targetDate: "", status: "Ready", priority: "High", zone: "Zone 1: Ready to Start (Important and Urgent)" },
  { id: "idea-33", timeHorizon: "Next Month", title: "3D Printers Amr Safwat Report", description: "", targetDate: "", status: "Ready", priority: "High", zone: "Zone 1: Ready to Start (Important and Urgent)" },
  { id: "idea-34", timeHorizon: "Someday", title: "Project : Radio TA5767", description: "", targetDate: "", status: "Pending", priority: "Low", zone: "Zone 4: On Hold / Wishlist (Not Important and Not Urgent)" },
  { id: "idea-35", timeHorizon: "Next Month", title: "Battries Sessions", description: "", targetDate: "2026-07-16", status: "Not Started", priority: "Medium", zone: "Zone 3: Planning / Defining (Not Important and Urgent)" }
];

content = content.replace("ideas: [],", "ideas: " + JSON.stringify(ideas, null, 4) + ",");

fs.writeFileSync('src/data.ts', content, 'utf8');
console.log("data.ts patched");
