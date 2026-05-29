/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { CDACCDashboardData, Deadline, UnitOfLearning } from "../types.ts";
import { CalendarClock, Plus, CheckCircle, BellRing, BellOff, Trash2, CalendarDays, AlertTriangle, Play, Check } from "lucide-react";

interface ScheduleRemindersProps {
  data: CDACCDashboardData;
  isNotificationsEnabled: boolean;
  onRequestNotificationPermission: () => void;
  onAddDeadline: (deadline: Deadline) => void;
  onToggleCompleteDeadline: (deadlineId: string) => void;
  onDeleteDeadline: (deadlineId: string) => void;
  onTriggerInstantPush: (title: string, body: string) => void;
}

export default function ScheduleReminders({
  data,
  isNotificationsEnabled,
  onRequestNotificationPermission,
  onAddDeadline,
  onToggleCompleteDeadline,
  onDeleteDeadline,
  onTriggerInstantPush,
}: ScheduleRemindersProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "pending" | "completed">("pending");

  // Form states
  const [formUnitId, setFormUnitId] = useState<string>(data.units[0]?.id || "");
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formType, setFormType] = useState<Deadline["type"]>("Internal CAT");
  const [formDesc, setFormDesc] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate) return;

    const unit = data.units.find(u => u.id === formUnitId);
    
    const newDeadline: Deadline = {
      id: "dl-add-" + Math.random().toString(36).substring(2, 9),
      unitId: formUnitId,
      unitName: unit ? unit.name : "",
      title: formTitle,
      dueDate: formDate,
      type: formType,
      description: formDesc,
      completed: false,
    };

    onAddDeadline(newDeadline);

    // Set custom alarm trigger for 10 seconds for instant notification demonstration!
    onTriggerInstantPush(
      "Reminder Set: " + formTitle,
      `Your upcoming CDACC task for ${unit ? unit.name : "your unit"} is successfully registered.`
    );

    // Reset fields
    setFormTitle("");
    setFormDate("");
    setFormDesc("");
    setShowAddForm(false);
  };

  const handleManualTrigger = (deadline: Deadline) => {
    onTriggerInstantPush(
      `🔔 CDACC Deadline Alert: ${deadline.title}`,
      `Task is due on ${deadline.dueDate} for [${deadline.unitName}]. Do not let your PoE lag!`
    );
  };

  const filteredDeadlines = data.deadlines.filter(d => {
    if (filterMode === "pending") return !d.completed;
    if (filterMode === "completed") return d.completed;
    return true;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm font-sans mb-6">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100 pb-5 mb-5">
        <div>
          <h2 id="reminders-schedule-title" className="text-xl font-bold font-display text-slate-800 tracking-tight flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-emerald-500" /> TVET Deadlines & Alarms Scheduler
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Register exam dates, remedial tests, and Portfolio of Evidence submission cutoffs. Set push notifications to stay compliant.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white hover:text-emerald-300 font-medium text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Academic Milestone
        </button>
      </div>

      {/* WEB NOTIFICATIONS COMMISSION BOX */}
      <div className={`p-4 rounded-2xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border ${isNotificationsEnabled ? "bg-emerald-50/50 border-emerald-100/70" : "bg-blue-50/50 border-blue-100/70"}`}>
        <div className="flex items-start gap-3">
          {isNotificationsEnabled ? (
            <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-inner shadow-black/15 shrink-0">
              <BellRing className="h-5 w-5 animate-pulse" />
            </div>
          ) : (
            <div className="p-2 bg-blue-500 text-white rounded-xl shadow-inner shadow-black/15 shrink-0">
              <BellOff className="h-5 w-5" />
            </div>
          )}
          <div>
            <h4 className={`text-xs font-bold font-display ${isNotificationsEnabled ? "text-emerald-900" : "text-blue-900"}`}>
              {isNotificationsEnabled ? "OS Desktop Push Alerts Enabled" : "Enable Real OS Desktop Push Reminders"}
            </h4>
            <p className={`text-[10.5px] leading-relaxed mt-0.5 ${isNotificationsEnabled ? "text-emerald-800" : "text-blue-800"}`}>
              {isNotificationsEnabled 
                ? "You are fully registered to receive instant, live desktop updates. We use browser alert nodes with oscillator synthesizer sound sweeps."
                : "Grant this applet browser authority to issue notifications outside of your window. Ensures you never miss a Portfolio (PoE) submission deadline!"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRequestNotificationPermission}
          className={`shrink-0 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm ${
            isNotificationsEnabled 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isNotificationsEnabled ? "Permission Verified ✓" : "Grant Authority"}
        </button>
      </div>

      {/* NEW DEADLINE SCHEDULER FORM */}
      {showAddForm && (
        <form onSubmit={handleFormSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 animate-fade-in font-sans">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
            <CalendarDays className="h-4.5 w-4.5 text-emerald-600" /> Schedule New Academic Task
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Target Unit of Learning</label>
              <select
                value={formUnitId}
                onChange={(e) => setFormUnitId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
              >
                {data.units.map(u => (
                  <option key={u.id} value={u.id}>{u.code} - {u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Milestone Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="Internal CAT">Continuous Assessment Test (CAT)</option>
                <option value="PoE Submission">Portfolio of Evidence (PoE) Submission</option>
                <option value="Practical Prep">Lab Work Practical Assessment Session</option>
                <option value="Institutional Exam">Institutional End-Semester Written Exam</option>
                <option value="CDACC National Exam">CDACC National Final Board Exam</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Task Summary / Title</label>
              <input
                type="text"
                placeholder="e.g. Assemble Router PoE binder for review"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Milestone Cutoff Date</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-600 text-xs font-semibold mb-1">Description / Trainee Preparations Instructions</label>
              <textarea
                placeholder="List required items, study focus notes, or self-verification checklists..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium text-xs px-4 py-2 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-xs px-4 py-2 rounded-xl transition shadow-sm"
            >
              Log Deadline
            </button>
          </div>
        </form>
      )}

      {/* FILTER BUTTONS ROW */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit mb-5">
        <button
          onClick={() => setFilterMode("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${filterMode === "all" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
        >
          All Deadlines
        </button>
        <button
          onClick={() => setFilterMode("pending")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${filterMode === "pending" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
        >
          Pending Tasks
        </button>
        <button
          onClick={() => setFilterMode("completed")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer ${filterMode === "completed" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
        >
          Completed
        </button>
      </div>

      {/* LIST OF DEADLINES */}
      <div className="space-y-3">
        {filteredDeadlines.map((deadline) => {
          const isUrgent = !deadline.completed && (new Date(deadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 7;
          
          return (
            <div
              key={deadline.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                deadline.completed
                  ? "bg-slate-50/50 border-slate-100 text-slate-400"
                  : isUrgent
                  ? "bg-rose-50/20 border-rose-200"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onToggleCompleteDeadline(deadline.id)}
                  className={`mt-0.5 rounded-full h-5 w-5 flex items-center justify-center transition border shrink-0 ${
                    deadline.completed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isUrgent
                      ? "border-rose-400 hover:border-rose-500 hover:bg-rose-50 text-transparent"
                      : "border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-transparent"
                  }`}
                >
                  {deadline.completed ? <Check className="h-3.5 w-3.5 stroke-[4px]" /> : <Check className="h-3.5 w-3.5" />}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      deadline.type === "CDACC National Exam"
                        ? "bg-slate-900 text-white border border-slate-800"
                        : deadline.type === "PoE Submission"
                        ? "bg-indigo-100 text-indigo-800"
                        : deadline.type === "Practical Prep"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {deadline.type}
                    </span>
                    
                    <span className="text-[10px] text-slate-400 font-mono">
                      Ref: {deadline.unitId}
                    </span>

                    {isUrgent && (
                      <span className="text-rose-500 bg-rose-100 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                        <AlertTriangle className="h-3 w-3" /> Imminent
                      </span>
                    )}
                  </div>

                  <h4 className={`text-sm font-bold leading-tight ${deadline.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
                    {deadline.title}
                  </h4>

                  <p className={`text-[11px] leading-relaxed max-w-xl ${deadline.completed ? "text-slate-400" : "text-slate-500"}`}>
                    {deadline.description}
                  </p>
                </div>
              </div>

              {/* TIMELINE ACTION BLOCK */}
              <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0 gap-2">
                <div className="text-left sm:text-right">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono font-semibold">Due Cutoff</div>
                  <div className="text-xs font-bold font-mono text-slate-700">
                    {new Date(deadline.dueDate).toLocaleDateString("en-KE", { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!deadline.completed && (
                    <button
                      onClick={() => handleManualTrigger(deadline)}
                      className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                      title="Trigger testing push notice immediately"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteDeadline(deadline.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="Remove record"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredDeadlines.length === 0 && (
          <div className="py-12 border border-dashed border-slate-150 rounded-2xl text-center text-slate-400 text-xs">
            No schedule deadlines match the current filter selection ({filterMode}).
          </div>
        )}
      </div>

    </div>
  );
}
