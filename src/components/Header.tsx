/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { StudentProfile } from "../types.ts";
import { GraduationCap, Landmark, Calendar, Clock, User, Award } from "lucide-react";

interface HeaderProps {
  student: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
}

export default function Header({ student, onUpdateProfile }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(student.name);
  const [editedInstitution, setEditedInstitution] = useState(student.institution);
  const [editedAdNo, setEditedAdNo] = useState(student.admissionNo);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSave = () => {
    onUpdateProfile({
      ...student,
      name: editedName,
      institution: editedInstitution,
      admissionNo: editedAdNo,
    });
    setIsEditing(false);
  };

  const formattedTime = currentTime.toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="relative w-full rounded-2xl bg-slate-900 text-white shadow-xl overflow-hidden border border-slate-800 mb-6 font-sans">
      {/* Kenyan flag design top border */}
      <div className="h-2 w-full kenya-accent-bar" style={{ animation: "flag-shine 15s ease infinite" }}></div>
      
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-2xl md:text-3xl shadow-inner shadow-black/40 shrink-0">
              {student.name.split(" ").map(n => n[0]).join("")}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                  TVET CDACC PORTAL
                </span>
                <span className="bg-amber-500/20 text-amber-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Kenya CBET Level 6
                </span>
              </div>
              
              {isEditing ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Student Name"
                  />
                  <input
                    type="text"
                    value={editedAdNo}
                    onChange={(e) => setEditedAdNo(e.target.value)}
                    className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Admission No"
                  />
                  <button
                    onClick={handleSave}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 id="portal-student-name" className="text-2xl md:text-3xl font-display font-medium tracking-tight text-white leading-none">
                    {student.name}
                  </h1>
                  <button
                    onClick={() => {
                      setEditedName(student.name);
                      setEditedAdNo(student.admissionNo);
                      setIsEditing(true);
                    }}
                    className="text-slate-400 hover:text-white text-xs underline font-sans"
                  >
                    Edit
                  </button>
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-slate-400 text-sm mt-1">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-slate-500" />
                  {student.courseName}
                </span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  {student.admissionNo}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 font-sans md:min-w-[240px]">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Clock className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="font-mono font-medium text-white tracking-widest">{formattedTime}</span>
              <span className="bg-slate-800 text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded uppercase font-semibold">
                EAT
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1 w-full border-t border-slate-800/80 pt-1">
              <Landmark className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-slate-400 truncate max-w-[200px]" title={student.institution}>
                {student.institution}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
