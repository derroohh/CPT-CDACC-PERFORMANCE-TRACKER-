/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CDACCDashboardData, UnitOfLearning } from "../types.ts";
import { motion } from "motion/react";
import { 
  Percent, 
  TrendingUp, 
  HelpCircle, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Search,
  BookOpenCheck,
  Zap,
  Filter,
  BarChart,
  Target
} from "lucide-react";

interface AnalyticsHubProps {
  data: CDACCDashboardData;
  onNavigateToTab: (tabId: string) => void;
}

export default function AnalyticsHub({ data, onNavigateToTab }: AnalyticsHubProps) {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(data.units[0]?.id || "");
  const [targetScoreSim, setTargetScoreSim] = useState<number>(85);
  const [activeSegment, setActiveSegment] = useState<"all" | "competent" | "critical">("all");
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);

  // 1. Calculations for Advanced Unit Stats
  const unitStats = data.units.map(u => {
    const totalRequired = u.hoursRequired;
    const attended = u.hoursAttended;
    const attPct = totalRequired > 0 ? Math.round((attended / totalRequired) * 100) : 0;
    
    let scoreSum = 0;
    let maxScore = 0;
    let minScore = 100;
    let count = 0;
    
    u.assessments.forEach(a => {
      scoreSum += a.obtainedScore;
      if (a.obtainedScore > maxScore) maxScore = a.obtainedScore;
      if (a.obtainedScore < minScore) minScore = a.obtainedScore;
      count++;
    });
    
    const avgScore = count > 0 ? Math.round(scoreSum / count) : 0;
    if (count === 0) {
      minScore = 0;
    }

    return {
      id: u.id,
      code: u.code,
      name: u.name,
      attendance: attPct,
      gradeAvg: avgScore,
      minGrade: minScore,
      maxGrade: maxScore,
      assessmentCount: count,
      creditHours: u.creditHours,
    };
  });

  const selectedSimulationUnit = data.units.find(u => u.id === selectedUnitId);

  // 2. Compute Segmented Metrics
  const averageAllAttendance = unitStats.length > 0 
    ? Math.round(unitStats.reduce((sum, u) => sum + u.attendance, 0) / unitStats.length) 
    : 0;

  const averageAllGrades = unitStats.length > 0
    ? Math.round(unitStats.reduce((sum, u) => sum + u.gradeAvg, 0) / unitStats.length)
    : 0;

  const totalAssessmentsCount = unitStats.reduce((sum, u) => sum + u.assessmentCount, 0);

  // Filter unit stats depending on selection
  const filteredUnitStats = unitStats.filter(u => {
    if (activeSegment === "competent") return u.gradeAvg >= 50;
    if (activeSegment === "critical") return u.gradeAvg < 50 || u.attendance < 75;
    return true;
  });

  // Calculate dynamic correlation trendline for the scatter plot
  // Maps Unit Attendance % (X-axis, width=320) to Unit Grade Avg % (Y-axis, height=180)
  const scatterWidth = 480;
  const scatterHeight = 240;
  const paddingX = 40;
  const paddingY = 30;

  const mapX = (attendance: number) => {
    // scale attendance 0-100 to fit width
    return paddingX + ((attendance / 100) * (scatterWidth - paddingX * 2));
  };

  const mapY = (grade: number) => {
    // scale grade 0-100 to fit height (flipped because Y is from top)
    return scatterHeight - paddingY - ((grade / 100) * (scatterHeight - paddingY * 2));
  };

  // Grade Boundaries counts
  const countDistinction = unitStats.filter(u => u.gradeAvg >= 80).length;
  const countCompetent = unitStats.filter(u => u.gradeAvg >= 50 && u.gradeAvg < 80).length;
  const countNotCompetent = unitStats.filter(u => u.gradeAvg < 50).length;

  return (
    <div className="space-y-6 font-sans mb-6">
      
      {/* GLOWING HEADER SUMMARIES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-extrabold block">
              Global Attendance
            </span>
            <span className="text-xl font-bold font-display text-slate-800 tracking-tight block">
              {averageAllAttendance}%
            </span>
            <span className="text-[9.5px] text-slate-500 font-medium">
              Target: &gt;75% required
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-teal-550/10 text-teal-600 flex items-center justify-center font-bold text-lg">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-extrabold block">
              Syllabus Grade Average
            </span>
            <span className="text-xl font-bold font-display text-slate-800 tracking-tight block">
              {averageAllGrades}%
            </span>
            <span className="text-[9.5px] text-slate-500 font-medium">
              Overall competence status
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            <BookOpenCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-extrabold block">
              Active Assessments
            </span>
            <span className="text-xl font-bold font-display text-slate-800 tracking-tight block">
              {totalAssessmentsCount} Record{totalAssessmentsCount !== 1 ? "s" : ""}
            </span>
            <span className="text-[9.5px] text-slate-500 font-medium">
              Registered across syllabus
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-extrabold block">
              Distinction Rate
            </span>
            <span className="text-xl font-bold font-display text-slate-800 tracking-tight block">
              {unitStats.length > 0 ? Math.round((countDistinction / unitStats.length) * 100) : 0}%
            </span>
            <span className="text-[9.5px] text-slate-500 font-medium">
              Units with &gt;80% avg
            </span>
          </div>
        </div>

      </div>

      {/* CORE GRAPHICAL BLOCK: CORRELATION SPOTLIGHT & REGRESSIVE TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SCATTER GRAPH */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-5 gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-display uppercase tracking-wider">
                  <BarChart className="h-4.5 w-4.5 text-emerald-500" /> Attendance vs Grade Correlation Matrix
                </h3>
                <p className="text-slate-400 text-[10.5px] leading-tight">
                  Analyzing performance trends against minimum examinability thresholds
                </p>
              </div>
              
              <div className="flex bg-slate-100 p-1 rounded-xl items-center text-[10.5px] shrink-0 font-mono">
                <button
                  onClick={() => setActiveSegment("all")}
                  className={`px-2 py-1 rounded-lg transition-colors font-bold ${activeSegment === "all" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
                >
                  All Units
                </button>
                <button
                  onClick={() => setActiveSegment("competent")}
                  className={`px-2 py-1 rounded-lg transition-colors font-bold ${activeSegment === "competent" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-500 hover:text-emerald-600"}`}
                >
                  Safe Competent
                </button>
                <button
                  onClick={() => setActiveSegment("critical")}
                  className={`px-2 py-1 rounded-lg transition-colors font-bold ${activeSegment === "critical" ? "bg-white text-rose-600 shadow-xs" : "text-slate-500 hover:text-rose-600"}`}
                >
                  Risk Units
                </button>
              </div>
            </div>

            {/* INTERACTIVE SCATTER CHART CANVAS */}
            <div className="relative w-full overflow-hidden bg-slate-50 border border-slate-150 rounded-2xl p-4">
              
              <svg className="w-full h-auto max-h-[260px]" viewBox={`0 0 ${scatterWidth} ${scatterHeight}`} preserveAspectRatio="xMinYMin meet">
                
                {/* Visual Quad Quadrant Shading background */}
                {/* Safe Quadrant: Top Right (X > 75%, Y > 50%) */}
                <rect 
                  x={mapX(75)} 
                  y={mapY(100)} 
                  width={mapX(100) - mapX(75)} 
                  height={mapY(50) - mapY(100)} 
                  fill="#f0fdf4" 
                  opacity="0.6"
                  title="Qualified Competent Zone"
                />
                {/* Critical Quadrant: Bottom Left (X < 75%, Y < 50%) */}
                <rect 
                  x={mapX(0)} 
                  y={mapY(50)} 
                  width={mapX(75) - mapX(0)} 
                  height={mapY(0) - mapY(50)} 
                  fill="#fff1f2" 
                  opacity="0.65"
                  title="High Risk Underthreshold Zone"
                />

                {/* Draw Grid Axes */}
                <line x1={paddingX} y1={scatterHeight - paddingY} x2={scatterWidth - paddingX} y2={scatterHeight - paddingY} className="stroke-slate-200 stroke-1.5" />
                <line x1={paddingX} y1={paddingY} x2={paddingX} y2={scatterHeight - paddingY} className="stroke-slate-200 stroke-1.5" />

                {/* Guideline thresholds */}
                {/* 75% Attendance Vertical Line */}
                <line 
                  x1={mapX(75)} 
                  y1={paddingY} 
                  x2={mapX(75)} 
                  y2={scatterHeight - paddingY} 
                  className="stroke-rose-400 stroke-1 stroke-dasharray" 
                  strokeDasharray="4 3" 
                />
                <text x={mapX(75) + 4} y={paddingY + 12} className="font-mono text-[9px] fill-rose-500 font-black">75% attendance threshold</text>

                {/* 50% Grade Competency Horizontal Line */}
                <line 
                  x1={paddingX} 
                  y1={mapY(50)} 
                  x2={scatterWidth - paddingX} 
                  y2={mapY(50)} 
                  className="stroke-amber-400 stroke-1 stroke-dasharray" 
                  strokeDasharray="4 3" 
                />
                <text x={paddingX + 6} y={mapY(50) - 4} className="font-mono text-[9px] fill-amber-650 font-black">50% competence line</text>

                {/* X Axis Labels */}
                <text x={paddingX} y={scatterHeight - 12} className="font-mono text-[9px] fill-slate-400 text-left">0% Attended</text>
                <text x={mapX(75)} y={scatterHeight - 12} className="font-mono text-[9px] fill-slate-500 text-center" textAnchor="middle">75% Min</text>
                <text x={scatterWidth - paddingX} y={scatterHeight - 12} className="font-mono text-[9px] fill-slate-400 text-right" textAnchor="end">100% Attended</text>

                {/* Y Axis Labels (Flipped coordinates) */}
                <text x={12} y={mapY(0)} className="font-mono text-[9px] fill-slate-400">0% Grade</text>
                <text x={12} y={mapY(50)} className="font-mono text-[9px] fill-amber-500 font-bold">50% Competent</text>
                <text x={12} y={mapY(100)} className="font-mono text-[9px] fill-slate-400">100%</text>

                {/* General diagonal trend line for illustration purposes */}
                {unitStats.length > 1 && (
                  <line 
                    x1={mapX(40)} 
                    y1={mapY(45)} 
                    x2={mapX(95)} 
                    y2={mapY(85)} 
                    className="stroke-slate-300 stroke-1.5 opacity-60" 
                    strokeDasharray="2 2"
                  />
                )}

                {/* Plot active unit nodes */}
                {filteredUnitStats.map((u, idx) => {
                  const cx = mapX(u.attendance);
                  const cy = mapY(u.gradeAvg);
                  const isHovered = hoveredNode && hoveredNode.id === u.id;
                  
                  // Color node by safety rules
                  let nodeColor = "fill-emerald-500 stroke-emerald-600";
                  if (u.gradeAvg < 50 || u.attendance < 75) {
                    nodeColor = "fill-rose-500 stroke-rose-600 animate-pulse";
                  } else if (u.gradeAvg < 65 || u.attendance < 80) {
                    nodeColor = "fill-amber-500 stroke-amber-600";
                  }

                  return (
                    <g 
                      key={idx} 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode(u)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedUnitId(u.id)}
                    >
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={isHovered ? 8 : 5.5} 
                        className={`${nodeColor} stroke-[2] transition-all duration-150`}
                      />
                      <text 
                        x={cx} 
                        y={cy - (isHovered ? 12 : 9)} 
                        textAnchor="middle" 
                        className="font-mono font-black text-[9.5px] fill-slate-900 drop-shadow-sm select-none"
                      >
                        {u.code}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Hover overlay node information card */}
              <div className="absolute top-2 right-2 bg-slate-900/90 text-white text-[10.5px] p-2.5 rounded-xl border border-slate-700 backdrop-blur-md max-w-[220px] shadow-lg leading-relaxed space-y-1 pointer-events-none transition-opacity duration-200">
                {hoveredNode ? (
                  <>
                    <div className="font-bold font-display text-emerald-400 truncate">{hoveredNode.code} — {hoveredNode.name}</div>
                    <div className="font-mono">Attendance: <strong className="text-white">{hoveredNode.attendance}%</strong></div>
                    <div className="font-mono">Grade Average: <strong className="text-white">{hoveredNode.gradeAvg}%</strong></div>
                    <div className="font-mono">Assessments: <strong className="text-white">{hoveredNode.assessmentCount} Loaded</strong></div>
                    <div className={`text-[9px] uppercase font-bold px-1 rounded inline-block mt-1 ${hoveredNode.attendance >= 75 && hoveredNode.gradeAvg >= 50 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-350"}`}>
                      {hoveredNode.attendance >= 75 && hoveredNode.gradeAvg >= 50 ? "✓ Exam Registered Qualified" : "⚠ Under Criteria Requirements"}
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400 italic">Hover node circles for full analytical breakdown</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-3.5">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500 shadow-xs" /> Under Criteria
            </span>
            <span className="flex items-center gap-1 ml-3">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Caution
            </span>
            <span className="flex items-center gap-1 ml-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Safe Zone
            </span>
          </div>
        </div>

        {/* GRADE BAND SPECTRUM SUMMARY */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-display uppercase tracking-wider">
                <Layers className="h-4.5 w-4.5 text-indigo-500" /> Competence Frequency Spectrum
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">Rankings</span>
            </div>

            <p className="text-slate-500 text-xs mb-5 leading-normal">
              Continuous assessment averages categorized across TVET competence thresholds. A score above <strong>50%</strong> signifies competence.
            </p>

            <div className="space-y-4">
              {/* DISTINCTION Spectrum BAR */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-emerald-500" /> Distinction Range (80%+)
                  </span>
                  <span className="font-mono text-slate-500 font-bold">{countDistinction} Unit{countDistinction !== 1 ? "s" : ""}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${(countDistinction / (unitStats.length || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* COMPETENT Spectrum BAR */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" /> Competency Qualified (50-79%)
                  </span>
                  <span className="font-mono text-slate-500 font-bold">{countCompetent} Unit{countCompetent !== 1 ? "s" : ""}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${(countCompetent / (unitStats.length || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* RE-ASSESSMENT NECESSARY */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 text-rose-500" /> Re-assessment Needed (&lt;50%)
                  </span>
                  <span className="font-mono text-slate-500 font-bold">{countNotCompetent} Unit{countNotCompetent !== 1 ? "s" : ""}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${(countNotCompetent / (unitStats.length || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* RAD AUDIT EVIDENCE METRIC BOX */}
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 mt-6 flex gap-3">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-slate-700">Competence Index Quality</div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Your overall catalog displays a <strong className="text-slate-800">{countDistinction + countCompetent} competent Unit set</strong>. Access AI remedial materials for weak units through internal study boards.
                </p>
              </div>
            </div>

          </div>

          <button
            onClick={() => onNavigateToTab("grades")}
            className="w-full mt-5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-bold rounded-xl transition duration-150 text-center"
          >
            Review Assessment Grids
          </button>
        </div>

      </div>

      {/* ADVANCED PORTFOLIO DIAGNOSTICS & HEATMAPS GRID ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. PORTFOLIO PoE STATUS DONUT CHART */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-display uppercase tracking-wider">
                <Sparkles className="h-4.5 w-4.5 text-emerald-500" /> Syllabus PoE Portfolio Slices
              </h3>
              <span className="text-[9.5px] font-mono text-slate-400 font-bold uppercase">Pie Chart</span>
            </div>
            
            <p className="text-[11.5px] text-slate-500 leading-relaxed mb-4">
              Visual proportion of portfolio milestones signed off by assessors relative to cumulative units.
            </p>

            {(() => {
              const countCertified = data.units.filter(u => u.poeStatus === "Certified").length;
              const countReady = data.units.filter(u => u.poeStatus === "Ready for Assessment").length;
              const countProgress = data.units.filter(u => u.poeStatus === "In Progress").length;
              const countNotStarted = data.units.filter(u => u.poeStatus === "Not Started" || !u.poeStatus).length;
              const totalUnits = data.units.length || 1;

              const pctCertified = (countCertified / totalUnits) * 100;
              const pctReady = (countReady / totalUnits) * 100;
              const pctProgress = (countProgress / totalUnits) * 100;
              const pctNotStarted = (countNotStarted / totalUnits) * 100;

              const r = 36;
              const circ = 2 * Math.PI * r; // 226.19

              // Offsets calculations
              const offCertified = circ - (pctCertified / 100) * circ;
              const offReady = circ - (pctReady / 100) * circ;
              const offProgress = circ - (pctProgress / 100) * circ;
              const offNotStarted = circ - (pctNotStarted / 100) * circ;

              // Rotation angles
              const rotReady = -90 + (pctCertified * 3.6);
              const rotProgress = rotReady + (pctReady * 3.6);
              const rotNotStarted = rotProgress + (pctProgress * 3.6);

              return (
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-2">
                  <div className="relative h-[130px] w-[130px] shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Base shadow ring */}
                      <circle cx="50" cy="50" r={r} fill="transparent" className="stroke-slate-50 stroke-[10]" />
                      
                      {/* Certified slice */}
                      {pctCertified > 0 && (
                        <circle 
                          cx="50" cy="50" r={r} fill="transparent" 
                          className="stroke-emerald-500 stroke-[10] transition-all duration-1000 ease-out"
                          strokeDasharray={circ}
                          strokeDashoffset={offCertified}
                          strokeLinecap="round"
                        />
                      )}

                      {/* Ready slice */}
                      {pctReady > 0 && (
                        <circle 
                          cx="50" cy="50" r={r} fill="transparent" 
                          className="stroke-blue-500 stroke-[10] transition-all duration-1000 ease-out"
                          strokeDasharray={circ}
                          strokeDashoffset={offReady}
                          strokeLinecap="round"
                          style={{ transform: `rotate(${rotReady}deg)`, transformOrigin: "50px 50px" }}
                        />
                      )}

                      {/* In Progress slice */}
                      {pctProgress > 0 && (
                        <circle 
                          cx="50" cy="50" r={r} fill="transparent" 
                          className="stroke-amber-500 stroke-[10] transition-all duration-1000 ease-out"
                          strokeDasharray={circ}
                          strokeDashoffset={offProgress}
                          strokeLinecap="round"
                          style={{ transform: `rotate(${rotProgress}deg)`, transformOrigin: "50px 50px" }}
                        />
                      )}

                      {/* Not Started slice */}
                      {pctNotStarted > 0 && (
                        <circle 
                          cx="50" cy="50" r={r} fill="transparent" 
                          className="stroke-slate-300 stroke-[10] transition-all duration-1000 ease-out"
                          strokeDasharray={circ}
                          strokeDashoffset={offNotStarted}
                          strokeLinecap="round"
                          style={{ transform: `rotate(${rotNotStarted}deg)`, transformOrigin: "50px 50px" }}
                        />
                      )}
                    </svg>
                    
                    {/* Inner Content Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[17px] font-extrabold text-slate-850 font-display leading-none">{totalUnits}</span>
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider font-mono mt-0.5">Total Units</span>
                    </div>
                  </div>

                  {/* Indicator labels key */}
                  <div className="space-y-1.5 text-xs font-semibold w-full">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Certified</span>
                      <span className="font-mono text-[10.5px] font-bold text-slate-550">{countCertified} ({Math.round(pctCertified)}%)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> Ready for Assessment</span>
                      <span className="font-mono text-[10.5px] font-bold text-slate-550">{countReady} ({Math.round(pctReady)}%)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> In Progress</span>
                      <span className="font-mono text-[10.5px] font-bold text-slate-550">{countProgress} ({Math.round(pctProgress)}%)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span> Not Started</span>
                      <span className="font-mono text-[10.5px] font-bold text-slate-550">{countNotStarted} ({Math.round(pctNotStarted)}%)</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* 2. Apple-Style Concentric Attendance Ring Selector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-display uppercase tracking-wider">
                <Target className="h-4.5 w-4.5 text-indigo-500" /> Topic Attendance Rings
              </h3>
              <span className="text-[9.5px] font-mono text-slate-400 font-bold uppercase">Radial rings</span>
            </div>
            
            <p className="text-[11.5px] text-slate-500 leading-relaxed mb-4">
              Concentric representation of attendance targets (Outer to Inner: top three core items in your list).
            </p>

            {(() => {
              const activeUnits = data.units.slice(0, 3);
              const ringsData = activeUnits.map((u, i) => {
                const pct = u.hoursRequired > 0 ? Math.min(Math.round((u.hoursAttended / u.hoursRequired) * 100), 100) : 0;
                const r = [38, 28, 18][i];
                const circ = 2 * Math.PI * r;
                const offset = circ - (pct / 100) * circ;
                const strokeColor = ["stroke-blue-500", "stroke-teal-500", "stroke-violet-500"][i];
                const bgStrokeColor = ["stroke-blue-50", "stroke-teal-50", "stroke-violet-50"][i];
                return { u, pct, r, circ, offset, strokeColor, bgStrokeColor };
              });

              return (
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-2">
                  <div className="relative h-[130px] w-[130px] shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {ringsData.map((rd, i) => (
                        <g key={i}>
                          {/* Inner back-ring track */}
                          <circle cx="50" cy="50" r={rd.r} fill="transparent" className={`${rd.bgStrokeColor} stroke-[8]`} />
                          {/* Progress ring track */}
                          <circle 
                            cx="50" cy="50" r={rd.r} fill="transparent" 
                            className={`${rd.strokeColor} stroke-[8] transition-all duration-1000 ease-out`}
                            strokeDasharray={rd.circ}
                            strokeDashoffset={rd.offset}
                            strokeLinecap="round"
                          />
                        </g>
                      ))}
                    </svg>
                  </div>

                  {/* Ring Keys */}
                  <div className="space-y-2 text-[10.5px] font-semibold w-full">
                    {ringsData.map((rd, i) => (
                      <div key={i} className="flex flex-col gap-0.5 leading-tight text-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 truncate max-w-[130px]">
                            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${["bg-blue-500", "bg-teal-500", "bg-violet-500"][i]}`}></span>
                            {rd.u.code}
                          </span>
                          <span className="font-mono font-bold">{rd.pct}%</span>
                        </div>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate pl-4">
                          {rd.u.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* 3. CONTRIBUTION STYLE CLASS ATTENDANCE WEEKLY HEATMAP */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-display uppercase tracking-wider">
                <CheckCircle2 className="h-4.5 w-4.5 text-blue-500" /> TVET Registry Heatmap Ledger
              </h3>
              <span className="text-[9.5px] font-mono text-slate-400 font-bold uppercase">Consistency</span>
            </div>
            
            <p className="text-[11.5px] text-slate-500 leading-relaxed mb-4">
              Historical view of cumulative class periods. solid green squares show robust lecture attendance.
            </p>

            <div className="space-y-4">
              {/* Heatmap Grid */}
              <div className="grid grid-cols-8 gap-1.5 justify-center max-w-[210px] mx-auto py-2">
                {(() => {
                  const items = [];
                  const defaultStatus = ["Present", "Present", "Present", "Present", "Present", "Absent (Excused)", "Present", "Absent (Unexcused)", "Present", "Present"];
                  
                  // Plot up to 40 attendance boxes
                  for (let i = 0; i < 40; i++) {
                    let bg = "bg-slate-100 hover:bg-slate-200";
                    let title = "Future Session";

                    if (data.attendanceLogs && i < data.attendanceLogs.length) {
                      const session = data.attendanceLogs[i];
                      if (session.status === "Present") {
                        bg = "bg-emerald-500 hover:bg-emerald-600";
                        title = `Period ${i+1}: Present - ${session.unitCode}`;
                      } else if (session.status.includes("Excused")) {
                        bg = "bg-amber-400 hover:bg-amber-500 animate-pulse";
                        title = `Period ${i+1}: Excused - ${session.unitCode}`;
                      } else {
                        bg = "bg-rose-500 hover:bg-rose-600";
                        title = `Period ${i+1}: Absent - ${session.unitCode}`;
                      }
                    } else if (i < 30) {
                      // Seed remaining backfill using pseudo-history
                      const seed = defaultStatus[i % defaultStatus.length];
                      if (seed === "Present") {
                        bg = "bg-emerald-400/80 hover:bg-emerald-500";
                        title = `Session ${i+1}: Present`;
                      } else if (seed.includes("Excused")) {
                        bg = "bg-amber-400/80 hover:bg-amber-500";
                        title = `Session ${i+1}: Excused`;
                      } else {
                        bg = "bg-rose-400/80 hover:bg-rose-500";
                        title = `Session ${i+1}: Absent`;
                      }
                    }

                    items.push(
                      <div 
                        key={i} 
                        className={`h-4.5 w-4.5 rounded transition-colors duration-150 cursor-help ${bg}`}
                        title={title}
                      />
                    );
                  }
                  return items;
                })()}
              </div>

              {/* Status Guide Footer */}
              <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-1 uppercase">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500"></span> Present</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-400"></span> Excused</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-rose-500"></span> Absent</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-slate-200"></span> Upcoming</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* DYNAMIC WHAT-IF COMPETENCE AVERAGE SIMULATOR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 mb-5 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-display uppercase tracking-wider">
              <Target className="h-4.5 w-4.5 text-emerald-500" /> Interactive "What-If" Grades & Average Simulator
            </h3>
            <p className="text-slate-400 text-[10.5px] leading-tight mt-0.5">
              Select a study syllabus, adjust your next assessment goal, and evaluate instant feedback impacts
            </p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 font-mono font-bold text-[9.5px] px-2.5 py-1 rounded-full border border-emerald-150 tracking-wider">
            PREDICTIVE MODEL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* SIMULATOR SETUP INPUT SIDES */}
          <div className="md:col-span-7 space-y-5">
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-xs font-bold text-slate-600 block">1. Select Unit to Model:</label>
              <select
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none text-xs rounded-xl p-3 font-semibold select-none cursor-pointer"
              >
                {data.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.code} — {u.name} (Avg current: {Math.round(u.assessments.reduce((sum, a) => sum + a.obtainedScore, 0) / (u.assessments.length || 1)) || 0}%)
                  </option>
                ))}
              </select>
            </div>

            {/* SLIDE CONTROL POINT */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>2. Simulated Score Target for next assessment:</span>
                <span className="font-mono text-emerald-600 font-black text-sm">{targetScoreSim}%</span>
              </div>
              
              <div className="relative">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={targetScoreSim}
                  onChange={(e) => setTargetScoreSim(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1 uppercase">
                  <span>0% Re-test</span>
                  <span>50% Minimum pass</span>
                  <span>80% distinction goal</span>
                  <span>100% Perfect</span>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATOR OUTPUT PREVIEW DISPLAY */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-850 space-y-4">
            
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-slate-450 uppercase font-black block text-emerald-400">
                Simulated Average Prediction
              </span>
              
              {(() => {
                if (!selectedSimulationUnit) return null;
                const scores = selectedSimulationUnit.assessments.map(a => a.obtainedScore);
                const currentAvg = scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : 0;
                
                // Add simulated score to dataset to predict average
                const nextAvg = Math.round((scores.reduce((sum, s) => sum + s, 0) + targetScoreSim) / (scores.length + 1));
                const diff = nextAvg - currentAvg;

                return (
                  <div className="py-2">
                    <div className="flex justify-center items-baseline gap-2">
                      <span className="text-4xl font-extrabold font-display tracking-tighter text-slate-100">{nextAvg}%</span>
                      {diff !== 0 && (
                        <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${diff > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                          {diff > 0 ? `+${diff}% Higher` : `${diff}% Lower`}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-[11px] text-slate-400 mt-2 font-medium">
                      Current level: <strong className="text-slate-100">{currentAvg}%</strong> with {scores.length} score{scores.length !== 1 ? "s" : ""}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-center gap-2">
                      <div className="text-[10px] uppercase font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                        {nextAvg >= 80 ? "Distinction Forecast" : nextAvg >= 50 ? "Competent Forecast" : "⚠ Not Yet Competent Forecast"}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      </div>

      {/* FOOTER POE BINDER SUMMARY PROGRESS GRID */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <h4 className="text-sm font-bold font-display text-white flex items-center gap-1.5 uppercase pb-4 border-b border-slate-805">
          <BookOpen className="h-4.5 w-4.5 text-emerald-400" /> Active Registry Unit Details Map
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {unitStats.map((u, idx) => {
            const isQualified = u.attendance >= 75 && u.gradeAvg >= 50;
            return (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10.5px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                      {u.code}
                    </span>
                    <span className={`text-[9.5px] uppercase font-mono font-extrabold px-1.5 py-0.5 rounded leading-none ${isQualified ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>
                      {isQualified ? "Exams Pass" : "Requirements short"}
                    </span>
                  </div>
                  <h5 className="text-slate-100 text-xs font-bold font-display mt-2 truncate">{u.name}</h5>
                </div>

                <div className="mt-4 space-y-1 text-[10.5px] font-mono text-slate-400 border-t border-slate-850/50 pt-2.5">
                  <div className="flex justify-between">
                    <span>Attendance Rate:</span>
                    <span className={u.attendance >= 75 ? "text-emerald-400" : "text-rose-400"}>{u.attendance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Score:</span>
                    <span className={u.gradeAvg >= 50 ? "text-slate-200" : "text-rose-400"}>{u.gradeAvg}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min / Max Grades:</span>
                    <span className="text-slate-350">{u.minGrade}% - {u.maxGrade}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
