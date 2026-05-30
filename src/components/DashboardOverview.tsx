/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CDACCDashboardData, StudentProfile, CompetenceStatus } from "../types.ts";
import { 
  User, 
  GraduationCap, 
  Landmark, 
  Calendar, 
  Clock, 
  Upload, 
  Camera, 
  Edit3, 
  Check, 
  X, 
  FileImage,
  Award,
  BookOpen,
  Activity,
  Milestone,
  Cpu,
  Bolt,
  ChefHat,
  Hammer,
  Car,
  Sparkles,
  Layers,
  Sprout,
  Briefcase,
  Scissors
} from "lucide-react";
import CDACCSummaryCards from "./CDACCSummaryCards.tsx";
import PerformanceGraphs from "./PerformanceGraphs.tsx";

interface DashboardOverviewProps {
  data: CDACCDashboardData;
  isNotificationsEnabled: boolean;
  onRequestNotificationPermission: () => void;
  onNavigateToTab: (tabId: string) => void;
  onUpdateProfile: (updated: StudentProfile) => void;
  onLoadCurriculaPreset: (key: string) => void;
}

export default function DashboardOverview({
  data,
  isNotificationsEnabled,
  onRequestNotificationPermission,
  onNavigateToTab,
  onUpdateProfile,
  onLoadCurriculaPreset,
}: DashboardOverviewProps) {
  const { student } = data;

  // Edit details panel states
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(student.name);
  const [editedAdmissionNo, setEditedAdmissionNo] = useState(student.admissionNo);
  const [editedCourseName, setEditedCourseName] = useState(student.courseName);
  const [editedInstitution, setEditedInstitution] = useState(student.institution);
  const [editedCohort, setEditedCohort] = useState(student.cohort || "2024-2026");

  // File drag & drop states
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync edit state with changes to profile data
  useEffect(() => {
    setEditedName(student.name);
    setEditedAdmissionNo(student.admissionNo);
    setEditedCourseName(student.courseName);
    setEditedInstitution(student.institution);
    setEditedCohort(student.cohort || "2024-2026");
  }, [student]);

  // Handle saving details
  const handleSaveDetails = () => {
    if (!editedName.trim() || !editedAdmissionNo.trim()) {
      setUploadError("Name and Admission Number cannot be blank.");
      return;
    }
    onUpdateProfile({
      ...student,
      name: editedName,
      admissionNo: editedAdmissionNo,
      courseName: editedCourseName,
      institution: editedInstitution,
      cohort: editedCohort,
    });
    setIsEditing(false);
    setUploadError(null);
  };

  // Convert files to base64
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    // Limit to ~2MB to stay within Firestore limits safe margin
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image too large. Please select a photo below 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdateProfile({
        ...student,
        photoUrl: reader.result as string,
      });
      setUploadError(null);
    };
    reader.onerror = () => {
      setUploadError("Failed to parse file. Try another image format.");
    };
    reader.readAsDataURL(file);
  };

  // Drag handles
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // Drop handle
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Choose file handle
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  // Helper trigger
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Core competency summary calculations
  const totalCompetencies = data.units.length;
  const certifiedUnits = data.units.filter(u => u.poeStatus === "Certified").length;
  const ongoingUnits = data.units.filter(u => u.competenceStatus === CompetenceStatus.ONGOING).length;
  const nycUnits = data.units.filter(u => u.competenceStatus === CompetenceStatus.NOT_YET_COMPETENT).length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* KENYAN CDACC SYLLABUS PATHWAY INTERACTIVE SWITCHER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-mono font-extrabold tracking-widest text-emerald-600 flex items-center gap-1.5 leading-none mb-1">
              <Sparkles className="h-3 w-3 animate-pulse" /> National CDACC Curriculum Presets
            </span>
            <h3 className="text-sm font-bold text-slate-800 font-display">
              Change Kenyan TVET Trade Syllabus Pathway
            </h3>
          </div>
          <span className="text-[10.5px] text-slate-400 font-medium">
            Select your syllabus pathway to load official units of learning, deadlines, and topics.
          </span>
        </div>

        {/* Trade quick cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            {
              key: "ict",
              title: "ICT Technician",
              subtitle: "Software & Networks",
              duration: "Level 6",
              icon: Cpu,
              color: "text-blue-500 bg-blue-50 border-blue-100",
              activeColor: "ring-2 ring-emerald-500/80 bg-emerald-50/10 border-emerald-400"
            },
            {
              key: "electrical",
              title: "Electrical Power",
              subtitle: "Industrial Wiring",
              duration: "Level 6",
              icon: Bolt,
              color: "text-amber-500 bg-amber-50 border-amber-100",
              activeColor: "ring-2 ring-emerald-500/80 bg-emerald-50/10 border-emerald-400"
            },
            {
              key: "hospitality",
              title: "Culinary Arts",
              subtitle: "Food & Beverage",
              duration: "Level 6",
              icon: ChefHat,
              color: "text-rose-500 bg-rose-50 border-rose-100",
              activeColor: "ring-2 ring-emerald-500/80 bg-emerald-50/10 border-emerald-400"
            },
            {
              key: "construction",
              title: "Civil Engineering",
              subtitle: "Structural CAD",
              duration: "Level 6",
              icon: Hammer,
              color: "text-emerald-500 bg-emerald-50 border-emerald-100",
              activeColor: "ring-2 ring-emerald-500/80 bg-emerald-50/10 border-emerald-400"
            },
            {
              key: "automotive",
              title: "Automotive Tech",
              subtitle: "Engine Diagnostics",
              duration: "Level 6",
              icon: Car,
              color: "text-indigo-500 bg-indigo-55 border-indigo-100",
              activeColor: "ring-2 ring-emerald-500/80 bg-emerald-50/10 border-emerald-400"
            },
            {
              key: "agriculture",
              title: "Agriculture",
              subtitle: "Agro-Business",
              duration: "Level 6",
              icon: Sprout,
              color: "text-teal-600 bg-teal-50 border-teal-100",
              activeColor: "ring-2 ring-emerald-500/80 bg-emerald-50/10 border-emerald-400"
            },
            {
              key: "business",
              title: "Business Mgmt",
              subtitle: "SACCO Admin",
              duration: "Level 6",
              icon: Briefcase,
              color: "text-violet-600 bg-violet-50 border-violet-100",
              activeColor: "ring-2 ring-emerald-500/80 bg-emerald-50/10 border-emerald-400"
            },
            {
              key: "fashion",
              title: "Fashion Design",
              subtitle: "Pattern Apparel",
              duration: "Level 6",
              icon: Scissors,
              color: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100",
              activeColor: "ring-2 ring-emerald-500/80 bg-emerald-50/10 border-emerald-400"
            }
          ].map((preset) => {
            const Icon = preset.icon;
            // Determine active preset based on either student courseName or some smart match
            const isActive = student.courseName.toLowerCase().includes(preset.title.toLowerCase()) || 
                             student.courseName.toLowerCase().includes(preset.subtitle.toLowerCase()) ||
                             (preset.key === "ict" && student.courseName.toLowerCase().includes("information")) ||
                             (preset.key === "ict" && student.courseName.toLowerCase().includes("ict")) ||
                             (preset.key === "agriculture" && student.courseName.toLowerCase().includes("agri")) ||
                             (preset.key === "business" && student.courseName.toLowerCase().includes("bus")) ||
                             (preset.key === "fashion" && student.courseName.toLowerCase().includes("fas"));

            return (
              <motion.button
                key={preset.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onLoadCurriculaPreset(preset.key)}
                className={`text-left p-3 rounded-xl border cursor-pointer transition-all duration-200 select-none flex flex-col justify-between h-[115px] min-w-0
                  ${isActive ? preset.activeColor : "border-slate-150 bg-slate-50/30 hover:bg-slate-50"}
                `}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`p-1.5 rounded-lg ${preset.color} shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {isActive ? (
                    <span className="bg-emerald-500 text-white text-[7.5px] font-extrabold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
                      Active
                    </span>
                  ) : (
                    <span className="text-[7.5px] text-slate-450 font-bold uppercase font-mono tracking-wider">
                      {preset.duration}
                    </span>
                  )}
                </div>
                <div className="pt-2 min-w-0">
                  <h4 className="text-[11px] font-bold text-slate-850 leading-tight truncate">
                    {preset.title}
                  </h4>
                  <p className="text-[9px] text-slate-450 font-medium truncate mt-0.5">
                    {preset.subtitle}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 1. HERO STUDENT BIO CARD WITH INTEGRATED PROFILE UPLOADER */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-xl"
      >
        {/* Flag Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-black via-red-600 to-emerald-600"></div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* AVATAR + UPLOADER INTERFACE */}
            <div className="relative group mx-auto lg:mx-0 shrink-0">
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`relative h-28 w-28 sm:h-32 sm:w-32 rounded-3xl overflow-hidden bg-slate-800 border-2 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer select-none group
                  ${isDragActive ? "border-emerald-500 scale-102 bg-slate-750" : "border-slate-700 hover:border-emerald-500/80"}
                `}
                title="Click or Drag & Drop to upload student photo"
              >
                {student.photoUrl ? (
                  <img 
                    src={student.photoUrl} 
                    alt={student.name} 
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center p-3">
                    <User className="h-10 w-10 text-slate-500 mx-auto" />
                    <span className="text-[10px] font-semibold text-slate-500 uppercase font-mono tracking-wider block mt-1">
                      Upload
                    </span>
                  </div>
                )}

                {/* Overlying Camera Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-emerald-400">
                  <Camera className="h-6 w-6 mb-1 animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-wider font-mono">
                    Replace Photo
                  </span>
                </div>
              </div>

              {/* Hidden classic input element */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileInputChange}
                className="hidden"
                aria-label="Student photo file upload"
              />

              <div className="mt-2 text-center">
                <button 
                  onClick={triggerFileSelect}
                  className="text-[10px] text-slate-400 hover:text-emerald-400 transition-colors uppercase font-mono font-bold tracking-widest bg-slate-800/40 hover:bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-800"
                >
                  Change Avatar
                </button>
              </div>
            </div>

            {/* DETAILS AND COMPETENCY METADATA COLUMNS */}
            <div className="flex-1 w-full space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-3 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-widest font-mono">
                      Level 6 CBET Trainee
                    </span>
                    <span className="bg-slate-800/80 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-700/80 uppercase">
                      Cohort: {student.cohort || "2024-2026"}
                    </span>
                    <span className="bg-blue-500/10 text-blue-400 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-500/20">
                      ID: {student.admissionNo}
                    </span>
                  </div>

                  {!isEditing ? (
                    <div className="flex items-center gap-2.5 pt-1">
                      <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
                        {student.name}
                      </h2>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 bg-slate-800/40 hover:bg-slate-800 border border-slate-700 rounded-lg transition duration-150 cursor-pointer"
                        title="Edit Student Basic Details"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider block pt-1">
                      Editing Registry File
                    </span>
                  )}
                </div>

                {/* Quick Status Pill */}
                <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 py-2 px-3 rounded-2xl shrink-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider font-mono">
                    Official Active Registry
                  </span>
                </div>
              </div>

              {/* EDITING INTERACTIVE PANEL COLLAPSIBLE */}
              <AnimatePresence>
                {isEditing ? (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4.5 space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          Trainee Full Name
                        </label>
                        <input 
                          type="text" 
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="e.g., Derrick Ng\'ure"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          Admission Code / Reg Number
                        </label>
                        <input 
                          type="text" 
                          value={editedAdmissionNo}
                          onChange={(e) => setEditedAdmissionNo(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="e.g., ADM-EL-3001"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          Diploma Course Syllabus Pathway
                        </label>
                        <input 
                          type="text" 
                          value={editedCourseName}
                          onChange={(e) => setEditedCourseName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="e.g., Diploma in Electrical & Electronics"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          Institution / Polytechnic Campus
                        </label>
                        <input 
                          type="text" 
                          value={editedInstitution}
                          onChange={(e) => setEditedInstitution(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="e.g., Kabete National Polytechnic"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                          Active Cohort Milestones Years
                        </label>
                        <input 
                          type="text" 
                          value={editedCohort}
                          onChange={(e) => setEditedCohort(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="e.g., 2024-2026"
                        />
                      </div>

                    </div>

                    {uploadError && (
                      <p className="text-rose-400 text-xs mt-1 bg-rose-500/10 py-1.5 px-2.5 rounded-lg border border-rose-500/20 font-medium">
                        ⚠️ {uploadError}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={handleSaveDetails}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Check className="h-3.5 w-3.5" /> Save Profile Details
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setUploadError(null);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel Edit
                      </button>
                    </div>

                  </motion.div>
                ) : (
                  // REGULAR STATIC BIO DATA ROW
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 border-t border-slate-800/80 pt-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800/60 text-slate-400 rounded-xl border border-slate-800 shrink-0">
                        <GraduationCap className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-550 uppercase font-mono tracking-wider block">Course Pathway</span>
                        <span className="text-[12.5px] font-semibold text-slate-200 truncate block">
                          {student.courseName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800/60 text-slate-400 rounded-xl border border-slate-800 shrink-0">
                        <Landmark className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-550 uppercase font-mono tracking-wider block">Polytechnic Center</span>
                        <span className="text-[12.5px] font-semibold text-slate-200 truncate block" title={student.institution}>
                          {student.institution}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800/60 text-slate-400 rounded-xl border border-slate-800 shrink-0">
                        <Calendar className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-550 uppercase font-mono tracking-wider block">Study Cohort Cycle</span>
                        <span className="text-[12.5px] font-semibold text-slate-200 block">
                          {student.cohort || "2024-2026 Academic Batch"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {uploadError && !isEditing && (
                <div className="mt-2 text-rose-400 text-xs bg-rose-500/10 py-2 px-3 rounded-xl border border-rose-500/20">
                  ⚠️ {uploadError}
                </div>
              )}

            </div>

          </div>
        </div>
      </motion.div>

      {/* 2. DYNAMIC CDACC METRICS OVERVIEW CARDS ROW */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 px-1">
          <Activity className="h-4 w-4 text-emerald-500" />
          <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">
            Continuous Trainee Indicators
          </h3>
        </div>
        <CDACCSummaryCards 
          data={data}
          isNotificationsEnabled={isNotificationsEnabled}
          onRequestNotificationPermission={onRequestNotificationPermission}
          onNavigateToTab={onNavigateToTab}
        />
      </div>

      {/* 3. PERFORMANCE CURVE AND STATISTICAL CHARTS GRID */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 px-1">
          <BookOpen className="h-4 w-4 text-emerald-500" />
          <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">
            Detailed Learning & Competency Curve
          </h3>
        </div>
        <PerformanceGraphs 
          data={data}
          onNavigateToTab={onNavigateToTab}
        />
      </div>

    </div>
  );
}
