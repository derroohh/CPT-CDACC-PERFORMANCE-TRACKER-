/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { initialCDACCData } from "./initialData.ts";
import { CDACCDashboardData, PoEStatus, CompetenceStatus, AssessmentRecord, Deadline, StudentProfile, AttendanceSession, UnitOfLearning } from "./types.ts";

import DashboardOverview from "./components/DashboardOverview.tsx";
import GradesManager from "./components/GradesManager.tsx";
import PoETrackView from "./components/PoETrackView.tsx";
import AICoachAdvisor from "./components/AICoachAdvisor.tsx";
import ScheduleReminders from "./components/ScheduleReminders.tsx";
import AttendanceTracker from "./components/AttendanceTracker.tsx";
import Sidebar from "./components/Sidebar.tsx";
import AuthModal from "./components/AuthModal.tsx";

import { 
  auth, 
  db, 
  isFirebaseConfigured, 
  handleFirestoreError, 
  OperationType 
} from "./firebase.ts";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  collection, 
  deleteDoc 
} from "firebase/firestore";

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

  // State: Collapsible and responsive Sidebar navigation panels
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);

  // State: Connected Firebase context authenticated user
  const [user, setUser] = useState<User | null>(null);

  // State: Controls email/password registration and sign-in modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Auth Hook: Setup connection listeners
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        checkAndMigrate(currentUser);
      } else {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          try {
            setData(JSON.parse(raw));
          } catch (e) {
            setData(initialCDACCData);
          }
        } else {
          setData(initialCDACCData);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync Hook: Synchronize dynamic Cloud collections into React state in real-time
  useEffect(() => {
    if (!db || !user) return;

    // 1. Listen to Student Profile document
    const unsubProfile = onSnapshot(doc(db, 'students', user.uid), (docSn) => {
      if (docSn.exists()) {
        const studentProfile = docSn.data() as StudentProfile;
        setData(prev => ({ ...prev, student: studentProfile }));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, `students/${user.uid}`));

    // 2. Listen to Learning Units Collection
    const unsubUnits = onSnapshot(collection(db, 'students', user.uid, 'units'), (snap) => {
      if (!snap.empty) {
        const list: UnitOfLearning[] = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data() as UnitOfLearning);
        });
        list.sort((a, b) => a.code.localeCompare(b.code));
        setData(prev => ({ ...prev, units: list }));
      }
    }, (err) => handleFirestoreError(err, OperationType.LIST, `students/${user.uid}/units`));

    // 3. Listen to Deadlines milestones
    const unsubDeadlines = onSnapshot(collection(db, 'students', user.uid, 'deadlines'), (snap) => {
      const list: Deadline[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as Deadline);
      });
      setData(prev => ({ ...prev, deadlines: list }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, `students/${user.uid}/deadlines`));

    // 4. Listen to Class Attendance Ledger
    const unsubAttendance = onSnapshot(collection(db, 'students', user.uid, 'attendanceLogs'), (snap) => {
      const list: AttendanceSession[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as AttendanceSession);
      });
      setData(prev => ({ ...prev, attendanceLogs: list }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, `students/${user.uid}/attendanceLogs`));

    return () => {
      unsubProfile();
      unsubUnits();
      unsubDeadlines();
      unsubAttendance();
    };
  }, [user]);

  // Sync and Migration task
  const checkAndMigrate = async (currentUser: User) => {
    if (!db) return;
    const studentRef = doc(db, 'students', currentUser.uid);
    try {
      const snap = await getDoc(studentRef);
      if (!snap.exists()) {
        triggerPushAlert(
          "🚀 Syncing Cloud Database", 
          "Setting up your live CDACC database and moving local logs to Firestore."
        );
        
        // Save profile
        const newStudentPr = {
          ...data.student,
          name: currentUser.displayName || data.student.name,
          email: currentUser.email || data.student.email || "",
        };
        await setDoc(studentRef, newStudentPr);

        // Batch upload learning units
        for (const unit of data.units) {
          await setDoc(doc(db, 'students', currentUser.uid, 'units', unit.id), unit);
        }

        // Batch upload deadlines
        for (const deadline of data.deadlines) {
          await setDoc(doc(db, 'students', currentUser.uid, 'deadlines', deadline.id), deadline);
        }

        // Batch upload attendance logs
        if (data.attendanceLogs) {
          for (const log of data.attendanceLogs) {
            await setDoc(doc(db, 'students', currentUser.uid, 'attendanceLogs', log.id), log);
          }
        }

        triggerPushAlert("✓ Database Configured", "Trainee progress synced. Online cloud mode active!");
      } else {
        triggerPushAlert("✓ Welcome Back", "Loaded encrypted student registry records from Firestore database.");
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `students/${currentUser.uid}`);
    }
  };

  // Safe effect: Persist statistical state changes to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, user]);

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
  // Action: Add continuous assessment grade record
  const handleAddAssessment = async (unitId: string, assessment: AssessmentRecord) => {
    let nextUnits: UnitOfLearning[] = [];
    setData((prev) => {
      nextUnits = prev.units.map((unit) => {
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

    if (user && db) {
      const targetUnit = nextUnits.find(u => u.id === unitId);
      if (targetUnit) {
        try {
          await setDoc(doc(db, 'students', user.uid, 'units', unitId), targetUnit);
        } catch (e) {
          handleFirestoreError(e, OperationType.UPDATE, `students/${user.uid}/units/${unitId}`);
        }
      }
    }
  };

  // Action: Delete continuous assessment record
  const handleDeleteAssessment = async (unitId: string, assessmentId: string) => {
    let nextUnits: UnitOfLearning[] = [];
    setData((prev) => {
      nextUnits = prev.units.map((unit) => {
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

    if (user && db) {
      const targetUnit = nextUnits.find(u => u.id === unitId);
      if (targetUnit) {
        try {
          await setDoc(doc(db, 'students', user.uid, 'units', unitId), targetUnit);
        } catch (e) {
          handleFirestoreError(e, OperationType.UPDATE, `students/${user.uid}/units/${unitId}`);
        }
      }
    }
  };

  // Action: Update unit PoE status when checklists are completed
  const handleUpdatePoEStatus = async (unitId: string, status: PoEStatus) => {
    let nextUnits: UnitOfLearning[] = [];
    setData((prev) => {
      nextUnits = prev.units.map((unit) => {
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

    if (user && db) {
      const targetUnit = nextUnits.find(u => u.id === unitId);
      if (targetUnit) {
        try {
          await setDoc(doc(db, 'students', user.uid, 'units', unitId), targetUnit);
        } catch (e) {
          handleFirestoreError(e, OperationType.UPDATE, `students/${user.uid}/units/${unitId}`);
        }
      }
    }
  };

  // Action: Add new CDACC deadline
  const handleAddDeadline = async (deadline: Deadline) => {
    setData((prev) => ({
      ...prev,
      deadlines: [...prev.deadlines, deadline],
    }));

    if (user && db) {
      try {
        await setDoc(doc(db, 'students', user.uid, 'deadlines', deadline.id), deadline);
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, `students/${user.uid}/deadlines/${deadline.id}`);
      }
    }
  };

  // Action: Toggle completion check of a timeline milestone
  const handleToggleCompleteDeadline = async (deadlineId: string) => {
    let targetDl: Deadline | undefined;
    setData((prev) => {
      const updatedDeadlines = prev.deadlines.map((dl) => {
        if (dl.id !== deadlineId) return dl;
        const nextState = !dl.completed;
        
        if (nextState) {
          triggerPushAlert(
            "✓ Milestone Cleared",
            `Great job clearing task: "${dl.title}". Stay persistent!`
          );
        }
        targetDl = { ...dl, completed: nextState };
        return targetDl;
      });

      return {
        ...prev,
        deadlines: updatedDeadlines,
      };
    });

    if (user && db && targetDl) {
      try {
        await setDoc(doc(db, 'students', user.uid, 'deadlines', deadlineId), targetDl);
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `students/${user.uid}/deadlines/${deadlineId}`);
      }
    }
  };

  // Action: Delete custom academic deadline
  const handleDeleteDeadline = async (deadlineId: string) => {
    setData((prev) => ({
      ...prev,
      deadlines: prev.deadlines.filter((d) => d.id !== deadlineId),
    }));

    if (user && db) {
      try {
        await deleteDoc(doc(db, 'students', user.uid, 'deadlines', deadlineId));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `students/${user.uid}/deadlines/${deadlineId}`);
      }
    }
  };

  // Communicates: Click from other subpanels triggers AI chatbot scope selection
  const handleSelectUnitForAI = (unitCode: string) => {
    setPreSelectedUnitCode(unitCode);
    setActiveTab("coach");
  };

  // Action: Edit user profile details
  const handleUpdateProfile = async (newProfile: StudentProfile) => {
    setData((prev) => ({
      ...prev,
      student: newProfile,
    }));
    triggerPushAlert("Profile Saved ✔", "Student personal information successfully modified details.");

    if (user && db) {
      try {
        await setDoc(doc(db, 'students', user.uid), newProfile);
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `students/${user.uid}`);
      }
    }
  };

  // Reset helper
  const handleResetAppToDefault = async () => {
    if (confirm("Reset application? All your recorded test scores, attendance details and customized milestones will revert to defaults.")) {
      setData(initialCDACCData);
      localStorage.removeItem(STORAGE_KEY);
      triggerPushAlert("System Reverted", "Data restored successfully to baseline Level 6 tracker.");

      if (user && db) {
        try {
          await setDoc(doc(db, 'students', user.uid), initialCDACCData.student);
          for (const u of initialCDACCData.units) {
            await setDoc(doc(db, 'students', user.uid, 'units', u.id), u);
          }
        } catch (e) {
          console.error("Reseed failed:", e);
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured || !auth) {
      triggerPushAlert("Local Simulator", "Please run set_up_firebase to register database storage credentials.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      triggerPushAlert("Auth Locked", "Unable to complete Google Authentication.");
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
      setData(initialCDACCData);
      localStorage.removeItem(STORAGE_KEY);
      triggerPushAlert("Session Ended", "Disconnected Cloud database. Local temporary sandbox is working.");
    } catch (error) {
      console.error("Auth sign out error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* SIDEBAR NAVIGATION CONTROLLER */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        student={data.student}
        isFirebaseConfigured={isFirebaseConfigured}
        user={user}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleSignOut}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isOpenMobile={isSidebarOpenMobile}
        onToggleMobile={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
      />

      {/* RIGHT SIDE MAIN SCROLLABLE CONTENT BLOCK */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* UPPER ACTION / TOGGLE HEADER PIECE */}
        <header className="hidden md:flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-555 animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-slate-400 font-extrabold uppercase">
              Kenya CDACC Tracker (CBET Framework Compliant)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRequestPushAuthority}
              className={`p-2 rounded-xl transition cursor-pointer font-sans text-xs ${isNotificationsEnabled ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
              title={isNotificationsEnabled ? "OS Push Notifications Configured" : "Manage background alerts Settings"}
            >
              <Bell className={`h-4 w-4 ${isNotificationsEnabled ? "animate-pulse" : ""}`} />
            </button>
            
            <button
              onClick={handleResetAppToDefault}
              className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              title="Reset configuration defaults"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* CENTRAL CONTAINER */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
          
          {/* DYNAMIC BREADCRUMB PAGE TITLE HEADER - ONLY IF NOT ON DASHBOARD */}
          {activeTab !== "dashboard" && (
            <div className="bg-white border border-slate-200 rounded-2xl py-3.5 px-5 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans animate-fade-in">
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono font-bold tracking-wider uppercase mb-1">
                  <span>Kenya TVET Hub</span>
                  <span>/</span>
                  <span className="text-emerald-600">{activeTab}</span>
                </div>
                <h2 className="text-lg font-bold font-display text-slate-800 tracking-tight capitalize leading-none">
                  {activeTab === "attendance" && "Attendance Ledger Tracker"}
                  {activeTab === "grades" && "Syllabus Contents & Course Grades"}
                  {activeTab === "poe" && "Evidence Portfolio Binder (PoE)"}
                  {activeTab === "coach" && "AI Study Coach & Advisory Board"}
                  {activeTab === "deadlines" && "Assessments & Exam Deadlines"}
                </h2>
              </div>

              {/* Mini Interactive Profile Bubble to click back */}
              <div 
                onClick={() => setActiveTab("dashboard")}
                className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/85 px-3 py-1.5 rounded-xl cursor-pointer transition-colors max-w-fit shrink-0 select-none group"
                title="Click to return to main student dashboard overview"
              >
                <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[11px] font-mono leading-none overflow-hidden shrink-0 group-hover:scale-102 transition-transform">
                  {data.student.photoUrl ? (
                    <img src={data.student.photoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    data.student.name.substring(0, 2)
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-805 block max-w-[120px] truncate leading-none">
                    {data.student.name}
                  </span>
                  <span className="text-[9px] font-mono font-medium text-slate-400 block tracking-wider uppercase mt-1 leading-none">
                    Adm: {data.student.admissionNo}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CONDITIONALLY RENDER NAVIGATION TABS */}
          <div className="animate-fade-in">
            {activeTab === "dashboard" && (
              <DashboardOverview
                data={data}
                isNotificationsEnabled={isNotificationsEnabled}
                onRequestNotificationPermission={handleRequestPushAuthority}
                onNavigateToTab={setActiveTab}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {activeTab === "attendance" && (
              <AttendanceTracker
                data={data}
                onUpdateUnits={async (updatedUnits) => {
                  setData(prev => ({ ...prev, units: updatedUnits }));
                  if (user && db) {
                    for (const unit of updatedUnits) {
                      try {
                        await setDoc(doc(db, 'students', user.uid, 'units', unit.id), unit);
                      } catch (e) {
                        handleFirestoreError(e, OperationType.UPDATE, `students/${user.uid}/units/${unit.id}`);
                      }
                    }
                  }
                }}
                onUpdateAttendanceLogs={async (updatedLogs) => {
                  setData(prev => ({ ...prev, attendanceLogs: updatedLogs }));
                  if (user && db) {
                    const existingLogs = data.attendanceLogs || [];
                    if (updatedLogs.length > existingLogs.length) {
                      const added = updatedLogs.find(l => !existingLogs.some(el => el.id === l.id));
                      if (added) {
                        try {
                          await setDoc(doc(db, 'students', user.uid, 'attendanceLogs', added.id), added);
                        } catch (e) {
                          handleFirestoreError(e, OperationType.CREATE, `students/${user.uid}/attendanceLogs/${added.id}`);
                        }
                      }
                    } else if (updatedLogs.length < existingLogs.length) {
                      const deleted = existingLogs.find(el => !updatedLogs.some(l => l.id === el.id));
                      if (deleted) {
                        try {
                          await deleteDoc(doc(db, 'students', user.uid, 'attendanceLogs', deleted.id));
                        } catch (e) {
                          handleFirestoreError(e, OperationType.DELETE, `students/${user.uid}/attendanceLogs/${deleted.id}`);
                        }
                      }
                    }
                  }
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
            <span>Derrick Ngure | CPT(CDACC PEFORMANCE TRACKER)2026 ©</span>
          </footer>
        </main>
      </div>

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

            <div className="space-y-0.5 select-none font-sans">
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

      {/* AUTHENTICATION OVERLAY */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onGoogleLogin={handleGoogleSignIn}
        onNotification={triggerPushAlert}
      />


    </div>
  );
}
