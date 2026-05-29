/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CDACCDashboardData, CompetenceStatus, PoEStatus } from "../types.ts";
import { BookOpen, Users, Award, AlertTriangle, CheckCircle2, CircleDot, BellRing } from "lucide-react";

interface CDACCSummaryCardsProps {
  data: CDACCDashboardData;
  isNotificationsEnabled: boolean;
  onRequestNotificationPermission: () => void;
  onNavigateToTab: (tabId: string) => void;
}

export default function CDACCSummaryCards({
  data,
  isNotificationsEnabled,
  onRequestNotificationPermission,
  onNavigateToTab,
}: CDACCSummaryCardsProps) {
  // 1. Calculate Attendance averages
  let totalRequiredHours = 0;
  let totalAttendedHours = 0;
  data.units.forEach((u) => {
    totalRequiredHours += u.hoursRequired;
    totalAttendedHours += u.hoursAttended;
  });
  const overallAttendancePct = totalRequiredHours > 0 
    ? Math.round((totalAttendedHours / totalRequiredHours) * 100) 
    : 0;

  // 2. PoE progress metrics
  const totalUnits = data.units.length;
  const certifiedUnits = data.units.filter(u => u.poeStatus === PoEStatus.CERTIFIED).length;
  const readyUnits = data.units.filter(u => u.poeStatus === PoEStatus.READY_FOR_ASSESSMENT).length;
  const inProgressUnits = data.units.filter(u => u.poeStatus === PoEStatus.IN_PROGRESS).length;

  // 3. Assessment averages
  let scoreSum = 0;
  let scoreCount = 0;
  let totalCompetent = 0;
  let totalNYC = 0;

  data.units.forEach((u) => {
    u.assessments.forEach((a) => {
      scoreSum += a.obtainedScore;
      scoreCount++;
      if (a.status === CompetenceStatus.COMPETENT) {
        totalCompetent++;
      } else if (a.status === CompetenceStatus.NOT_YET_COMPETENT) {
        totalNYC++;
      }
    });
  });

  const overallAverage = scoreCount > 0 ? Math.round(scoreSum / scoreCount) : 0;

  // 4. Deadlines count
  const pendingDeadlines = data.deadlines.filter((d) => !d.completed);
  const urgentDeadlines = pendingDeadlines.filter((d) => {
    const dueTime = new Date(d.dueDate).getTime();
    const nowTime = new Date().getTime();
    const diffDays = (dueTime - nowTime) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 font-sans">
      {/* 1. ATTENDANCE CARD */}
      <div 
        id="card-attendance"
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
        onClick={() => onNavigateToTab("attendance")}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-500 text-sm font-medium">Core Class Attendance</span>
          <div className={`p-2 rounded-lg ${overallAttendancePct >= 80 ? "bg-emerald-50 text-emerald-600" : overallAttendancePct >= 75 ? "bg-amber-50 text-amber-500" : "bg-rose-50 text-rose-500"}`}>
            <Users className="h-5 w-5" />
          </div>
        </div>
        
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800 tracking-tight font-display">{overallAttendancePct}%</span>
            <span className="text-slate-400 text-xs font-mono font-medium">({totalAttendedHours}/{totalRequiredHours} Hrs)</span>
          </div>
          
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${overallAttendancePct >= 80 ? "bg-emerald-500" : overallAttendancePct >= 75 ? "bg-amber-500" : "bg-rose-500"}`}
              style={{ width: `${overallAttendancePct}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400">CDACC Requirement</span>
          {overallAttendancePct >= 75 ? (
            <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Exam Qualified
            </span>
          ) : (
            <span className="text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
              <AlertTriangle className="h-3.5 w-3.5" /> Below Req (75%)
            </span>
          )}
        </div>
      </div>

      {/* 2. POE COMPILATION */}
      <div 
        id="card-poe"
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
        onClick={() => onNavigateToTab("poe")}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-500 text-sm font-medium">Evidence Binder (PoE)</span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-800 tracking-tight font-display">{certifiedUnits + readyUnits}</span>
            <span className="text-slate-400 text-sm">/ {totalUnits} Units</span>
          </div>
          <span className="text-slate-400 text-xs">Certified or Assessable units</span>
          
          <div className="flex gap-1.5 mt-3">
            <div className="flex-1 bg-emerald-100 h-1.5 rounded-full" title={`${certifiedUnits} Certified`} style={{ opacity: certifiedUnits > 0 ? 1 : 0.2 }} />
            <div className="flex-1 bg-indigo-200 h-1.5 rounded-full" title={`${readyUnits} Ready`} style={{ opacity: readyUnits > 0 ? 1 : 0.2 }} />
            <div className="flex-1 bg-amber-200 h-1.5 rounded-full" title={`${inProgressUnits} Draft`} style={{ opacity: inProgressUnits > 0 ? 1 : 0.2 }} />
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
          <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">{certifiedUnits} Cert</span>
          <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">{readyUnits} Ready</span>
          <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">{inProgressUnits} Draft</span>
        </div>
      </div>

      {/* 3. GRADES / AVERAGE */}
      <div 
        id="card-grades"
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
        onClick={() => onNavigateToTab("grades")}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-500 text-sm font-medium">Performance Metrics</span>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Award className="h-5 w-5" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800 tracking-tight font-display">{overallAverage}%</span>
            <span className="text-slate-400 text-xs font-mono font-medium">Average across CATs</span>
          </div>
          
          <div className="flex gap-3 text-xs mt-3.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-500 text-[11px] font-medium">{totalCompetent} Competencies</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              <span className="text-slate-500 text-[11px] font-medium">{totalNYC} NYC Remedials</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium">
          <span className="text-slate-400">Continuous Assessments</span>
          {totalNYC > 0 ? (
            <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full animate-pulse font-semibold">
              Needs Revision
            </span>
          ) : (
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
              All Competent
            </span>
          )}
        </div>
      </div>

      {/* 4. DEADLINES & REMINDERS */}
      <div 
        id="card-deadlines"
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
        onClick={() => onNavigateToTab("deadlines")}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-500 text-sm font-medium">Upcoming Milestones</span>
          <div className={`p-2 rounded-lg ${urgentDeadlines.length > 0 ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"}`}>
            <BellRing className={`h-5 w-5 ${urgentDeadlines.length > 0 ? "animate-bounce" : ""}`} />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-800 tracking-tight font-display">{pendingDeadlines.length}</span>
            <span className="text-slate-400 text-sm">Remaining Tasks</span>
          </div>
          {urgentDeadlines.length > 0 ? (
            <span className="text-rose-500 text-xs font-medium flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3" /> {urgentDeadlines.length} due in 7 days!
            </span>
          ) : (
            <span className="text-slate-400 text-xs flex items-center gap-1 mt-1">
              <CircleDot className="h-3.5 w-3.5 text-emerald-400" /> Schedule is healthy
            </span>
          )}
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-slate-400 text-xs">Notification Mode</span>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent tab navigation
              onRequestNotificationPermission();
            }}
            className={`text-[10px] font-mono px-2 py-1 rounded-full font-semibold transition-colors uppercase cursor-pointer ${isNotificationsEnabled ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-blue-100 text-blue-800 hover:bg-blue-200"}`}
          >
            {isNotificationsEnabled ? "Push: ON" : "Turn ON Push"}
          </button>
        </div>
      </div>
    </div>
  );
}
