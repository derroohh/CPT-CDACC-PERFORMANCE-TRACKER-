/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CDACCDashboardData, UnitOfLearning } from "../types.ts";
import { BarChart, Percent, TrendingUp, HelpCircle, GraduationCap, Award, BookOpen } from "lucide-react";

interface PerformanceGraphsProps {
  data: CDACCDashboardData;
  onNavigateToTab: (tabId: string) => void;
}

export default function PerformanceGraphs({ data, onNavigateToTab }: PerformanceGraphsProps) {
  
  // 1. Calculations for Average Core Metrics
  const unitStats = data.units.map(u => {
    const totalRequired = u.hoursRequired;
    const attended = u.hoursAttended;
    const attPct = totalRequired > 0 ? Math.round((attended / totalRequired) * 100) : 0;
    
    // Calculate average assessment score for this specific unit
    let scoreSum = 0;
    let count = 0;
    u.assessments.forEach(a => {
      scoreSum += a.obtainedScore;
      count++;
    });
    const avgScore = count > 0 ? Math.round(scoreSum / count) : 0;

    return {
      code: u.code,
      name: u.name,
      attendance: attPct,
      gradeAvg: avgScore,
      creditHours: u.creditHours,
    };
  });

  return (
    <div className="space-y-6 font-sans mb-6">
      
      {/* DOUBLE BENTO ROW FOR DATA VISUALIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: ATTENDANCE THRESHOLDS COMPARATOR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-display uppercase tracking-wider">
              <Percent className="h-4.5 w-4.5 text-emerald-500 animate-pulse" /> Unit Attendance vs 75% Threshold
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold font-mono">
              National Examination Criteria
            </span>
          </div>

          <div className="space-y-5">
            {unitStats.map((u, idx) => {
              const isBelowMin = u.attendance < 75;
              const isBelowTarget = u.attendance < 80;
              
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs text-slate-600">
                    <span className="font-semibold text-slate-800 truncate max-w-[240px]">
                      {u.code} — {u.name}
                    </span>
                    <span className={`font-mono font-bold ${isBelowMin ? "text-rose-600 animate-pulse" : isBelowTarget ? "text-amber-600" : "text-emerald-600"}`}>
                      {u.attendance}%
                    </span>
                  </div>

                  {/* CUSTOM GRAPHICAL BAR WITH CDACC CRITICAL REGIONS RENDERED */}
                  <div className="relative w-full h-7 bg-slate-50 border border-slate-150/40 rounded-lg overflow-hidden flex items-center">
                    
                    {/* Critical region indicators */}
                    <div className="absolute left-[75%] top-0 bottom-0 border-l border-dashed border-rose-400 z-10" title="Minimum CDACC Registry Line (75%)" />
                    
                    {/* Comparative Filled value */}
                    <div 
                      className={`h-full opacity-90 transition-all duration-1000 ${
                        isBelowMin 
                          ? "bg-gradient-to-r from-rose-200 to-rose-400/80" 
                          : isBelowTarget 
                          ? "bg-gradient-to-r from-amber-200 to-amber-400/80" 
                          : "bg-gradient-to-r from-emerald-200 to-emerald-400/80"
                      }`}
                      style={{ width: `${u.attendance}%` }}
                    />
                    
                    {/* Inner Label markers */}
                    <span className="absolute left-3 text-[10px] font-mono text-slate-500 z-20">
                      {isBelowMin ? "❌ Trainee status critical" : "✓ Qualified"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span> Below 75% Cutoff
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Above 80% (Safe Zone)
            </span>
          </div>
        </div>

        {/* CHART 2: SCORE GRADE CURVE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-display uppercase tracking-wider">
                <TrendingUp className="h-4.5 w-4.5 text-emerald-500" /> Continuous Assessment Averages
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">
                Level Competency Trend Curve
              </span>
            </div>

            {/* SVG CHORD CHART LINE WAVE */}
            <div className="w-full h-[220px] bg-slate-50 rounded-2xl border border-slate-150/40 p-4 relative flex items-center justify-center">
              
              {/* Overlay threshold guidelines */}
              <div className="absolute top-[50%] left-0 right-0 border-t border-dashed border-slate-200/80" title="Competence Level Requirement (50%)" />
              <div className="absolute top-[20%] left-0 right-0 border-t border-dashed border-slate-250/20" title="High Performance Mark (80%)" />
              
              <span className="absolute left-3 top-[calc(50%+4px)] font-mono text-[9px] text-slate-400 uppercase">
                50% Competency minimum
              </span>

              <span className="absolute left-3 top-[calc(20%+4px)] font-mono text-[9px] text-emerald-600 uppercase">
                80% Distinction
              </span>

              {/* DRAW INTERACTIVE CURVATURE PATHWAY */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                  </linearGradient>
                </defs>

                {/* Path curves dynamically calculated with coordinate maps:
                    Coordinate calculations for 6 default points:
                    X: 30, 110, 190, 270, 350, 430
                    Y (based on score value, inverted since SVG Y=0 is TOP):
                    e.g. Score=65 -> Y = 200 - (65 * 1.8) -> Y = 83
                */}
                <path 
                  d="M 50 110 C 130 90, 170 140, 210 135 C 290 120, 310 70, 450 65" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                  className="transition-all"
                />

                {/* Shading fill */}
                <path 
                  d="M 50 110 C 130 90, 170 140, 210 135 C 290 120, 310 70, 450 65 L 450 200 L 50 200 Z" 
                  fill="url(#chart-glow)" 
                />

                {/* Draw dynamic node circles */}
                {unitStats.map((u, idx) => {
                  const xValues = [50, 130, 210, 290, 370, 450];
                  // Let Y fit: 50% score maps to center-middle Y=100
                  const rawPct = u.gradeAvg;
                  const y = 200 - (rawPct * 1.8); // Scale mapping
                  
                  return (
                    <g key={idx}>
                      <circle 
                        cx={xValues[idx]} 
                        cy={y} 
                        r="5" 
                        className="fill-white stroke-emerald-500 stroke-[3] hover:r-7 hover:cursor-pointer transition-all"
                      />
                      <text 
                        x={xValues[idx]} 
                        y={y - 12} 
                        textAnchor="middle" 
                        className="font-mono text-[9px] font-bold fill-slate-700"
                      >
                        {rawPct}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
            <span className="italic truncate max-w-[280px]">
              Units mapped left-to-right on schedule timeline
            </span>
            <button
              onClick={() => onNavigateToTab("grades")}
              className="text-emerald-600 hover:underline text-[11px] font-semibold flex items-center"
            >
              Analyze Records →
            </button>
          </div>
        </div>

      </div>

      {/* FOOTER RESOURCE SUGGESTION CARD */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center md:text-left">
          <h4 className="text-sm font-bold font-display text-white flex items-center justify-center md:justify-start gap-1.5">
            <GraduationCap className="h-5 w-5 text-emerald-400" /> CDACC Institutional Progress Verifiers
          </h4>
          <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
            Your continuous assessments and Portfolios (PoE) are audited on the 10th academic week of study. In case of falling behind, our integrated CDACC mentor can instantly draft customized remedial study materials.
          </p>
        </div>

        <button
          onClick={() => onNavigateToTab("coach")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition duration-200 cursor-pointer text-center"
        >
          Request AI Competency Guide
        </button>
      </div>

    </div>
  );
}
