/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CDACCDashboardData, UnitOfLearning, AssessmentRecord, CompetenceStatus } from "../types.ts";
import { Plus, Trash2, Edit3, ClipboardList, Filter, BookOpen, AlertCircle, Sparkles, Target, TrendingUp, CheckCircle2, Award } from "lucide-react";

interface GradesManagerProps {
  data: CDACCDashboardData;
  onAddAssessment: (unitId: string, assessment: AssessmentRecord) => void;
  onDeleteAssessment: (unitId: string, assessmentId: string) => void;
  onSelectUnitForAI: (unitCode: string) => void;
}

export default function GradesManager({
  data,
  onAddAssessment,
  onDeleteAssessment,
  onSelectUnitForAI,
}: GradesManagerProps) {
  const [selectedUnitId, setSelectedUnitId] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [targetScore, setTargetScore] = useState<number>(75);
  
  // Form fields
  const [formUnitId, setFormUnitId] = useState<string>(data.units[0]?.id || "");
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<AssessmentRecord["type"]>("CAT");
  const [formScore, setFormScore] = useState<number>(70);
  const [formWeight, setFormWeight] = useState<number>(20);
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [formFeedback, setFormFeedback] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    // Determine competence status under standard Kenyan TVET rule (>= 50% pass)
    const status = formScore >= 50 ? CompetenceStatus.COMPETENT : CompetenceStatus.NOT_YET_COMPETENT;

    const newAssessment: AssessmentRecord = {
      id: "as-add-" + Math.random().toString(36).substring(2, 9),
      title: formTitle,
      type: formType,
      obtainedScore: formScore,
      weight: formWeight,
      date: formDate,
      feedback: formFeedback ? formFeedback : undefined,
      status,
    };

    onAddAssessment(formUnitId, newAssessment);
    
    // Reset form
    setFormTitle("");
    setFormFeedback("");
    setShowAddForm(false);
  };

  const selectedUnit = data.units.find(u => u.id === selectedUnitId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm font-sans mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 id="grades-manager-title" className="text-xl font-bold font-display text-slate-800 tracking-tight flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-emerald-500" /> Continuous Assessments & Grades
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Track CAT marks, practical sheets, and exam marks. Standard TVET CDACC Competency requires 50%+ in each continuous assessment.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Record
        </button>
      </div>

      {/* ADD ASSESSMENT MODAL-STYLE DRAWER */}
      {showAddForm && (
        <form onSubmit={handleFormSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
            <Plus className="h-4 w-4 text-emerald-600" /> Enter New Assessment Grade
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Target Unit</label>
              <select
                value={formUnitId}
                onChange={(e) => setFormUnitId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
              >
                {data.units.map(unit => (
                  <option key={unit.id} value={unit.id}>{unit.code} - {unit.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-600 text-xs font-semibold mb-1">Assessment Theme/Title</label>
              <input
                type="text"
                placeholder="e.g. CAT 1: Subnetting calculations or Portfolio Task B"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Evaluation Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="CAT">Continuous Assessment Test (CAT)</option>
                <option value="Practical Project">Practical Project / Evidence Sheet</option>
                <option value="Continuous Assessment">Classroom Quiz / Portfolio Task</option>
                <option value="Internal Exam">Institution End-Term Mock</option>
                <option value="External Assessment">CDACC National Board Exam</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Obtained Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formScore}
                onChange={(e) => setFormScore(Number(e.target.value))}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Weightage (%)</label>
              <input
                type="number"
                min="5"
                max="100"
                value={formWeight}
                onChange={(e) => setFormWeight(Number(e.target.value))}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-semibold mb-1">Assessment Date</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-600 text-xs font-semibold mb-1">Assessor Comments / Feedback (Optional)</label>
              <input
                type="text"
                placeholder="Teacher's remarks or notes e.g., Passed successfully, Scheduled for corrective reassessment, etc."
                value={formFeedback}
                onChange={(e) => setFormFeedback(e.target.value)}
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
              Save Assessment
            </button>
          </div>
        </form>
      )}

      {/* FILTER CONTROLS */}
      <div className="flex flex-wrap items-center gap-3 mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
        <span className="text-slate-600 text-xs font-semibold flex items-center gap-1">
          <Filter className="h-4.5 w-4.5 text-slate-400" /> Filter by Unit:
        </span>
        <button
          onClick={() => setSelectedUnitId("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition ${selectedUnitId === "all" ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
        >
          All Units
        </button>
        {data.units.map(unit => (
          <button
            key={unit.id}
            onClick={() => setSelectedUnitId(unit.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${selectedUnitId === unit.id ? "bg-emerald-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
          >
            {unit.code}
          </button>
        ))}
      </div>

      {/* TRAINEE PERFORMANCE PROGNOSIS & TARGET OVERRIDE SIMULATOR */}
      {(() => {
        const activeUnitsRef = selectedUnitId === "all" 
          ? data.units 
          : data.units.filter(u => u.id === selectedUnitId);

        const activeAssessmentsRef = activeUnitsRef.flatMap(u => u.assessments);
        
        // Calculate dynamic stats
        const avgScoreRef = activeAssessmentsRef.length > 0
          ? Math.round(activeAssessmentsRef.reduce((sum, a) => sum + a.obtainedScore, 0) / activeAssessmentsRef.length)
          : 0;

        const completedWeightRef = selectedUnitId === "all"
          ? Math.round(data.units.reduce((sum, u) => sum + u.assessments.reduce((w, a) => w + a.weight, 0), 0) / (data.units.length || 1))
          : activeUnitsRef[0]?.assessments.reduce((sum, a) => sum + a.weight, 0) || 0;

        const weightedAccruedRef = selectedUnitId === "all"
          ? Math.round(data.units.reduce((sum, u) => {
              const uCompWeight = u.assessments.reduce((w, a) => w + a.weight, 0);
              if (uCompWeight === 0) return sum;
              const uWeighted = u.assessments.reduce((acc, a) => acc + (a.obtainedScore * (a.weight / 100)), 0);
              return sum + uWeighted;
            }, 0) / (data.units.length || 1))
          : activeUnitsRef[0]?.assessments.reduce((sum, a) => sum + (a.obtainedScore * (a.weight / 100)), 0) || 0;

        const remainingWeightRef = Math.max(0, 100 - completedWeightRef);
        const scoreNeededVal = remainingWeightRef > 0 
          ? ((targetScore - weightedAccruedRef) / (remainingWeightRef / 100)) 
          : 0;
        const requiredFinalScore = Math.max(0, Math.round(scoreNeededVal));

        const totalActiveUnits = data.units.length;
        const totalCompetentUnits = data.units.filter(u => u.competenceStatus === CompetenceStatus.COMPETENT).length;
        const competencyQuotientRef = totalActiveUnits > 0
          ? Math.round((totalCompetentUnits / totalActiveUnits) * 100)
          : 0;

        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 p-5 border border-slate-205 bg-slate-50/40 rounded-2xl border-slate-200">
            
            {/* COLUMN 1: ASPIRATIONS CONTROLLER */}
            <div className="space-y-3.5 pr-0 md:pr-4 md:border-r border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-600 flex items-center gap-1 leading-none mb-1">
                  <Target className="h-3.5 w-3.5" /> Target Override Simulator
                </span>
                <h4 className="text-xs font-bold text-slate-800">Customize Target Marks</h4>
                <p className="text-[10.5px] leading-relaxed text-slate-500 mt-1">
                  Configure custom passing targets to simulate necessary exam scores and competence security.
                </p>
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-600 font-medium">Desired Passing Score</span>
                  <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    {targetScore}%
                  </span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="95"
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  title="Slide to adjust safety target"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>50% (Syllabus Pass)</span>
                  <span>75% (Distinction)</span>
                  <span>95% (Top Honors)</span>
                </div>
              </div>
            </div>

            {/* COLUMN 2: REAL-TIME PROGNOSIS ALGORITHM */}
            <div className="space-y-3.5 pr-0 md:pr-4 md:border-r border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 flex items-center gap-1 leading-none mb-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Predictive Calculations
                </span>
                <h4 className="text-xs font-bold text-slate-800">CDACC Performance Forecast</h4>
                <p className="text-[10.5px] leading-relaxed text-slate-500 mt-1">
                  Scope: <strong>{selectedUnitId === "all" ? "Full Program Syllabus" : activeUnitsRef[0]?.code}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white border border-slate-100 flex flex-col justify-between">
                  {activeAssessmentsRef.length === 0 ? (
                    <span className="text-[11px] text-slate-400 font-medium italic block text-center py-2">
                      Please enter a grade below to generate a real-time forecast.
                    </span>
                  ) : scoreNeededVal <= 0 ? (
                    <div className="space-y-1">
                      <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Target Fully Met!
                      </span>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        Excellent! Your accrued weighted score of <strong>{weightedAccruedRef}%</strong> already clears your desired target of <strong>{targetScore}%</strong> without further assessments!
                      </p>
                    </div>
                  ) : requiredFinalScore <= 100 ? (
                    <div className="space-y-1">
                      <span className="text-slate-705 font-bold text-[11px] flex items-center gap-1 text-slate-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" /> Milestone Highly Achievable
                      </span>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        To hit your <strong>{targetScore}%</strong> target, you require an average score of <strong className="text-emerald-600 font-bold font-mono text-[11px]">{requiredFinalScore}%</strong> across the remaining <strong>{remainingWeightRef}%</strong> of evaluation weight.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-rose-500 font-bold text-[11px] flex items-center gap-1 animate-pulse">
                        <AlertCircle className="h-3.5 w-3.5" /> Target Mathematically Out of Reach
                      </span>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        You need <strong>{requiredFinalScore}%</strong> on remaining work, which is impossible. We highly recommend completing extra corrective remendials to restore qualification options.
                      </p>
                    </div>
                  )}
                </div>

                {/* Micro Weighted Completed Progress layout */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="font-semibold">{completedWeightRef}% Coursework Complete</span>
                    <span className="font-mono">{remainingWeightRef}% Exams weight remaining</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${completedWeightRef}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: COMPREHENSIVE CDACC STAT MODULES */}
            <div className="space-y-3.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-600 flex items-center gap-1 leading-none mb-1">
                  <Award className="h-3.5 w-3.5" /> TRAINEE PORTFOLIO INDEX
                </span>
                <h4 className="text-xs font-bold text-slate-800">Competency Quotient Gauge</h4>
                <p className="text-[10.5px] leading-relaxed text-slate-500 mt-1">
                  Audit summary of all trade learning outcomes registered in the database.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-1">
                <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                  <span className="text-[8.5px] uppercase font-semibold text-slate-400 font-mono block">Competence index</span>
                  <span className="text-base font-black font-display text-slate-800 tracking-tight block">
                    {competencyQuotientRef}%
                  </span>
                  <span className="text-[9.5px] text-slate-400 mt-0.5 block leading-none">
                    {totalCompetentUnits} / {totalActiveUnits} Competent
                  </span>
                </div>

                <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                  <span className="text-[8.5px] uppercase font-semibold text-slate-400 font-mono block">GPA Quotient</span>
                  <span className="text-base font-black font-display text-slate-800 tracking-tight block">
                    {avgScoreRef > 0 ? (avgScoreRef / 20).toFixed(2) : "0.00"}
                  </span>
                  <span className="text-[9.5px] text-slate-400 mt-0.5 block leading-none font-mono">
                    Scale 5.0 (CBET)
                  </span>
                </div>
              </div>

            </div>

          </div>
        );
      })()}

      {/* TABLE/LIST RENDER */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl">
        <table className="w-full border-collapse text-left text-xs text-slate-600">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-mono tracking-wider">
              <th className="px-5 py-3">Unit Code</th>
              <th className="px-5 py-3">Assessment Title & Type</th>
              <th className="px-5 py-3 text-center">Score</th>
              <th className="px-5 py-3 text-center">Weight</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Assessor Remarks</th>
              <th className="px-5 py-3 text-center">Outcome</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.units
              .filter(u => selectedUnitId === "all" || u.id === selectedUnitId)
              .flatMap(unit => 
                unit.assessments.map(record => ({
                  unitCode: unit.code,
                  unitId: unit.id,
                  unitName: unit.name,
                  ...record
                }))
              )
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-5 py-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                    {item.unitCode}
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <div className="font-semibold text-slate-800">{item.title}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">{item.type}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center font-mono font-bold">
                    <span className={item.obtainedScore >= 50 ? "text-emerald-600" : "text-rose-600"}>
                      {item.obtainedScore}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center font-mono text-slate-500">
                    {item.weight}%
                  </td>
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString("en-KE", { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 max-w-xs text-slate-500 italic truncate" title={item.feedback || "No comments"}>
                    {item.feedback || "—"}
                  </td>
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.obtainedScore >= 50 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                      {item.obtainedScore >= 50 ? "Competent" : "NYC"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {item.obtainedScore < 50 && (
                        <button
                          onClick={() => onSelectUnitForAI(item.unitCode)}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                          title="Ask AI Mentor for remediation coaching"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteAssessment(item.unitId, item.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            }
            {data.units
              .filter(u => selectedUnitId === "all" || u.id === selectedUnitId)
              .flatMap(u => u.assessments).length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2 animate-bounce" />
                    No continuous assessments recorded. Click "Add Record" to log some marks.
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* COMPETENCY GUIDANCE CARD */}
      <div className="mt-5 bg-emerald-50/50 border border-emerald-100/60 rounded-2xl p-4 flex items-start gap-3">
        <BookOpen className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-emerald-900">Kenyan TVET CDACC Grading Standard Checklist</h4>
          <p className="text-emerald-800 text-xs leading-relaxed">
            Unlike universities, TVET assessments are purely criterion-referenced. If a student is graded "Not Yet Competent" (NYC) on a continuous assessment (less than 50%), they can submit another piece of evidence or request a reassessment. Use the 
            <strong className="text-emerald-900 cursor-pointer hover:underline pl-1" onClick={() => onSelectUnitForAI(selectedUnit?.code || "general")}>
               AI Coach <Sparkles className="h-3 w-3 inline text-amber-500 fill-amber-500 animate-pulse" />
            </strong> to get custom practice problems and detailed explanations to prepare!
          </p>
        </div>
      </div>
    </div>
  );
}
