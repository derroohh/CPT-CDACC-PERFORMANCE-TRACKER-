/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CDACCDashboardData, UnitOfLearning, PoEStatus } from "../types.ts";
import { BookOpen, FolderCheck, CheckSquare, Square, ShieldCheck, HelpCircle, ArrowRight, Save } from "lucide-react";

interface PoETrackViewProps {
  data: CDACCDashboardData;
  onUpdatePoEStatus: (unitId: string, status: PoEStatus) => void;
  onSelectUnitForAI: (unitCode: string) => void;
}

export default function PoETrackView({
  data,
  onUpdatePoEStatus,
  onSelectUnitForAI,
}: PoETrackViewProps) {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(data.units[0]?.id || "");
  
  // Create an internal state representing checklists for all units.
  // We can base these on a secure mock state backed by LocalStorage, but to offer immediate, real interaction:
  // We will initialize checkboxes state, mapping each unit. Each unit gets 4 essential items:
  // Item 1: Signed Unit Descriptor
  // Item 2: Verifiable CAT Script Scripts
  // Item 3: Signed Assessor Record (F4 Form)
  // Item 4: Student Evidence Journal & Photos
  const [checklists, setChecklists] = useState<Record<string, boolean[]>>(() => {
    // Pre-populate realistic states based on current poeStatus:
    const initialChecklistState: Record<string, boolean[]> = {};
    data.units.forEach((u) => {
      if (u.poeStatus === PoEStatus.CERTIFIED) {
        initialChecklistState[u.id] = [true, true, true, true];
      } else if (u.poeStatus === PoEStatus.READY_FOR_ASSESSMENT) {
        initialChecklistState[u.id] = [true, true, true, false];
      } else if (u.poeStatus === PoEStatus.IN_PROGRESS) {
        initialChecklistState[u.id] = [true, true, false, false];
      } else {
        initialChecklistState[u.id] = [false, false, false, false];
      }
    });
    return initialChecklistState;
  });

  const handleToggleCheck = (unitId: string, index: number) => {
    const updatedChecks = [...(checklists[unitId] || [false, false, false, false])];
    updatedChecks[index] = !updatedChecks[index];
    
    const nextChecklists = { ...checklists, [unitId]: updatedChecks };
    setChecklists(nextChecklists);

    // Dynamic auto-upgrading of Unit Status based on checklist completion!
    const trueCount = updatedChecks.filter(Boolean).length;
    let nextStatus = PoEStatus.NOT_STARTED;
    if (trueCount === 4) {
      nextStatus = PoEStatus.CERTIFIED;
    } else if (trueCount === 3) {
      nextStatus = PoEStatus.READY_FOR_ASSESSMENT;
    } else if (trueCount > 0) {
      nextStatus = PoEStatus.IN_PROGRESS;
    }

    onUpdatePoEStatus(unitId, nextStatus);
  };

  const selectedUnit = data.units.find((u) => u.id === selectedUnitId) || data.units[0];
  const selectedChecks = checklists[selectedUnit?.id] || [false, false, false, false];
  const completedCount = selectedChecks.filter(Boolean).length;
  const progressPct = Math.round((completedCount / 4) * 100);

  const checklistDescriptions = [
    {
      title: "Course Register & Unit Descriptor Signature",
      desc: "Trainee-signed introductory checklist confirming study objectives and hours of engagement are fully understood.",
    },
    {
      title: "Verifiable CAT Sheets (Signed by Assessor)",
      desc: "Institution-verified scripts for CAT 1 and CAT 2 displaying grades above 50% threshold for registration eligibility.",
    },
    {
      title: "CDACC F4 Record Form (Signed Assessor Log)",
      desc: "Official assessor confirmation of competencies logged during lab activities, checked by internal verifiers.",
    },
    {
      title: "Practical Evidence Report / Photos of Deliverables",
      desc: "Student portfolio items including code screenshots, wiring designs, configuration tables, or structural logs.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans mb-6">
      
      {/* LEFT COLUMN: UNITS LIST BINDER TABS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5 font-display uppercase tracking-tight">
          <BookOpen className="h-4 w-4 text-emerald-600" /> Units portfolios
        </h3>

        <div className="space-y-2.5">
          {data.units.map((unit) => {
            const unitProgress = checklists[unit.id] || [false, false, false, false];
            const itemsDone = unitProgress.filter(Boolean).length;
            
            return (
              <button
                key={unit.id}
                onClick={() => setSelectedUnitId(unit.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  selectedUnitId === unit.id
                    ? "bg-emerald-50/70 border-emerald-500 text-emerald-900 shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-300 text-slate-700"
                }`}
              >
                <div className="space-y-1 truncate mr-2">
                  <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-500">
                    {unit.code}
                  </div>
                  <div className="text-xs font-semibold truncate">
                    {unit.name}
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase mb-1.5 ${
                    unit.poeStatus === PoEStatus.CERTIFIED
                      ? "bg-emerald-100/80 text-emerald-800"
                      : unit.poeStatus === PoEStatus.READY_FOR_ASSESSMENT
                      ? "bg-indigo-100/80 text-indigo-800"
                      : unit.poeStatus === PoEStatus.IN_PROGRESS
                      ? "bg-amber-100/80 text-amber-800"
                      : "bg-slate-100/80 text-slate-500"
                  }`}>
                    {unit.poeStatus}
                  </span>
                  <div className="text-[9px] text-slate-400 font-mono font-semibold">
                    {itemsDone}/4 Done
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: DETAILED CHECKLIST FOR SELECTED PORTFOLIO BINDER */}
      <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        {selectedUnit ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-5 gap-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase">
                  {selectedUnit.code}
                </span>
                <h3 className="text-lg font-bold font-display text-slate-800 tracking-tight mt-1.5">
                  {selectedUnit.name}
                </h3>
              </div>

              <div className="text-right sm:text-right">
                <div className="text-xs text-slate-400">PoE Binder Completion</div>
                <div className="text-2xl font-black text-slate-800 font-mono tracking-tight mt-0.5">
                  {progressPct}%
                </div>
              </div>
            </div>

            {/* BINDER PROGRESS INDICATOR */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150/40 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FolderCheck className="h-9 w-9 text-emerald-500 bg-emerald-50 p-1.5 rounded-xl" />
                <div>
                  <div className="text-xs font-bold text-slate-700">Competency Dossier Status</div>
                  <div className="text-[11px] text-slate-500">
                    Currently classed as <span className="font-bold text-emerald-600">{selectedUnit.poeStatus}</span> based on items.
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectUnitForAI(selectedUnit.code)}
                className="bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
              >
                Verify with Coach <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* CHECKLIST CHECKPOINTS */}
            <div className="space-y-4">
              {checklistDescriptions.map((item, idx) => {
                const checked = selectedChecks[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleCheck(selectedUnit.id, idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                      checked
                        ? "bg-slate-50/40 border-slate-200"
                        : "bg-white border-slate-150 hover:bg-slate-50/20"
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 bg-transparent border-0 cursor-pointer text-emerald-600 shrink-0"
                    >
                      {checked ? (
                        <CheckSquare className="h-5.5 w-5.5 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Square className="h-5.5 w-5.5 text-slate-300" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className={`text-xs font-semibold ${checked ? "text-slate-500 line-through" : "text-slate-800"}`}>
                        {item.title}
                      </div>
                      <p className="text-slate-400 text-[10.5px] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-12">
            Select a Unit of Learning on the left to review its continuous assessments evidence portfolio.
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Internal Verification Ready
          </span>
          <span>CDACC Section F (Rules of Evidence) compliant</span>
        </div>
      </div>

    </div>
  );
}
