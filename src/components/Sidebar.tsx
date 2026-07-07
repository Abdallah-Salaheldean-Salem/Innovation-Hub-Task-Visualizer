import React, { useState } from "react";
import { Project, AppView } from "../types";
import {
  Kanban,
  ListTodo,
  Calendar,
  CalendarDays,
  Plus,
  Trash2,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Users,
  Lightbulb,
  Clock,
  Settings,
} from "lucide-react";

interface SidebarProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, desc: string) => void;
  onDeleteProject: (id: string) => void;
  activeView: AppView;
  onSelectView: (view: AppView) => void;
}

export default function Sidebar({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  activeView,
  onSelectView,
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const viewItems: { id: AppView; label: string; icon: any; badge?: string }[] = [
    { id: "list", label: "1. List View", icon: ListTodo },
    { id: "board", label: "2. Board View", icon: Kanban },
    { id: "calendar", label: "3. Calendar Grid", icon: CalendarDays },
    { id: "team", label: "4. Team View", icon: Users },
    { id: "gantt", label: "5. Gantt Chart", icon: Calendar },
    { id: "ideas", label: "6. Ideas & Priorities", icon: Lightbulb },
    { id: "activity", label: "7. Activity Log", icon: Clock },
    { id: "settings", label: "8. Settings View", icon: Settings },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    onCreateProject(newProjName, newProjDesc);
    setNewProjName("");
    setNewProjDesc("");
    setIsCreating(false);
  };

  return (
    <aside
      id="app-sidebar"
      className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#17191E] text-slate-700 dark:text-slate-300 flex flex-col h-full select-none"
    >
      {/* Workspace Header */}
      <div id="sidebar-header" className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-slate-900 dark:text-white shadow-md">
          IH
        </div>
        <div>
          <h1 className="font-semibold text-slate-900 dark:text-white tracking-wide text-sm line-clamp-1" title="Innovation Hub Visualizer Kit">Innovation Hub Visualizer Kit</h1>
        </div>
      </div>

      {/* Primary Views Section */}
      <div id="sidebar-views" className="p-3 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 mb-2 block">
          Views
        </span>
        <nav className="space-y-1">
          {viewItems.map((view) => {
            const Icon = view.icon;
            const isActive = activeView === view.id;
            return (
              <button
                key={view.id}
                id={`sidebar-view-btn-${view.id}`}
                onClick={() => onSelectView(view.id as AppView)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-800/60 hover:text-slate-800 dark:text-slate-200 border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{view.label}</span>
                </div>
                {view.badge && (
                  <span className="bg-indigo-500/20 text-indigo-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-indigo-500/30">
                    {view.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Projects Section */}
      <div id="sidebar-projects-container" className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center justify-between px-3 mb-2">
          <button
            id="projects-toggle-expand"
            onClick={() => setProjectsExpanded(!projectsExpanded)}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:text-slate-300"
          >
            {projectsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            <span>Spaces</span>
          </button>
          <button
            id="add-project-btn-trigger"
            onClick={() => setIsCreating(!isCreating)}
            className="p-1 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-800 hover:text-slate-700 dark:text-slate-300 transition-colors"
            title="Create Space"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {isCreating && (
          <form
            id="create-project-form"
            onSubmit={handleCreate}
            className="bg-slate-50 dark:bg-[#1C1F26] p-3 rounded-lg mb-3 border border-slate-200 dark:border-slate-800"
          >
            <input
              id="new-project-name-input"
              type="text"
              placeholder="Space Name (e.g., SEO Plan)"
              value={newProjName}
              onChange={(e) => setNewProjName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F1115] border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-2"
              required
            />
            <input
              id="new-project-desc-input"
              type="text"
              placeholder="Brief description"
              value={newProjDesc}
              onChange={(e) => setNewProjDesc(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F1115] border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-2"
            />
            <div className="flex justify-end space-x-1.5">
              <button
                id="cancel-create-project"
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-2.5 py-1 bg-slate-50 dark:bg-[#0F1115] hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="submit-create-project"
                type="submit"
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-semibold cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {projectsExpanded && (
          <div id="projects-list" className="space-y-1">
            {projects.map((proj) => {
              const isSelected = proj.id === activeProjectId;
              return (
                <div
                  key={proj.id}
                  id={`project-item-${proj.id}`}
                  className={`group flex items-center justify-between rounded-lg transition-colors p-1 border ${
                    isSelected ? "bg-slate-50 dark:bg-[#1C1F26] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white" : "border-transparent hover:bg-slate-50 dark:hover:bg-[#1C1F26]/40"
                  }`}
                >
                  <button
                    id={`select-project-${proj.id}`}
                    onClick={() => onSelectProject(proj.id)}
                    className="flex-1 text-left flex items-center space-x-2.5 px-2 py-1.5 text-xs font-medium rounded-md truncate text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                    <span className="truncate">{proj.name}</span>
                  </button>
                  {projects.length > 1 && (
                    <button
                      id={`delete-project-${proj.id}`}
                      onClick={() => onDeleteProject(proj.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 rounded transition-opacity cursor-pointer"
                      title="Delete Space"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Workspace details */}
      {activeProject && (
        <div id="sidebar-footer-details" className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1115]/50 text-xs">
          <div className="text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">Active Space</div>
          <div className="font-medium text-slate-800 dark:text-slate-200 truncate" id="active-space-footer-name">
            {activeProject.name}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {activeProject.description || "No description provided."}
          </p>
        </div>
      )}
    </aside>
  );
}
