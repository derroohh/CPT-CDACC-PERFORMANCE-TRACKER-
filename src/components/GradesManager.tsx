/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CDACCDashboardData, UnitOfLearning, AssessmentRecord, CompetenceStatus } from "../types.ts";
import { Plus, Trash2, Edit3, ClipboardList, Filter, BookOpen, AlertCircle, Sparkles } from "lucide-react";

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
