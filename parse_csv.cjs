const fs = require('fs');

const csvData = `"edit the text to be ""Logged Time"" not ""Logged Time (Option)""",Task Name,Status,Priority,Assignee,Start Date,Due Date,Duration,Est Hours,Act Hours,Location,Notes
TASK-003,Innovation Hub Visualizer Kit ,Completed,Medium,Abdallah,46192,46192,1,5,5,Office/Remote,Logged from Daily Logs board
TASK-006,Test Run v0.2,Completed,Critical,Abdallah,46193,46193,1,1,1,Office/Remote,[At 02:00 AM] Stest run of the visualizer V0.2
TASK-007,ECE Measurement Test Out,Completed,Medium,Sallam,46193,46193,1,8,8,Office/Remote,[At 09:00 AM] ECE Department Measurement Testout Sessions
TASK-008,Tasneem 3D Printing,Completed,Medium,Unassigned,46194,46194,1,1,4,Office/Remote,"[At 09:00 AM] 
-D:\\Abdallah Salaheldean\\Innovation\\3D-Printing\\Tasneem Tarek Abdelkereem\\21-6-2026\\New Print 2023\\200 mm\\0_Taber ratio"
TASK-009,3D Printing Variable Layer Height,Completed,Medium,Unassigned,46194,46194,1,1,1,Office/Remote,"[At 09:00 AM] - https://www.youtube.com/shorts/jVD0irMC4L8

- Find a Model to try it out - Done

- https://www.youtube.com/watch?v=gTQg5fSs_as&t=39s"
TASK-010,3D Printing Thermal Tower,Completed,Medium,Unassigned,46194,46194,1,1,1,Office/Remote,"[At 09:00 AM] - https://www.youtube.com/watch?v=WR2tRwzFlq0&t=83s
-https://www.printables.com/model/20652-temp-tower-pla-petg-absasa-for-prusa-mini-mk3s-and"
TASK-011,Masters,Completed,Critical,Sallam,46192,46195,4,10,0,Remote,[At 09:00 AM] 
TASK-012,3DP G-Code,Completed,Medium,Abdallah,46195,46196,2,4,4,Office/Remote,"[At 09:00 AM] Eng. Shad - Check that the G Code matches the prusa

# ROLE
You are a G-code verification assistant. Your job is to examine a G-code file and
determine whether it is safe to print on my specific 3D printer. Be precise and
conservative: when something is ambiguous or missing, say so rather than assuming.

# MY PRINTER (the target)
- Model: Prusa i3 MK3S+ (MK3S-compatible G-code is fine)
- Nozzle: 0.4 mm
- Build volume: 250 (X) × 210 (Y) × 210 (Z) mm
- Firmware: Marlin (Prusa fork)
- File format expected: plain-text .gcode (NOT binary .bgcode)

# WHAT TO DO
Read the file's header/config comments AND scan the actual motion commands.
Do not rely only on the comment block — verify against the real G-code body.
Then run every check below and report findings.

# HARD RULES (a FAIL on any of these = ""DO NOT PRINT"")
1. NOZZLE: Find nozzle_diameter. If it is not 0.4 mm, FAIL.
2. BUILD VOLUME: Scan all X/Y/Z coordinates in the motion commands. If any
   X > 250, Y > 210, or Z > 210, the model won't fit — FAIL. Report the max
   X, Y, Z actually reached.
3. FLAVOR: Confirm the G-code flavor is Marlin. If it is Klipper, RepRap/Duet,
   Bambu/X1-specific, or anything non-Marlin, FAIL.
4. PRINTER MODEL: Look for printer_model / compatible printers / settings IDs.
   - If it names a Prusa MK3S/MK3S+, PASS this check.
   - If it names a DIFFERENT printer (MK4, MINI, Ender, Bambu, etc.), FAIL.
5. FILE TYPE: If the content is binary/garbled rather than readable text
   commands, it may be .bgcode — FAIL and tell me to re-export as plain G-code.
6. UNSUPPORTED COMMANDS: Flag any machine-specific codes the Prusa Marlin
   firmware would not understand — e.g. AMS/multi-material toolchanges, vendor-
   only M-codes (Bambu, Klipper macros). Note them. Core moves (G0/G1/G2/G3,
   G28, G29, M104/M109/M140/M190, M106) are all fine.

# SAFETY CHECKS (a problem here = ""PRINT WITH CAUTION"", not an automatic fail)
7. TEMPERATURES: Report nozzle and bed temps (M104/M109/M140/M190). Flag if
   nozzle > 300 °C or bed > 120 °C, or if temps look wrong for the stated
   filament (e.g. PLA above ~230 °C, or 0 °C where heat is expected).
8. MODEL-CHECK LINE: Note whether an M862.3 model-check line is present.
   - Present and matching MK3S = good, the printer will self-verify.
   - ABSENT (common when sliced in non-Prusa slicers like Bambu Studio or Cura)
     = the printer will NOT verify the model itself, so I'm trusting the profile.
     Tell me this so I watch the first layer.
9. START/END SEQUENCE: Confirm there's a sane startup (home G28, usually mesh
   leveling G29, a purge/intro line) and a sane ending (turn off heaters M104 S0
   / M140 S0, fan off M107, park, disable motors M84). Flag if missing.
10. BED ORIGIN / OFFSETS: Note if coordinates look shifted off the bed or use an
    unexpected origin that could cause the nozzle to crash or print off-plate.

# SLICER NOTE
Identify which slicer and version produced the file (from the header). It's OK
if it's not PrusaSlicer (e.g. Bambu Studio or Cura targeting a Prusa profile) —
just confirm the profile/settings actually target the MK3S and the rules above pass.

# OUTPUT FORMAT (use exactly this)
**VERDICT:** ✅ SAFE TO PRINT  /  ⚠️ PRINT WITH CAUTION  /  ❌ DO NOT PRINT

**Sliced by:** <slicer + version>
**Target printer in file:** <printer_model found>
**Nozzle:** <value>
**Max dimensions reached:** X__ Y__ Z__ (vs limits 250×210×210)
**Flavor:** <Marlin / other>
**Temps:** nozzle __°C, bed __°C  (filament: __)
**M862.3 model check:** present / absent
**Start/End sequence:** ok / issues

**Why:** <2–4 sentence plain explanation of the verdict>
**Watch out for:** <anything I should monitor, or ""nothing — looks clean"">"
TASK-013,Robotino Day 2 Report,Completed,Medium,Unassigned,46196,46197,2,1,1,Office/Remote,[At 09:00 AM] Write a report and a LinkedIn link here
TASK-014,Robotino Sessions,Completed,Medium,Unassigned,46195,46198,4,32,8,Office/Remote,[At 09:00 AM] Logged from Daily Logs board
TASK-015,shahd printing  files  ,Completed,Medium,Unassigned,46196,46196,1,3,3,Office/Remote,"[At 09:00 AM] together

D:\\sallam\\shahad\\G-codes for printing
D638 Type 1 _50_Cubic_PLA+_31m31s_7.94g.gcode"
TASK-016,Tasneem 3D printing 200 mm,Completed,Low,Unassigned,46196,46197,2,12,12,Office/Remote,[At 09:00 AM] D:\\Abdallah Salaheldean\\Innovation\\3D-Printing\\Tasneem Tarek Abdelkereem\\21-6-2026\\New Print 2023\\200 mm\\0.2_Taber ratio
TASK-017,Entity Survey : Eltoukhy Learning Factory ,Completed,Medium,Abdallah,46199,46199,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-018,Entity Survey : Ain Shams University iHub,Completed,Medium,Abdallah,46200,46201,2,4,4,Office/Remote,[At 09:00 AM] Logged from Daily Logs board
TASK-019, 3D Printers Amr Safwat Report,In Progress,Medium,Sallam,46201,46201,1,4,4,Office/Remote,[At 10:45 AM] Logged from Daily Logs board
TASK-020,3D Printing Shahd,Completed,Medium,Unassigned,46201,46201,1,4,4,Office/Remote,[At 09:00 AM] D:\\Abdallah Salaheldean\\Innovation\\3D-Printing\\Shahd\\25-06-2026\\1_D638 Type 1 _50_Grid_PLA+_32m14s_7.93g
TASK-021,3D Printing Egals,Completed,Medium,Unassigned,46201,46201,1,4,4,Office/Remote,[At 09:00 AM] D:\\Abdallah Salaheldean\\Innovation\\3D-Printing\\Eagles\\28-06-2026\\air cover 1 p1
TASK-022,Civil Shaker Request and Foam Cutting,Completed,Medium,Unassigned,46201,46201,1,1,1,Office/Remote,[At 04:00 PM] Logged from Daily Logs board
TASK-023,Mohannad 3D Printing,In Progress,Medium,Unassigned,46202,46202,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-024,Shahd 3D Printing,Completed,Medium,Unassigned,46202,46202,1,4,4,Office/Remote,[At 09:00 AM] D:\\Abdallah Salaheldean\\Innovation\\3D-Printing\\Shahd\\25-06-2026\\2_D638 Type 1 _50_Honeycomb_PLA+_51m11s_8.43g.gcode
TASK-025,Eman/David Thermal Device,Blocked,Medium,Sallam,46202,46202,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-026,ESP-Cam 3D Printer and Tools Monitoring,Not Started,Medium,Abdallah,46202,46202,1,4,4,Office/Remote,[At 09:00 AM] Logged from Daily Logs board
TASK-027,Electronic Workbench,In Progress,Medium,Abdallah,46202,46202,1,4,4,Office/Remote,[At 09:00 AM] Logged from Daily Logs board
TASK-028,Ahmed Ibrahim تصفية العهدة,Blocked,Medium,Unassigned,46202,46202,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-029,Claude Code Vercel Visualizer Web-Kit,In Progress,Medium,Abdallah,46192,46192,1,10,0,Remote,[At 09:00 AM] 
TASK-030,Eagles Printing,Completed,Medium,Unassigned,46208,46208,1,3,3,Office/Remote,[At 09:00 AM] Logged from Daily Logs board
TASK-031,HPDE Manfacting With Civil Eng. Mohammed Mohsen,In Progress,Medium,Unassigned,46208,46208,1,4,4,Office/Remote,[At 01:00 PM] Logged from Daily Logs board
TASK-032,Prusa Thermal Modle Error,Completed,Medium,Abdallah,46208,46208,1,4,4,Office/Remote,[At 09:00 AM] Logged from Daily Logs board
TASK-033,Summer Workshop (PCB),Not Started,Medium,Unassigned,46230,46230,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-034,Orentation session (For Innovaton Hub) and Quizz,Not Started,Medium,Unassigned,46238,46238,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-035,System for story when the student enter the innovation till he leaves,Not Started,Medium,Unassigned,46238,46238,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-036,Reply for laser cutting email,In Progress,Medium,Sallam,46211,46211,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-037,Meeting with Dr. Haytham,Completed,Medium,Sallam,46211,46211,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-038,Debugging Printer ,Completed,Medium,Sallam,46211,46211,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-039,Debgging Printer,Completed,Medium,Sallam,46210,46210,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-040,Inventroy Assets Assistance ,Completed,Medium,Sallam,46210,46210,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-041,Mohannad Cubic 3D Printer,Completed,Medium,Sallam,46209,46209,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-042,3D Printer Debugging Methodolgy,Not Started,Medium,Unassigned,46212,46212,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-043,Dr Amr Safwat Presentation,Not Started,Medium,Unassigned,46212,46212,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-044,SolidWorks Training,Not Started,Medium,Unassigned,46212,46212,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-045,David Flapping Meeting,Not Started,Medium,Unassigned,46212,46212,1,4,4,Office/Remote,[At 10:00 AM] Logged from Daily Logs board
TASK-046,Agile Methodology,Not Started,Medium,Unassigned,46215,46215,1,4,4,Office/Remote,[At 09:00 AM] Logged from Daily Logs board`;

function parseCSV(text) {
  const result = [];
  let row = [];
  let inQuotes = false;
  let currentValue = "";
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"' && inQuotes && nextChar === '"') {
      currentValue += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(currentValue);
      currentValue = "";
    } else if (char === '\n' && !inQuotes) {
      row.push(currentValue);
      result.push(row);
      row = [];
      currentValue = "";
    } else if (char !== '\r') {
      currentValue += char;
    }
  }
  if (currentValue || row.length > 0) {
    row.push(currentValue);
    result.push(row);
  }
  return result;
}

const rows = parseCSV(csvData);

function parseExcelDate(excelDateStr) {
  const excelDate = parseInt(excelDateStr);
  if (isNaN(excelDate)) return "";
  const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  return date.toISOString().split('T')[0];
}

const tasks = rows.slice(1).map(row => {
  if (row.length < 10) return null;
  const statusMap = {
    'Completed': 'col-done',
    'In Progress': 'col-progress',
    'Not Started': 'col-todo',
    'Blocked': 'col-blocked'
  };
  const status = statusMap[row[2]] || 'col-todo';
  
  const priorityMap = {
    'Critical': 'urgent',
    'High': 'high',
    'Medium': 'medium',
    'Low': 'low'
  };
  const priority = priorityMap[row[3]] || 'medium';
  
  return {
    id: row[0],
    title: row[1] ? row[1].trim() : "Untitled Task",
    description: "",
    status: status,
    priority: priority,
    assignee: row[4] || 'Unassigned',
    startDate: parseExcelDate(row[5]),
    dueDate: parseExcelDate(row[6]),
    estimatedHours: parseFloat(row[8]) || 0,
    actualHours: parseFloat(row[9]) || 0,
    location: row[10] || "",
    notes: row[11] || "",
    subtasks: [],
    comments: [],
    createdAt: parseExcelDate(row[5]) || new Date().toISOString().split('T')[0],
    tags: []
  };
}).filter(t => t !== null);

const output = {
  id: "proj-innovation-hub-sync",
  name: "Sync Data - Innovation Hub",
  description: "Tasks synced from CSV.",
  tags: [],
  modules: [],
  goals: [],
  parentId: "proj-innovation-hub",
  color: "#3b82f6",
  icon: "📊",
  columns: [
    { id: "col-todo", title: "To Do", color: "#64748b" },
    { id: "col-progress", title: "In Progress", color: "#3b82f6" },
    { id: "col-blocked", title: "Blocked", color: "#f43f5e" },
    { id: "col-done", title: "Completed", color: "#10b981" }
  ],
  tasks: tasks
};

fs.writeFileSync('parsed_project.json', JSON.stringify(output, null, 2));
console.log('Saved to parsed_project.json');
