import React, { useState, useEffect } from "react";
import { Project, Task } from "../types";
import { Clock, Check, Plus, Trash2, Edit2, Coffee, Calendar, User, Tag, HelpCircle, ChevronRight } from "lucide-react";

interface ActivityViewProps {
  project: Project;
}

interface DailyLog {
  id: string;
  date: string;
  taskId: string;
  taskTitle: string;
  description: string;
  status: "Completed" | "In Progress" | "Not Started" | "Blocked";
  time: string;
  assignee: string;
  hours: number;
}

const INITIAL_LOGS: DailyLog[] = [
  {
    id: "log-1",
    date: "2026-06-19",
    taskId: "TASK-003",
    taskTitle: "Innovation Hub Visualizer Kit",
    description: "Logged from Daily Logs board",
    status: "Completed",
    time: "09:00 AM",
    assignee: "Abdallah",
    hours: 5
  },
  {
    id: "log-2",
    date: "2026-06-19",
    taskId: "TASK-011",
    taskTitle: "Masters",
    description: "Recalibrated core sensor systems",
    status: "Completed",
    time: "09:00 AM",
    assignee: "Sallam",
    hours: 0
  },
  {
    id: "log-3",
    date: "2026-06-19",
    taskId: "TASK-029",
    taskTitle: "Claude Code Vercel Visualizer Web-Kit",
    description: "Scaffolded target client assets",
    status: "Not Started",
    time: "09:00 AM",
    assignee: "Abdallah",
    hours: 0
  }
];

export default function ActivityView({ project }: ActivityViewProps) {
  // Persistence for daily logs
  const [logs, setLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem("clickup_daily_logs");
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  useEffect(() => {
    localStorage.setItem("clickup_daily_logs", JSON.stringify(logs));
  }, [logs]);

  // Form states
  const [targetDate, setTargetDate] = useState("2026-06-19");
  const [linkedTaskId, setLinkedTaskId] = useState("");
  const [completedText, setCompletedText] = useState("");
  const [logStatus, setLogStatus] = useState<DailyLog["status"]>("Completed");
  const [whoCompleted, setWhoCompleted] = useState("Abdallah");
  const [loggedHours, setLoggedHours] = useState(4);
  const [loggedTime, setLoggedTime] = useState("10:00 AM");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Edit mode state
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  // Sync default assignee to active user or project list if needed
  const teamList = ["Abdallah", "Sallam", "Alice", "Bob", "Charlie", "Diana"];

  // Filter logs based on selected target date
  const filteredLogs = logs.filter((log) => log.date === targetDate);

  // Compute total logged hours for this date range
  const totalLoggedHours = filteredLogs.reduce((sum, log) => sum + (Number(log.hours) || 0), 0);

  // Handle Log Creation/Update
  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completedText.trim()) {
      return;
    }

    // Determine task ID and label
    let finalTaskId = "TASK-" + Math.floor(100 + Math.random() * 900);
    let finalTaskTitle = completedText;

    if (linkedTaskId) {
      const selectedTask = project.tasks.find((t) => t.id === linkedTaskId);
      if (selectedTask) {
        finalTaskId = selectedTask.id;
        finalTaskTitle = selectedTask.title;
      }
    }

    if (editingLogId) {
      // Update existing
      setLogs(
        logs.map((log) => {
          if (log.id === editingLogId) {
            return {
              ...log,
              date: targetDate,
              taskId: finalTaskId,
              taskTitle: finalTaskTitle,
              description: additionalNotes || "Logged from Daily Logs board",
              status: logStatus,
              time: loggedTime,
              assignee: whoCompleted,
              hours: Number(loggedHours) || 0,
            };
          }
          return log;
        })
      );
      setEditingLogId(null);
    } else {
      // Add new log
      const newLog: DailyLog = {
        id: `log-${Date.now()}`,
        date: targetDate,
        taskId: finalTaskId,
        taskTitle: finalTaskTitle,
        description: additionalNotes || "Logged from Daily Logs board",
        status: logStatus,
        time: loggedTime,
        assignee: whoCompleted,
        hours: Number(loggedHours) || 0,
      };
      setLogs([newLog, ...logs]);
    }

    // Reset some form inputs
    setCompletedText("");
    setLinkedTaskId("");
    setAdditionalNotes("");
    setLoggedHours(4);
  };

  // Quick edit loader
  const handleEditInit = (log: DailyLog) => {
    setEditingLogId(log.id);
    setTargetDate(log.date);
    setCompletedText(log.taskTitle);
    setLogStatus(log.status);
    setWhoCompleted(log.assignee);
    setLoggedHours(log.hours);
    setLoggedTime(log.time);
    setAdditionalNotes(log.description);
  };

  // Delete log handler
  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter((log) => log.id !== id));
    if (editingLogId === id) {
      setEditingLogId(null);
    }
  };

  // Adjust hours widget (- / + buttons)
  const adjustHours = (id: string, amount: number) => {
    setLogs(
      logs.map((log) => {
        if (log.id === id) {
          const newHours = Math.max(0, (log.hours || 0) + amount);
          return { ...log, hours: newHours };
        }
        return log;
      })
    );
  };

  // Helper for member initials
  const getInitials = (name: string) => {
    if (!name) return "UN";
    return name.slice(0, 2).toUpperCase();
  };

  // Colors based on assignee
  const getAvatarColor = (name: string) => {
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      "bg-indigo-600 text-slate-900 dark:text-white",
      "bg-emerald-600 text-slate-900 dark:text-white",
      "bg-amber-500 text-slate-900",
      "bg-rose-600 text-slate-900 dark:text-white",
      "bg-sky-600 text-slate-900 dark:text-white",
      "bg-purple-600 text-slate-900 dark:text-white"
    ];
    return colors[hash % colors.length];
  };

  // Render status badge classes
  const getStatusBadge = (status: DailyLog["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20";
      case "In Progress":
        return "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20";
      case "Blocked":
        return "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20";
      default:
        return "bg-slate-100 dark:bg-slate-700/30 text-slate-500 dark:text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50";
    }
  };

  return (
    <div id="daily-logs-view-root" className="flex flex-col lg:flex-row h-full w-full overflow-y-auto bg-slate-50 dark:bg-[#0F1115] p-6 gap-6 select-none text-slate-850 dark:text-slate-200">
      
      {/* Left Column: Task Logger Form */}
      <div id="task-logger-form-container" className="flex-1 lg:max-w-md bg-white dark:bg-[#14171C] border border-slate-250/80 dark:border-[#1E222B] rounded-xl p-6 flex flex-col h-fit shadow-xs">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white tracking-wide">Task Logger</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Record daily team updates for Abdallah and Sallam with precise scheduling time.
            </p>
          </div>
        </div>

        <form onSubmit={handleLogSubmit} className="space-y-4 text-xs">
          
          {/* Target Schedule Date */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Target Schedule Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B0D11] border border-slate-200 dark:border-[#1E222B] text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Linked Project Task (Optional helper) */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Link to Project Task (Optional)
            </label>
            <select
              value={linkedTaskId}
              onChange={(e) => {
                setLinkedTaskId(e.target.value);
                const matched = project.tasks.find((t) => t.id === e.target.value);
                if (matched) {
                  setCompletedText(matched.title);
                }
              }}
              className="w-full bg-slate-50 dark:bg-[#0B0D11] border border-slate-200 dark:border-[#1E222B] text-slate-800 dark:text-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="" className="bg-white dark:bg-[#14171C] text-slate-800 dark:text-slate-350">-- Or type custom task description below --</option>
              {project.tasks.map((task) => (
                <option key={task.id} value={task.id} className="bg-white dark:bg-[#14171C] text-slate-800 dark:text-slate-300">
                  [{task.id}] {task.title} ({task.assignee})
                </option>
              ))}
            </select>
          </div>

          {/* What did you complete? */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              What did you complete? *
            </label>
            <input
              type="text"
              required
              value={completedText}
              onChange={(e) => setCompletedText(e.target.value)}
              placeholder="e.g. Verify database credentials"
              className="w-full bg-slate-50 dark:bg-[#0B0D11] border border-slate-200 dark:border-[#1E222B] text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-xs placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Status & Who Completed It */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </label>
              <select
                value={logStatus}
                onChange={(e) => setLogStatus(e.target.value as DailyLog["status"])}
                className="w-full bg-slate-50 dark:bg-[#0B0D11] border border-slate-200 dark:border-[#1E222B] text-slate-800 dark:text-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Completed" className="bg-white dark:bg-[#14171C] text-slate-800 dark:text-slate-300">Completed</option>
                <option value="In Progress" className="bg-white dark:bg-[#14171C] text-slate-800 dark:text-slate-300">In Progress</option>
                <option value="Not Started" className="bg-white dark:bg-[#14171C] text-slate-800 dark:text-slate-300">Not Started</option>
                <option value="Blocked" className="bg-white dark:bg-[#14171C] text-slate-800 dark:text-slate-300">Blocked</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Who Completed It?
              </label>
              <select
                value={whoCompleted}
                onChange={(e) => setWhoCompleted(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B0D11] border border-slate-200 dark:border-[#1E222B] text-slate-800 dark:text-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {teamList.map((member) => (
                  <option key={member} value={member} className="bg-white dark:bg-[#14171C] text-slate-800 dark:text-slate-300">
                    {member}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Logged Hours & Logged Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Logged Hours
              </label>
              <input
                type="number"
                min="0"
                max="24"
                value={loggedHours}
                onChange={(e) => setLoggedHours(Number(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-[#0B0D11] border border-slate-200 dark:border-[#1E222B] text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Logged Time
              </label>
              <input
                type="text"
                value={loggedTime}
                onChange={(e) => setLoggedTime(e.target.value)}
                placeholder="e.g. 10:00 AM"
                className="w-full bg-slate-50 dark:bg-[#0B0D11] border border-slate-200 dark:border-[#1E222B] text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-bold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Additional Notes
            </label>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Optional technical specifications or blockers..."
              className="w-full bg-slate-50 dark:bg-[#0B0D11] border border-slate-200 dark:border-[#1E222B] text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-xs placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer text-center"
            >
              {editingLogId ? "Update Log Record" : "+ Log Task Action"}
            </button>
            {editingLogId && (
              <button
                type="button"
                onClick={() => {
                  setEditingLogId(null);
                  setCompletedText("");
                  setLinkedTaskId("");
                  setAdditionalNotes("");
                }}
                className="bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-600 dark:text-slate-300 font-bold py-2 px-3 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

        </form>
      </div>

      {/* Right Column: Sprint Logs list for the current schedule date */}
      <div id="sprint-logs-list-container" className="flex-1 bg-white dark:bg-[#14171C] border border-slate-200 dark:border-[#1E222B] rounded-xl p-6 flex flex-col h-full min-h-[500px] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1E222B] mb-6">
          <div>
            <span className="font-bold text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
              Sprint Logs for {targetDate}
            </span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-1">
              {filteredLogs.length} {filteredLogs.length === 1 ? "report" : "reports"} assigned to this target date range.
            </h4>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase block tracking-wider">
              Total Logged Time
            </span>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              {totalLoggedHours} hrs
            </span>
          </div>
        </div>

        {/* List of filtered logs */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Calendar className="w-12 h-12 text-slate-350 dark:text-slate-700 stroke-[1.5] mb-3" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No activity records logged for {targetDate}.</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Use the Task Logger panel to add a task report on this date.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-50 dark:bg-[#0F1115] border border-slate-200 dark:border-[#1E222B] hover:border-indigo-500/20 dark:hover:border-indigo-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
              >
                {/* Left block: checkbox, task ID, details */}
                <div className="flex items-start space-x-3.5 flex-1">
                  <div className="pt-0.5">
                    {log.status === "Completed" ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 dark:text-white">
                        <Check className="w-2.5 h-2.5 stroke-[4]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center" />
                    )}
                  </div>
                  
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500">
                        {log.taskId}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusBadge(log.status)}`}>
                        {log.status}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-600 dark:text-slate-400 font-medium bg-slate-100/80 dark:bg-[#1e222b]/50 px-2 py-0.5 rounded border border-slate-200 dark:border-[#1E222B] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        {log.date}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-600 dark:text-slate-400 font-medium bg-slate-100/80 dark:bg-[#1e222b]/50 px-2 py-0.5 rounded border border-slate-200 dark:border-[#1E222B] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        {log.time}
                      </span>
                    </div>

                    <h5 className={`text-xs font-bold tracking-wide leading-snug ${
                      log.status === "Completed"
                        ? "line-through text-slate-500 dark:text-slate-400 dark:text-slate-500 font-normal"
                        : "text-slate-800 dark:text-slate-100"
                    }`}>
                      {log.taskTitle}
                    </h5>

                    {log.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2">
                        {log.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right block: Assignee chip, Hours adjustments, Action triggers */}
                <div className="flex items-center space-x-4 shrink-0 justify-end sm:justify-start">
                  
                  {/* Assignee initial chip */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${getAvatarColor(log.assignee)}`} title={log.assignee}>
                      {getInitials(log.assignee)}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-600 dark:text-slate-300 hidden sm:inline">
                      {log.assignee}
                    </span>
                  </div>

                  {/* Hours modifier counter */}
                  <div className="flex items-center bg-slate-100 dark:bg-[#14171C] border border-slate-200 dark:border-[#1E222B] rounded-lg overflow-hidden text-xs">
                    <button
                      onClick={() => adjustHours(log.id, -1)}
                      className="px-2.5 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60 font-black transition-colors"
                    >
                      -
                    </button>
                    <span className="px-2.5 py-1 text-slate-700 dark:text-slate-200 font-mono font-bold border-x border-slate-200 dark:border-[#1E222B] min-w-[32px] text-center">
                      {log.hours}h
                    </span>
                    <button
                      onClick={() => adjustHours(log.id, 1)}
                      className="px-2.5 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60 font-black transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Action triggers (Edit & Delete) */}
                  <div className="flex items-center space-x-1.5 border-l border-slate-200 dark:border-[#1E222B] pl-3.5">
                    <button
                      onClick={() => handleEditInit(log)}
                      title="Edit Log"
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      title="Delete Log"
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
