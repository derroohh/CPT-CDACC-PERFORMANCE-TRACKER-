/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CDACCDashboardData, UnitOfLearning, AttendanceSession } from "../types.ts";
import { 
  UserCheck, 
  Clock, 
  Calendar, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Filter,
  FileSpreadsheet,
  TrendingUp,
  Info
} from "lucide-react";

interface AttendanceTrackerProps {
  data: CDACCDashboardData;
  onUpdateUnits: (updatedUnits: UnitOfLearning[]) => void;
  onUpdateAttendanceLogs: (updatedLogs: AttendanceSession[]) => void;
  onTriggerInstantPush: (title: string, body: string) => void;
}

export default function AttendanceTracker({
  data,
  onUpdateUnits,
  onUpdateAttendanceLogs,
  onTriggerInstantPush,
}: AttendanceTrackerProps) {
  // Safe default initialization of optional lists
  const logs = data.attendanceLogs || [];
  const units = data.units || [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [filterUnit, setFilterUnit] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Form states
  const [formUnitId, setFormUnitId] = useState<string>(units[0]?.id || "");
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [formDuration, setFormDuration] = useState<number>(3); // 3 credit hours standard lecture
  const [formStatus, setFormStatus] = useState<AttendanceSession["status"]>("Present");
  const [formRemarks, setFormRemarks] = useState<string>("");

  // Overall Global Attendance Calculators
  const totalRequiredHours = units.reduce((acc, curr) => acc + curr.hoursRequired, 0);
  const totalAttendedHours = units.reduce((acc, curr) => acc + curr.hoursAttended, 0);
  const averageAttendancePct = totalRequiredHours > 0 
    ? Math.round((totalAttendedHours / totalRequiredHours) * 100) 
    : 0;

  // Track state flags per unit
  const unitsStatusCount = units.reduce((acc, u) => {
    const pct = u.hoursRequired > 0 ? (u.hoursAttended / u.hoursRequired) * 100 : 0;
    if (pct < 75) acc.critical += 1;
    else if (pct < 80) acc.warning += 1;
    else acc.safe += 1;
    return acc;
  }, { safe: 0, warning: 0, critical: 0 });

  // Handle addition of a new class session
  const handleAddSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUnitId || !formDate || formDuration <= 0) return;

    const selectedUnit = units.find(u => u.id === formUnitId);
    if (!selectedUnit) return;

    const newLogItem: AttendanceSession = {
      id: "att-session-" + Math.random().toString(36).substring(2, 9),
      unitId: formUnitId,
      unitName: selectedUnit.name,
      unitCode: selectedUnit.code,
      date: formDate,
      duration: Number(formDuration),
      status: formStatus,
      remarks: formRemarks.trim() || "Regular curriculum lecture checked.",
    };

    // Update attendance list
    const updatedLogs = [newLogItem, ...logs];
    onUpdateAttendanceLogs(updatedLogs);

    // Recalculate study hours on the matching course unit
    const updatedUnits = units.map(u => {
      if (u.id !== formUnitId) return u;
      
      const newRequired = u.hoursRequired + Number(formDuration);
      const newAttended = formStatus === "Present" 
        ? u.hoursAttended + Number(formDuration) 
        : u.hoursAttended; // physical absence doesn't bump physical presence hours

      return {
        ...u,
        hoursRequired: newRequired,
        hoursAttended: newAttended,
      };
    });

    onUpdateUnits(updatedUnits);

    // Reset fields and offer toast chime triggers
    setFormRemarks("");
    setShowAddForm(false);

    if (formStatus === "Present") {
      onTriggerInstantPush(
        "Class Signed In! ✓",
        `Logged +${formDuration} hours for [${selectedUnit.code}]. Keep building your attendance matrix.`
      );
    } else {
      onTriggerInstantPush(
        "Absence Registered 🔔",
        `Marked as ${formStatus} for ${formDuration} hours of ${selectedUnit.code}. Pay attention to the 75% cutoff!`
      );
    }
  };

  // Handle elimination of a historical session log with inverse credit hour calculations
  const handleDeleteSession = (logId: string) => {
    const logToDelete = logs.find(l => l.id === logId);
    if (!logToDelete) return;

    const updatedLogs = logs.filter(l => l.id !== logId);
    onUpdateAttendanceLogs(updatedLogs);

    const updatedUnits = units.map(u => {
      if (u.id !== logToDelete.unitId) return u;

      // Reverse hours calculation
      const nextRequired = Math.max(0, u.hoursRequired - logToDelete.duration);
      const nextAttended = logToDelete.status === "Present"
        ? Math.max(0, u.hoursAttended - logToDelete.duration)
        : u.hoursAttended;

      return {
        ...u,
        hoursRequired: nextRequired,
        hoursAttended: nextAttended,
      };
    });

    onUpdateUnits(updatedUnits);

    onTriggerInstantPush(
      "Session Log Revoked",
      `Removed attendance credit for date [${logToDelete.date}]. Relevant metrics recalculated.`
    );
  };

  // Filter conditions
  const filteredLogs = logs.filter(l => {
    const matchUnit = filterUnit === "all" || l.unitId === filterUnit;
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchUnit && matchStatus;
  });

  return (
    <div className="space-y-6 font-sans mb-6">
      
      {/* ATTENDANCE SUMMARY BOARD CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-slate-100 pb-5 mb-6">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-800 tracking-tight flex items-center gap-2">
              <UserCheck className="h-5.5 w-5.5 text-emerald-550" /> Class Attendance & Hourly Logger
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Fulfill CBET rules stating students must maintain a minimum 75% physical lecture presence to qualify for CDACC National Boards.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white hover:text-emerald-300 font-medium text-xs px-4 py-2.5 rounded-xl transition duration-200 flex items-center gap-1.5 self-start md:self-auto shadow-sm"
          >
            <Plus className="h-4 w-4" /> Check-in Class Session
          </button>
        </div>

        {/* METRICS METERS BENTO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
          
          {/* Card 1: Cumulative percentage */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
            <div className={`p-3 rounded-xl font-display font-black text-lg ${averageAttendancePct >= 80 ? "bg-emerald-50 text-emerald-600" : averageAttendancePct >= 75 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}>
              {averageAttendancePct}%
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 font-mono block">Overall Performance</span>
              <span className="text-xs font-bold text-slate-700 leading-tight">
                {averageAttendancePct >= 80 ? "✓ Full Qualification" : averageAttendancePct >= 75 ? "⚠ Marginal Risk" : "❌ Disqualified Registry"}
              </span>
            </div>
          </div>

          {/* Card 2: Safe units count */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl font-display font-bold text-lg">
              {unitsStatusCount.safe} / {units.length}
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 font-mono block">Qualified Courses</span>
              <span className="text-xs font-medium text-slate-600">Above 80% safe zone</span>
            </div>
          </div>

          {/* Card 3: Warning units count */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl font-display font-bold text-lg">
              {unitsStatusCount.warning}
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 font-mono block">Cautionary Units</span>
              <span className="text-xs font-medium text-slate-600">Falling near critical cutoff</span>
            </div>
          </div>

          {/* Card 4: Critical units count */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
            <div className={`p-3 rounded-xl font-display font-bold text-lg ${unitsStatusCount.critical > 0 ? "bg-rose-50 text-rose-600 animate-pulse" : "bg-slate-100 text-slate-400"}`}>
              {unitsStatusCount.critical}
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 font-mono block">Critical Courses</span>
              <span className="text-xs font-medium text-slate-600">Requires Urgent Remedials</span>
            </div>
          </div>

        </div>
      </div>

      {/* NEW SESSION LOGGER POPUP DOCK */}
      {showAddForm && (
        <form onSubmit={handleAddSessionSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm animate-fade-in">
          <div className="border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Check-in Dynamic Lecture Record</h3>
              <p className="text-[10px] text-slate-400">Add credit hours directly to your academic progress database.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {/* Unit Select */}
            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Target Module Unit</label>
              <select
                value={formUnitId}
                onChange={(e) => setFormUnitId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {units.map(u => (
                  <option key={u.id} value={u.id}>{u.code}</option>
                ))}
              </select>
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Session Date</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Credit Hours Duration */}
            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Duration (Lectured Hours)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={formDuration}
                onChange={(e) => setFormDuration(Math.max(1, Number(e.target.value)))}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Status Choice */}
            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Attendance Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Present">Present (Checked In)</option>
                <option value="Absent (Excused)">Absent (Excused/Sick)</option>
                <option value="Absent (Unexcused)">Absent (Unexcused/Missed)</option>
              </select>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Class Remarks / Subject Focus</label>
              <input
                type="text"
                placeholder="e.g. Subnet masks lab demo"
                value={formRemarks}
                onChange={(e) => setFormRemarks(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
            >
              Register Session Credits
            </button>
          </div>
        </form>
      )}

      {/* CORE SPLIT INTERACTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: ACTIVE COURSE SYLLABUS LIST */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 uppercase tracking-wider font-display flex items-center justify-between">
              <span>Unit-wise Attendance Review</span>
              <span className="text-[10px] font-mono text-slate-400 capitalize">Real-time stats</span>
            </h3>

            <div className="space-y-4">
              {units.map((u) => {
                const percentage = u.hoursRequired > 0 
                  ? Math.round((u.hoursAttended / u.hoursRequired) * 100) 
                  : 0;
                
                const isCritical = percentage < 75;
                const isWarning = percentage >= 75 && percentage < 80;

                return (
                  <div key={u.id} className="p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[9px] px-2 py-0.5 font-bold uppercase rounded bg-slate-900 text-white font-mono">
                          {u.code}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight mt-1">
                          {u.name}
                        </h4>
                      </div>

                      <div className="text-right">
                        <span className={`font-mono text-xs font-bold leading-none ${isCritical ? "text-rose-600 animate-pulse" : isWarning ? "text-amber-600" : "text-emerald-600"}`}>
                          {percentage}%
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-400 block mt-0.5">
                          {u.hoursAttended} / {u.hoursRequired} hrs
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar with safe margin zone */}
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                      {/* Critical line separator at 75% */}
                      <div className="absolute left-[75%] top-0 bottom-0 border-l border-dashed border-rose-450 z-10" />
                      
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${isCritical ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        {isCritical ? (
                          <span className="text-rose-500 font-bold flex items-center gap-0.5">
                            <AlertTriangle className="h-3 w-3" /> Critical status!
                          </span>
                        ) : isWarning ? (
                          <span className="text-amber-600 font-bold flex items-center gap-0.5">
                            <AlertTriangle className="h-3 w-3" /> Warning marginal
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                            <CheckCircle className="h-3 w-3" /> Attendance OK
                          </span>
                        )}
                      </span>

                      {/* Quick check-in inline micro trigger */}
                      <button
                        onClick={() => {
                          setFormUnitId(u.id);
                          setFormStatus("Present");
                          setShowAddForm(true);
                          // Scoll forms into view
                          window.scrollTo({ top: 350, behavior: "smooth" });
                        }}
                        className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 transition tracking-wide italic cursor-pointer underline"
                      >
                        Quick Add Session +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl border border-blue-10/20 bg-blue-50/20 text-[11px] leading-relaxed text-slate-500 flex gap-2">
            <Info className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
            <span>
              <strong>Note on Registry Auditing:</strong> The Registrar extracts cumulative attendance indices automatically before releasing final exam room card authorizations on Week 14. Adjust parameters carefully to avoid blocklisting in system records.
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: HISTORICAL CHECK-IN LOGS TABLE LIST */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-105 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-1.5">
                <FileSpreadsheet className="h-4.5 w-4.5 text-slate-400" /> Historical Session Diary
              </h3>
              
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={filterUnit}
                  onChange={(e) => setFilterUnit(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] text-slate-600 focus:outline-none"
                >
                  <option value="all">All Units</option>
                  {units.map(u => (
                    <option key={u.id} value={u.id}>{u.code}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SCROLLABLE HISTORICAL LIST GRID */}
            <div className="space-y-2.5 max-h-[385px] overflow-y-auto pr-1">
              {filteredLogs.map(log => (
                <div key={log.id} className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    {/* Status circle icons */}
                    <div className="mt-1 shrink-0">
                      {log.status === "Present" ? (
                        <div className="p-1 bg-emerald-50 text-emerald-600 rounded-full">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </div>
                      ) : log.status === "Absent (Excused)" ? (
                        <div className="p-1 bg-yellow-50 text-yellow-600 rounded-full">
                          <HelpCircle className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div className="p-1 bg-rose-50 text-rose-600 rounded-full">
                          <XCircle className="h-3.5 w-3.5 animate-pulse" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9.5px] font-mono font-extrabold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          {log.unitCode}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.date).toLocaleDateString("en-KE", { day: '2-digit', month: 'short' })}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 font-mono font-bold">
                          {log.duration} hrs
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-bold mt-1.5 leading-none">
                        {log.status}
                      </p>
                      
                      <p className="text-[10.5px] leading-relaxed text-slate-500 mt-1 max-w-[280px]">
                        {log.remarks}
                      </p>
                    </div>
                  </div>

                  {/* Deletion control */}
                  <button
                    onClick={() => handleDeleteSession(log.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded bg-transparent cursor-pointer transition shrink-0"
                    title="Remove logged entry from calculations"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div className="py-12 text-center border border-dashed border-slate-150 rounded-xl text-slate-400 text-xs font-medium">
                  No attendance session records match choice.
                </div>
              )}
            </div>

          </div>

          <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-[11.5px] text-slate-400 select-none">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Present check
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-yellow-500" /> Excused leave
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> Unexcused Absence
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
