import React, { useState } from "react";
import { Project, TeamMember, Team } from "../types";
import { Users, UserPlus, AlertCircle, BarChart3, Database, Filter } from "lucide-react";

interface TeamViewProps {
  project: Project;
  onUpdateProject: (proj: Project) => void;
}

export default function TeamView({ project, onUpdateProject }: TeamViewProps) {
  const members = project.members || [];
  
  // Extract all unique assignees present in tasks
  const presentAssignees = Array.from(new Set(project.tasks.map((t) => t.assignee || "Unassigned")));
  const allAssignees = Array.from(new Set(["Unassigned", ...members.map(m => m.name), ...presentAssignees]));

  // Workload calculations (Pivot Table Data)
  const pivotData = allAssignees.map((assignee) => {
    const assigneeTasks = project.tasks.filter((t) => (t.assignee || "Unassigned") === assignee);
    
    // Status metrics
    const completed = assigneeTasks.filter((t) => t.status === "col-done" || t.status.toLowerCase().includes("done")).length;
    const inProgress = assigneeTasks.filter((t) => t.status === "col-progress" || t.status.toLowerCase().includes("progress")).length;
    const blocked = assigneeTasks.filter((t) => t.status === "col-blocked" || t.status.toLowerCase().includes("blocked")).length;
    const notStarted = assigneeTasks.filter((t) => t.status === "col-todo" || t.status.toLowerCase().includes("todo")).length;
    
    // Priority metrics
    const urgent = assigneeTasks.filter(t => t.priority === "urgent").length;
    const high = assigneeTasks.filter(t => t.priority === "high").length;
    const medium = assigneeTasks.filter(t => t.priority === "medium").length;
    const low = assigneeTasks.filter(t => t.priority === "low").length;

    // Capacity metrics
    const totalHours = assigneeTasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
    const actualHours = assigneeTasks.reduce((acc, t) => acc + (t.actualHours || 0), 0);
    
    return {
      assignee,
      taskCount: assigneeTasks.length,
      completed,
      inProgress,
      blocked,
      notStarted,
      urgent,
      high,
      medium,
      low,
      totalHours,
      actualHours
    };
  }).filter(member => member.taskCount > 0 || member.assignee === "Unassigned" || members.some(m => m.name === member.assignee));

  // Sort workload so Unassigned, Abdallah, Sallam are at top
  pivotData.sort((a, b) => {
    const order = ["Unassigned", "Abdallah", "Sallam"];
    const idxA = order.indexOf(a.assignee);
    const idxB = order.indexOf(b.assignee);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return b.taskCount - a.taskCount;
  });

  const grandTotalTasks = project.tasks.length;
  const unassignedData = pivotData.find(d => d.assignee === "Unassigned");
  const unassignedCount = unassignedData ? unassignedData.taskCount : 0;
  
  // Critical Mass logic for Unassigned tasks (e.g., > 15% of total tasks or > 10 tasks)
  const isBacklogCritical = grandTotalTasks > 0 && (unassignedCount > 10 || (unassignedCount / grandTotalTasks) > 0.15);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0F1115] flex-1 overflow-y-auto p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Database className="w-5 h-5 text-indigo-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Automated Workload Pivot</h2>
          <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-semibold uppercase tracking-wide">
            Capacity & Delegation Engine
          </span>
        </div>
      </div>

      {/* Delegation Alerts */}
      {isBacklogCritical && (
        <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 flex items-start space-x-3 shadow-sm animate-pulse">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Critical Mass Alert: Unassigned Backlog</h4>
            <p className="text-[11px] text-rose-600 dark:text-rose-300 mt-1 font-medium">
              There are currently <strong>{unassignedCount} unassigned tasks</strong> in the master ledger ({(unassignedCount / grandTotalTasks * 100).toFixed(1)}% of total workload). Immediate delegation to available team members is recommended to prevent pipeline bottlenecks.
            </p>
          </div>
        </div>
      )}

      {/* Main Pivot Table */}
      <div className="bg-white dark:bg-[#17191E] border border-slate-200 dark:border-[#1E222B] rounded-xl overflow-hidden shadow-md flex flex-col">
        <div className="p-4 bg-slate-50 dark:bg-[#1C1F26] border-b border-slate-200 dark:border-[#1E222B] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
              Master Ledger Capacity Scan
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white dark:bg-[#14171C] border border-slate-200 dark:border-slate-800 rounded-md text-[10px] font-bold text-slate-600 dark:text-slate-300">
              <Filter className="w-3 h-3" />
              <span>Filter Matrix</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1E222B] bg-slate-50/50 dark:bg-[#1C1F26]/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-800 sticky left-0 bg-slate-50/95 dark:bg-[#1C1F26]/95 backdrop-blur z-10 w-48">Resource / Assignee</th>
                <th className="py-3 px-4 text-center border-r border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/5">Total Tasks</th>
                
                {/* Status Breakdowns */}
                <th className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800" colSpan={4}>Status Distribution</th>
                
                {/* Priority Breakdowns */}
                <th className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800" colSpan={4}>Priority Distribution</th>
                
                {/* Hours Breakdowns */}
                <th className="py-3 px-3 text-center" colSpan={2}>Capacity (Hours)</th>
              </tr>
              <tr className="border-b border-slate-200 dark:border-[#1E222B] bg-white dark:bg-[#17191E] text-slate-400 dark:text-slate-500 font-semibold text-[9px] uppercase">
                <th className="py-2 px-4 border-r border-slate-200 dark:border-slate-800 sticky left-0 bg-white dark:bg-[#17191E] z-10"></th>
                <th className="py-2 px-4 text-center border-r border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-900/5"></th>
                
                <th className="py-2 px-2 text-center border-r border-slate-200 dark:border-slate-800 w-16">Todo</th>
                <th className="py-2 px-2 text-center border-r border-slate-200 dark:border-slate-800 w-16">Active</th>
                <th className="py-2 px-2 text-center border-r border-slate-200 dark:border-slate-800 w-16">Blocked</th>
                <th className="py-2 px-2 text-center border-r border-slate-200 dark:border-slate-800 w-16">Done</th>
                
                <th className="py-2 px-2 text-center border-r border-slate-200 dark:border-slate-800 w-16 text-rose-500">Urgent</th>
                <th className="py-2 px-2 text-center border-r border-slate-200 dark:border-slate-800 w-16 text-orange-500">High</th>
                <th className="py-2 px-2 text-center border-r border-slate-200 dark:border-slate-800 w-16 text-blue-500">Med</th>
                <th className="py-2 px-2 text-center border-r border-slate-200 dark:border-slate-800 w-16">Low</th>
                
                <th className="py-2 px-2 text-center border-r border-slate-200 dark:border-slate-800 w-20 text-indigo-500">Est.</th>
                <th className="py-2 px-2 text-center w-20">Actual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
              {pivotData.map((row) => {
                const isUnassigned = row.assignee === "Unassigned";
                const percentage = grandTotalTasks ? Math.round((row.taskCount / grandTotalTasks) * 100) : 0;
                
                return (
                  <tr key={row.assignee} className="hover:bg-slate-50 dark:hover:bg-[#1C1F26]/30 transition-colors">
                    <td className={`py-2.5 px-4 font-sans font-bold border-r border-slate-200 dark:border-slate-800 sticky left-0 z-10 ${isUnassigned ? 'bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400' : 'bg-white dark:bg-[#17191E] text-slate-800 dark:text-slate-200'}`}>
                      <div className="flex flex-col">
                        <span>{row.assignee}</span>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 mt-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isUnassigned ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    </td>
                    
                    <td className={`py-2.5 px-4 text-center font-bold text-sm border-r border-slate-200 dark:border-slate-800 ${isUnassigned ? 'bg-rose-50 dark:bg-rose-900/5 text-rose-600' : 'bg-indigo-50/50 dark:bg-indigo-900/5 text-indigo-600'}`}>
                      {row.taskCount}
                    </td>
                    
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-slate-500">{row.notStarted || "-"}</td>
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-blue-500 font-bold">{row.inProgress || "-"}</td>
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-rose-500 font-bold bg-rose-50/30 dark:bg-rose-900/5">{row.blocked || "-"}</td>
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-emerald-500 font-bold">{row.completed || "-"}</td>
                    
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-rose-500 font-bold bg-rose-50/30 dark:bg-rose-900/5">{row.urgent || "-"}</td>
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-orange-500 font-bold">{row.high || "-"}</td>
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-blue-500">{row.medium || "-"}</td>
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-slate-500">{row.low || "-"}</td>
                    
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-indigo-500 font-bold bg-indigo-50/30 dark:bg-indigo-900/5">{row.totalHours || "-"}</td>
                    <td className="py-2.5 px-2 text-center text-slate-600 dark:text-slate-300">{row.actualHours || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
            {/* Grand Totals Footer */}
            <tfoot className="bg-slate-50 dark:bg-[#1C1F26] border-t border-slate-200 dark:border-[#1E222B] font-mono text-[11px] font-bold">
              <tr>
                <td className="py-3 px-4 border-r border-slate-200 dark:border-slate-800 sticky left-0 bg-slate-50 dark:bg-[#1C1F26] z-10 text-slate-800 dark:text-slate-200 uppercase text-[10px]">Grand Totals</td>
                <td className="py-3 px-4 text-center border-r border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20 text-sm">
                  {grandTotalTasks}
                </td>
                
                <td className="py-3 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">{pivotData.reduce((acc, r) => acc + r.notStarted, 0)}</td>
                <td className="py-3 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-blue-500">{pivotData.reduce((acc, r) => acc + r.inProgress, 0)}</td>
                <td className="py-3 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-rose-500">{pivotData.reduce((acc, r) => acc + r.blocked, 0)}</td>
                <td className="py-3 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-emerald-500">{pivotData.reduce((acc, r) => acc + r.completed, 0)}</td>
                
                <td className="py-3 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-rose-500">{pivotData.reduce((acc, r) => acc + r.urgent, 0)}</td>
                <td className="py-3 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-orange-500">{pivotData.reduce((acc, r) => acc + r.high, 0)}</td>
                <td className="py-3 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-blue-500">{pivotData.reduce((acc, r) => acc + r.medium, 0)}</td>
                <td className="py-3 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">{pivotData.reduce((acc, r) => acc + r.low, 0)}</td>
                
                <td className="py-3 px-2 text-center border-r border-slate-200 dark:border-slate-800 text-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10">{pivotData.reduce((acc, r) => acc + r.totalHours, 0)}</td>
                <td className="py-3 px-2 text-center text-slate-700 dark:text-slate-300">{pivotData.reduce((acc, r) => acc + r.actualHours, 0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
