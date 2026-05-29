/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { initialCDACCData } from "./initialData.ts";
import { CDACCDashboardData, PoEStatus, CompetenceStatus, AssessmentRecord, Deadline, StudentProfile, AttendanceSession } from "./types.ts";

import Header from "./components/Header.tsx";
import CDACCSummaryCards from "./components/CDACCSummaryCards.tsx";
import GradesManager from "./components/GradesManager.tsx";
import PoETrackView from "./components/PoETrackView.tsx";
import AICoachAdvisor from "./components/AICoachAdvisor.tsx";
import ScheduleReminders from "./components/ScheduleReminders.tsx";
import PerformanceGraphs from "./components/PerformanceGraphs.tsx";
import AttendanceTracker from "./components/AttendanceTracker.tsx";

import { LayoutDashboard, ClipboardCheck, BookOpen, Brain, Clock, Bell, Settings, Info, Sparkles, CheckCircle2, UserCheck } from "lucide-react";

export default function App() {
  // Durable local storage persistence key
  const STORAGE_KEY = "kenya_cdacc_student_data";

  // State: Core Dashboard Data containing student, units list, deadlines schedule
  const [data, setData] = useState<CDACCDashboardData>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error("Failed to parse persisted tracker data, resetting:", e);
      }
    }
    return initialCDACCData;
  });

  // State: Tab navigations
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // State: Communication from Grades lists -> AI Chatbot
  const [preSelectedUnitCode, setPreSelectedUnitCode] = useState<string>("");

  // State: Standard Native alerts enabled state
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission === "granted";
    }
    return false;
  });

  // State: Custom Toast Overlay Reminders queue
  const [activeToasts, setActiveToasts] = useState<{ id: string; title: string; body: string }[]>([]);

  // Safe effect: Persist statistical state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Audio synthesize chime: oscillator-driven audio cue sweep
  const playToastAcousticSweep = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 high chime tone
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      
      osc.start();
      
      // Step frequency up slightly to sound pleasing and happy (D5 -> G5)
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.1); // G5 key
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.55);
      
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn("Audio Context sound synthesized blocker alert:", e);
    }
  };

  // Push Trigger Node: Triggers actual OS alerting if permissable, or beautiful responsive in-app alert sliders as failure safe-mode
  const triggerPushAlert = (title: string, body: string) => {
    // Play acoustic sweep
    playToastAcousticSweep();

    // 1. Trigger Native Web Alert Node if verified
    let nativeTriggered = false;
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "/favicon.ico"
        });
        nativeTriggered = true;
      } catch (err) {
        console.warn("Iframe domain rules restricted native background alert. Defaulted to visual overlay node.", err);
      }
    }

    // 2. Continuous In-App toast overlay backup
    const newToast = {
      id: "toast-" + Math.random().toString(36).substring(2, 9),
      title,
      body,
    };
    setActiveToasts((prev) => [...prev, newToast]);

    // Cleanup after 7 seconds
    setTimeout(() => {
      setActiveToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 7000);
  };

  // Commission handler: Requests desktop browser permissions
  const handleRequestPushAuthority = () => {
    if (!("Notification" in window)) {
      triggerPushAlert(
        "Unsupported Browser Alert",
        "Your current browser does not support standard background alarms. In-app alerts will continue to trigger!"
      );
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        setIsNotificationsEnabled(true);
        triggerPushAlert(
          "✓ OS Permissions Granted!",
          "Excellent! You will now receive actual desktop background alerts for TVET timelines even if you scroll away."
        );
      } else {
        setIsNotificationsEnabled(false);
        triggerPushAlert(
          "Alert Node Blocked",
          "Desktop permission was denied. We will continue demonstrating reminders using our in-app audio chime synthesizer."
        );
      }
    });
  };

  // Action: Add continuous assessment grade record
  const handleAddAssessment = (unitId: string, assessment: AssessmentRecord) => {
    setData((prev) => {
      const nextUnits = prev.units.map((unit) => {
        if (unit.id !== unitId) return unit;

        const updatedAssessments = [...unit.assessments, assessment];
        
        // Calculate updated competence status under dynamic TVET formula:
        // Pass requires 50%+ on continuous tasks. If any task is NYC, standard indicates remediation needed.
        const hasNYC = updatedAssessments.some(a => a.status === CompetenceStatus.NOT_YET_COMPETENT);
        const continuousAvg = updatedAssessments.reduce((acc, curr) => acc + curr.obtainedScore, 0) / updatedAssessments.length;
        
        let unitComp = CompetenceStatus.ONGOING;
        if (updatedAssessments.length >= 2) {
          unitComp = continuousAvg >= 50 && !hasNYC ? CompetenceStatus.COMPETENT : CompetenceStatus.NOT_YET_COMPETENT;
        }

        return {
          ...unit,
          assessments: updatedAssessments,
          competenceStatus: unitComp,
        };
      });

      return {
        ...prev,
        units: nextUnits,
      };
    });

    triggerPushAlert(
      "📝 Grade Registered!",
      `Assessment "${assessment.title}" successfully saved under target course metrics.`
    );
  };

  // Action: Delete continuous assessment record
  const handleDeleteAssessment = (unitId: string, assessmentId: string) => {
    setData((prev) => {
      const nextUnits = prev.units.map((unit) => {
        if (unit.id !== unitId) return unit;

        const updatedAssessments = unit.assessments.filter((a) => a.id !== assessmentId);
        
        // Recalculate status
        const hasNYC = updatedAssessments.some(a => a.status === CompetenceStatus.NOT_YET_COMPETENT);
        const continuousAvg = updatedAssessments.length > 0 
          ? updatedAssessments.reduce((acc, curr) => acc + curr.obtainedScore, 0) / updatedAssessments.length 
          : 0;

        let unitComp = CompetenceStatus.ONGOING;
        if (updatedAssessments.length > 0) {
          unitComp = continuousAvg >= 50 && !hasNYC ? CompetenceStatus.COMPETENT : CompetenceStatus.NOT_YET_COMPETENT;
        }

        return {
          ...unit,
          assessments: updatedAssessments,
          competenceStatus: unitComp,
        };
      });

      return {
        ...prev,
        units: nextUnits,
      };
    });
  };

  // Action: Update unit PoE status when checklists are completed
  const handleUpdatePoEStatus = (unitId: string, status: PoEStatus) => {
    setData((prev) => {
      const nextUnits = prev.units.map((unit) => {
        if (unit.id !== unitId) return unit;
        return {
          ...unit,
          poeStatus: status,
        };
      });
      return {
        ...prev,
        units: nextUnits,
      };
    });

    // Notify student of compilation milestone
    if (status === PoEStatus.CERTIFIED) {
      triggerPushAlert(
        "📂 PoE Certified Milestone!",
        `Congratulations! All mandatory elements in your Unit Dossier have been verified as fully complete.`
      );
    } else if (status === PoEStatus.READY_FOR_ASSESSMENT) {
      triggerPushAlert(
        "🎉 PoE Ready for Verifiers",
        "Your unit portfolio is now configured as ready for External CDACC examination boards."
      );
    }
  };

  // Action: Add new CDACC deadline
  const handleAddDeadline = (deadline: Deadline) => {
    setData((prev) => ({
      ...prev,
      deadlines: [...prev.deadlines, deadline],
    }));
  };

  // Action: Toggle completion check of a timeline milestone
  const handleToggleCompleteDeadline = (deadlineId: string) => {
    setData((prev) => {
      const updatedDeadlines = prev.deadlines.map((dl) => {
        if (dl.id !== deadlineId) return dl;
        const nextState = !dl.completed;
        
        if (nextState) {
          // Play micro sound when student ticks off academic task successfully!
          triggerPushAlert(
            "✓ Milestone Cleared",
            `Great job clearing task: "${dl.title}". Stay persistent!`
          );
        }

        return { ...dl, completed: nextState };
      });

      return {
        ...prev,
        deadlines: updatedDeadlines,
      };
    });
  };

  // Action: Delete custom academic deadline
  const handleDeleteDeadline = (deadlineId: string) => {
    setData((prev) => ({
      ...prev,
      deadlines: prev.deadlines.filter((d) => d.id !== deadlineId),
    }));
  };

  // Communicates: Click from other subpanels triggers AI chatbot scope selection
  const handleSelectUnitForAI = (unitCode: string) => {
    setPreSelectedUnitCode(unitCode);
    setActiveTab("coach");
  };

  // Action: Edit user profile details
  const handleUpdateProfile = (newProfile: StudentProfile) => {
    setData((prev) => ({
      ...prev,
      student: newProfile,
    }));
    triggerPushAlert("Profile Saved ✔", "Student personal information successfully modified details.");
  };

  // Reset helper
  const handleResetAppToDefault = () => {
    if (confirm("Reset application? All your recorded test scores, attendance details and customized milestones will revert to defaults.")) {
      setData(initialCDACCData);
      localStorage.removeItem(STORAGE_KEY);
      triggerPushAlert("System Reverted", "Data restored successfully to baseline Level 6 tracker.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* GLOBAL TOP NAVIGATION RAIL / HEADER BAR */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-emerald-600 rounded-lg text-white font-black text-xs font-mono tracking-widest block shadow-sm shadow-emerald-500/30">
              CDACC
            </span>
            <div>
              <span className="font-display font-bold text-slate-850 text-sm tracking-tight block">
                Kenya Trainee Tracker
              </span>
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold block">
                Continuous Competency Hub
              </span>
            </div>
          </div>

          {/* DESKTOP NAV TABS */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${activeTab === "dashboard" ? "bg-white text-slate-850 shadow-xs" : "text-slate-500 hover:text-slate-850"}`}
            >
              <LayoutDashboard className="h-3.5 w-3.5 inline mr-1 text-slate-500" /> Metrics & Trends
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${activeTab === "attendance" ? "bg-white text-slate-850 shadow-xs" : "text-slate-500 hover:text-slate-850"}`}
            >
              <UserCheck className="h-3.5 w-3.5 inline mr-1 text-slate-500" /> Attendance Ledger
            </button>
            <button
              onClick={() => setActiveTab("grades")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${activeTab === "grades" ? "bg-white text-slate-850 shadow-xs" : "text-slate-500 hover:text-slate-850"}`}
            >
              <ClipboardCheck className="h-3.5 w-3.5 inline mr-1 text-slate-500" /> Syllabus Grades
            </button>
            <button
              onClick={() => setActiveTab("poe")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${activeTab === "poe" ? "bg-white text-slate-850 shadow-xs" : "text-slate-500 hover:text-slate-850"}`}
            >
              <BookOpen className="h-3.5 w-3.5 inline mr-1 text-slate-500" /> Portfolio Binder (PoE)
            </button>
            <button
              onClick={() => setActiveTab("coach")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${activeTab === "coach" ? "bg-white text-slate-850 shadow-xs animate-pulse" : "text-slate-500 hover:text-slate-850"}`}
            >
              <Brain className="h-3.5 w-3.5 inline mr-1 text-emerald-600 fill-emerald-100" /> AI Coach Mentor
            </button>
            <button
              onClick={() => setActiveTab("deadlines")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${activeTab === "deadlines" ? "bg-white text-slate-850 shadow-xs" : "text-slate-500 hover:text-slate-850"}`}
            >
              <Clock className="h-3.5 w-3.5 inline mr-1 text-slate-500" /> Deadline Alarms
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRequestPushAuthority}
              className={`p-2 rounded-xl transition cursor-pointer font-sans text-xs ${isNotificationsEnabled ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
              title={isNotificationsEnabled ? "OS Push Notifications Configured" : "Manage background alerts Settings"}
            >
              <Bell className={`h-4.5 w-4.5 ${isNotificationsEnabled ? "animate-pulse" : ""}`} />
            </button>
            
            <button
              onClick={handleResetAppToDefault}
              className="p-2 bg-slate-105 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Reset configuration defaults"
            >
              <Settings className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE SCROLL TABS BAR (Visible only on mobile) */}
      <div className="sticky top-[53px] bg-slate-900 text-white z-35 flex md:hidden items-center gap-1 overflow-x-auto p-2 border-b border-slate-800 scrollbar-none scrollable">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`shrink-0 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${activeTab === "dashboard" ? "bg-emerald-600 text-white" : "text-slate-400"}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`shrink-0 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${activeTab === "attendance" ? "bg-emerald-600 text-white" : "text-slate-400"}`}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveTab("grades")}
          className={`shrink-0 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${activeTab === "grades" ? "bg-emerald-600 text-white" : "text-slate-400"}`}
        >
          Syllabus & Grades
        </button>
        <button
          onClick={() => setActiveTab("poe")}
          className={`shrink-0 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${activeTab === "poe" ? "bg-emerald-600 text-white" : "text-slate-400"}`}
        >
          Portfolio (PoE)
        </button>
        <button
          onClick={() => setActiveTab("coach")}
          className={`shrink-0 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${activeTab === "coach" ? "bg-emerald-600 text-white" : "text-slate-400"}`}
        >
          AI Coach Advisor
        </button>
        <button
          onClick={() => setActiveTab("deadlines")}
          className={`shrink-0 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${activeTab === "deadlines" ? "bg-emerald-600 text-white" : "text-slate-400"}`}
        >
          Timeline Deadlines
        </button>
      </div>

      {/* CENTRAL COMPONENT BODY */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        
        {/* STUDENT IDENTIFIER & CORE SYSTEM DATETIME */}
        <Header student={data.student} onUpdateProfile={handleUpdateProfile} />

        {/* CORE STATISTICAL ROW CARDS */}
        <CDACCSummaryCards 
          data={data} 
          isNotificationsEnabled={isNotificationsEnabled} 
          onRequestNotificationPermission={handleRequestPushAuthority}
          onNavigateToTab={(tabId) => setActiveTab(tabId)}
        />

        {/* CONDITIONALLY RENDER NAVIGATION TABS */}
        <div className="animate-fade-in">
          {activeTab === "dashboard" && (
            <PerformanceGraphs data={data} onNavigateToTab={(id) => setActiveTab(id)} />
          )}

          {activeTab === "attendance" && (
            <AttendanceTracker
              data={data}
              onUpdateUnits={(updatedUnits) => {
                setData(prev => ({ ...prev, units: updatedUnits }));
              }}
              onUpdateAttendanceLogs={(updatedLogs) => {
                setData(prev => ({ ...prev, attendanceLogs: updatedLogs }));
              }}
              onTriggerInstantPush={triggerPushAlert}
            />
          )}

          {activeTab === "grades" && (
            <GradesManager 
              data={data} 
              onAddAssessment={handleAddAssessment} 
              onDeleteAssessment={handleDeleteAssessment}
              onSelectUnitForAI={handleSelectUnitForAI}
            />
          )}

          {activeTab === "poe" && (
            <PoETrackView 
              data={data} 
              onUpdatePoEStatus={handleUpdatePoEStatus} 
              onSelectUnitForAI={handleSelectUnitForAI}
            />
          )}

          {activeTab === "coach" && (
            <AICoachAdvisor 
              data={data} 
              preSelectedUnitCode={preSelectedUnitCode} 
              onClearPreSelectedUnitCode={() => setPreSelectedUnitCode("")}
            />
          )}

          {activeTab === "deadlines" && (
            <ScheduleReminders 
              data={data}
              isNotificationsEnabled={isNotificationsEnabled}
              onRequestNotificationPermission={handleRequestPushAuthority}
              onAddDeadline={handleAddDeadline}
              onToggleCompleteDeadline={handleToggleCompleteDeadline}
              onDeleteDeadline={handleDeleteDeadline}
              onTriggerInstantPush={triggerPushAlert}
            />
          )}
        </div>

        {/* FOOTER METRICS STYLING */}
        <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-slate-400 text-[10.5px] font-mono uppercase tracking-widest">
          <span>Kabete Polytechnic Registry Center © 2026</span>
          <span className="mx-2">•</span>
          <span>Kenyan TVET CDACC Competency Framework v2.1</span>
        </footer>
      </main>

      {/* FLOATING PUSH TOASTS OVERLAY */}
      <div className="fixed bottom-5 right-5 space-y-3 z-50 w-full max-w-sm px-4">
        {activeToasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-slate-900 border border-slate-800 text-white p-4.5 rounded-2xl shadow-2xl animate-fade-in flex items-start gap-3.5 relative overflow-hidden"
          >
            {/* Left colorful pulse indicator */}
            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-emerald-500 animate-pulse"></div>
            
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0 mt-0.5">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div className="space-y-0.5 select-none">
              <h5 className="text-xs font-bold font-display text-white">{toast.title}</h5>
              <p className="text-[10.5px] leading-relaxed text-slate-300">{toast.body}</p>
            </div>

            <button
              onClick={() => setActiveToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-slate-400 hover:text-white text-xs font-bold py-1 px-1 bg-transparent border-0 cursor-pointer absolute top-3 right-3"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
