/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { StudentProfile } from "../types.ts";
import { 
  LayoutDashboard, 
  UserCheck, 
  ClipboardCheck, 
  BookOpen, 
  Brain, 
  Clock, 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  Database, 
  LogOut, 
  LogIn, 
  Menu,
  Sparkles,
  Award
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  student: StudentProfile;
  isFirebaseConfigured: boolean;
  user: any | null;                 // Authenticated user if available
  onLogin: () => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
}

export default function Sidebar({
  activeTab,
  onSelectTab,
  student,
  isFirebaseConfigured,
  user,
  onLogin,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isOpenMobile,
  onToggleMobile,
}: SidebarProps) {

  const navItems = [
    { id: "dashboard", label: "Metrics & Trends", icon: LayoutDashboard },
    { id: "attendance", label: "Attendance Ledger", icon: UserCheck },
    { id: "grades", label: "Syllabus Grades", icon: ClipboardCheck },
    { id: "poe", label: "Portfolio Binder (PoE)", icon: BookOpen },
    { id: "coach", label: "AI Coach Mentor", icon: Brain, badge: "AI" },
    { id: "deadlines", label: "Deadline Alarms", icon: Clock },
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    if (isOpenMobile) {
      onToggleMobile();
    }
  };

  return (
    <>
      {/* MOBILE HEADER BUTTON BAR (STAY STICKY TO TOP FOR EASY DRAWER OPENING ON PHONES) */}
      <div className="md:hidden sticky top-0 bg-slate-900 text-white z-40 px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-sm leading-none">
        <button
          onClick={onToggleMobile}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition duration-150 cursor-pointer"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-emerald-600 rounded text-[10px] font-mono font-black tracking-wider uppercase">
            CDACC
          </span>
          <span className="font-display font-medium text-xs text-slate-100 uppercase tracking-wide">
            Trainee Tracker
          </span>
        </div>

        {/* Dynamic connection indicator on mobile */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <span className={`h-2.5 w-2.5 rounded-full ${isFirebaseConfigured && user ? "bg-emerald-500 animate-pulse" : isFirebaseConfigured ? "bg-blue-400" : "bg-amber-400"}`}></span>
          <span className="text-slate-400">
            {isFirebaseConfigured && user ? "Live Sync" : isFirebaseConfigured ? "Ready" : "Local"}
          </span>
        </div>
      </div>

      {/* BACKDROP SCRIM FOR MOBILE DRAWER */}
      {isOpenMobile && (
        <div 
          onClick={onToggleMobile} 
          className="md:hidden fixed inset-0 bg-black/45 backdrop-blur-xs z-45"
        />
      )}

      {/* CORE SIDEBAR DOCK / CONTAINER */}
      <aside 
        className={`fixed md:sticky top-0 left-0 bottom-0 bg-slate-900 text-slate-100 z-50 h-screen transition-all duration-300 flex flex-col justify-between border-r border-slate-800/80 shadow-2xl md:shadow-none
          ${isOpenMobile ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-20" : "md:w-64"}
        `}
      >
        
        {/* UPPER BRANDING COLUMN */}
        <div>
          <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
            
            {/* Logo, text pairing */}
            <div className={`flex items-center gap-3 transition-opacity duration-300 ${isCollapsed ? "md:opacity-0 md:w-0 overflow-hidden" : "opacity-100"}`}>
              <div className="p-1.5 bg-emerald-600 rounded-lg text-white font-black text-xs font-mono tracking-widest block shadow-sm shadow-emerald-500/30">
                CDACC
              </div>
              <div>
                <span className="font-display font-bold text-white text-[13px] tracking-tight block">
                  Kenya Trainee Hub
                </span>
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 font-bold block">
                  Continuous Registry
                </span>
              </div>
            </div>

            {/* Collapsed logo marker */}
            {isCollapsed && (
              <div className="hidden md:flex mx-auto p-1.5 bg-emerald-600 rounded-lg text-white font-black text-xs font-mono tracking-normal shadow-xs">
                CDACC
              </div>
            )}

            {/* Toggle Arrow (Hidden on mobile slider) */}
            <button
              onClick={onToggleCollapse}
              className="hidden md:block p-1 bg-slate-800 hover:bg-slate-700 hover:text-emerald-400 border border-slate-700 rounded-lg text-slate-400 cursor-pointer transition duration-150"
              title={isCollapsed ? "Expand panel" : "Collapse panel"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* ACTIVE STUDENT MINI DISPLAY CARD */}
          <div className={`p-4 bg-slate-950/20 border-b border-slate-800/40 ${isCollapsed ? "md:px-2 text-center" : ""}`}>
            {isCollapsed ? (
              <div className="relative inline-block group cursor-pointer">
                <div className="h-10 w-10 rounded-full border border-slate-800 bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs uppercase overflow-hidden mx-auto">
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    student.name.substring(0, 2)
                  )}
                </div>
                {/* Micro hovering popover tooltip */}
                <span className="absolute left-12 top-2 bg-slate-900 border border-slate-800 text-white font-sans text-[10.5px] px-2.5 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                  {student.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full border-2 border-emerald-500/20 bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs uppercase overflow-hidden shrink-0">
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    student.name.substring(0, 2)
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-slate-200 text-xs font-bold leading-tight truncate block">
                    {student.name}
                  </span>
                  <span className="text-slate-500 text-[10px] font-mono block truncate">
                    Adm: {student.admissionNo}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Award className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span className="text-[9px] text-emerald-400 font-semibold tracking-wide truncate">
                      L6 Engineering
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC LIST OF NAV SYSTEM PAGES */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isSelected = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center transition ease-in-out cursor-pointer rounded-xl text-left py-2.5 px-3.5 text-xs font-semibold group relative gap-3.5
                    ${isSelected 
                      ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/10" 
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                    }
                    ${isCollapsed ? "md:justify-center md:px-2" : ""}
                  `}
                >
                  <IconComp className={`h-4.5 w-4.5 shrink-0 ${isSelected ? "text-white" : "text-slate-400 group-hover:text-emerald-400"}`} />
                  
                  {/* Item Text labels */}
                  <span className={`transition-opacity duration-200 truncate ${isCollapsed ? "md:hidden" : "opacity-100"}`}>
                    {item.label}
                  </span>

                  {/* AI Badge indicators */}
                  {item.badge && !isCollapsed && (
                    <span className="ml-auto bg-emerald-500/10 text-emerald-400 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded font-mono uppercase shrink-0">
                      {item.badge}
                    </span>
                  )}

                  {/* Hovering tooltips for collapsed icons */}
                  {isCollapsed && (
                    <span className="hidden md:block absolute left-14 bg-slate-950 border border-slate-800 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-50">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* LOWER DATABASE STORAGE ENGINE CONTROLS */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/25">
          {isCollapsed ? (
            <div className="text-center">
              <button
                onClick={user ? onLogout : onLogin}
                className={`p-2 rounded-xl border cursor-pointer transition ${
                  user 
                    ? "bg-slate-800 hover:bg-rose-550 hover:border-rose-400 hover:text-rose-100 text-slate-400 border-slate-700" 
                    : "bg-emerald-555 border-emerald-600 text-emerald-400 hover:bg-emerald-650"
                }`}
                title={user ? `Signed in as: ${user.email}. Click to Logout` : "Sign in to synchronize database storage"}
              >
                {user ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              
              {/* Sync connectivity summary */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider font-extrabold flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-slate-400" /> CLOUD ENGINE
                  </span>
                  
                  {/* Connection light indicator */}
                  <span className="flex h-2 w-2 relative">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isFirebaseConfigured && user ? "bg-emerald-400" : isFirebaseConfigured ? "bg-blue-400" : "bg-amber-400"
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      isFirebaseConfigured && user ? "bg-emerald-500" : isFirebaseConfigured ? "bg-blue-500" : "bg-amber-500"
                    }`}></span>
                  </span>
                </div>

                <p className="text-[10px] leading-relaxed text-slate-400 font-sans">
                  {isFirebaseConfigured && user ? (
                    <span>Logged in as <strong className="text-emerald-400 truncate block">{user.email}</strong>. Firestore database storing live data.</span>
                  ) : isFirebaseConfigured ? (
                    <span>Firebase ready. Please sign in to authenticate student records.</span>
                  ) : (
                    <span>Operating in Local Storage. Run <strong>set_up_firebase</strong> to initiate secure Cloud database.</span>
                  )}
                </p>
              </div>

              {/* Login / Auth triggers */}
              {isFirebaseConfigured && (
                <button
                  type="button"
                  onClick={user ? onLogout : onLogin}
                  className={`w-full cursor-pointer py-2 px-3 border rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm
                    ${user 
                      ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/80 hover:text-white" 
                      : "bg-emerald-600 border-emerald-550 text-white hover:bg-emerald-700"
                    }
                  `}
                >
                  {user ? (
                    <>
                      <LogOut className="h-3.5 w-3.5" /> Log Out Cloud
                    </>
                  ) : (
                    <>
                      <LogIn className="h-3.5 w-3.5" /> Google Connect
                    </>
                  )}
                </button>
              )}

            </div>
          )}
        </div>

      </aside>
    </>
  );
}
