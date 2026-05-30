/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cloud, 
  Download, 
  Upload, 
  Trash2, 
  Settings, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  FileJson,
  Github,
  Globe
} from "lucide-react";
import { CDACCDashboardData } from "../types.ts";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CDACCDashboardData;
  user: any;
  isFirebaseConfigured: boolean;
  onImportData: (importedData: CDACCDashboardData) => Promise<void>;
  onResetData: () => Promise<void>;
}

export default function SettingsModal({
  isOpen,
  onClose,
  data,
  user,
  isFirebaseConfigured,
  onImportData,
  onResetData,
}: SettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isResetConfirming, setIsResetConfirming] = useState<boolean>(false);

  if (!isOpen) return null;

  // Handler: Export current student state to local JSON file
  const handleExportJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `cdacc-progress-${data.student.admissionNo.replace(/\//g, "-") || "backup"}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      setSuccessMessage("✓ Data exported successfully! Keep this file safe for porting.");
      setTimeout(() => setSuccessMessage(""), 4500);
    } catch (e: any) {
      setErrorMessage("Failed to export backing JSON tokens.");
      setTimeout(() => setErrorMessage(""), 4500);
    }
  };

  // Handler: Trigger local file uploads and validate JSON schemas
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as CDACCDashboardData;
        
        // Simple validation checks to verify valid schema
        if (!parsed.student || !parsed.student.admissionNo || !Array.isArray(parsed.units)) {
          throw new Error("Invalid CDACC Backup structure. Missing student profile indicators or learning units parameters.");
        }

        await onImportData(parsed);
        setSuccessMessage("✓ All records loaded successfully! Profile is aligned across multi-links.");
        setTimeout(() => setSuccessMessage(""), 5000);
      } catch (err: any) {
        setErrorMessage(err.message || "Invalid target backup schema formatting.");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleExecuteReset = async () => {
    await onResetData();
    setIsResetConfirming(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-55">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden font-sans"
      >
        {/* Banner header bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-600 rounded-xl">
              <Settings className="h-5 w-5 text-white animate-spin-slow" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold font-display leading-tight uppercase tracking-wider">
                CDACC Registry Sync Options
              </h4>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-0.5">
                Data Portability & Multi-Link backings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-xl transition border-0 leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Universal Sync info box */}
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-[11.5px] leading-relaxed text-slate-600 space-y-2.5">
            <div className="flex items-start gap-2 text-slate-800">
              <Info className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
              <strong className="font-extrabold text-slate-850 font-display text-xs">
                Multi-Link & Device Sync Portability
              </strong>
            </div>
            <p>
              Whether you are running this app on the <strong className="text-slate-800">Web App</strong>, a local <strong className="text-slate-800">PWA launcher</strong>, a <strong className="text-slate-800">Custom URL</strong>, or as a static <strong className="text-slate-800">GitHub mirror</strong>, your data can always stay perfectly synchronized!
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10.5px] font-medium text-slate-500 pt-1">
              <li className="flex items-center gap-1.5 bg-white border border-slate-100 p-2 rounded-lg shadow-2xs">
                <Cloud className="h-3.5 w-3.5 text-emerald-500" />
                <span>Cloud Multi-Tab Syncing</span>
              </li>
              <li className="flex items-center gap-1.5 bg-white border border-slate-100 p-2 rounded-lg shadow-2xs">
                <FileJson className="h-3.5 w-3.5 text-indigo-500" />
                <span>Encrypted JSON Tokens</span>
              </li>
            </ul>
          </div>

          {/* PORTABILITY SUITE FOR JSON PORTING */}
          <div className="border border-slate-200 rounded-2xl p-4.5 space-y-3.5 bg-white">
            <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block">
              1. Transfer Profile Portability Tokens
            </span>
            <p className="text-[11px] text-slate-500 leading-normal">
              Download your entire digital curriculum portfolio (learning units, PoE files checks, marks registry, attendance) and upload it instantly to migrate progress between devices or host mirrors.
            </p>

            <div className="grid grid-cols-2 gap-3.5 pt-1">
              {/* EXPORT BACKUP BUTTON */}
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 hover:bg-emerald-100/90 text-emerald-700 font-bold rounded-2xl transition cursor-pointer text-xs border border-emerald-150 shadow-2xs"
                title="Download current progress file as JSON backup"
              >
                <Download className="h-4 w-4" />
                <span>Export Progress Token</span>
              </button>

              {/* IMPORT BACKUP BUTTON */}
              <button
                type="button"
                onClick={triggerFileInput}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-indigo-50 hover:bg-indigo-100/90 text-indigo-700 font-bold rounded-2xl transition cursor-pointer text-xs border border-indigo-150 shadow-2xs"
                title="Upload previous CDACC backup tracker parameters"
              >
                <Upload className="h-4 w-4" />
                <span>Import/Restore Progress</span>
              </button>

              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json"
                onChange={handleImportFileChange}
              />
            </div>
          </div>

          {/* REALTIME PERSISTENCE LOGS HUD */}
          <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50/50 space-y-2.5">
            <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block">
              2. Real-time Multi-Instance Sync Engines
            </span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-white border border-slate-150 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 leading-none">
                  <Github className="h-4 w-4 text-slate-700" />
                  <span>GitHub & Multi-Link Mirrors</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal mt-2">
                  When deployed across different link mirrors, manual JSON migration provides local fallback for developers.
                </p>
                <div className="text-[9px] font-mono font-bold text-slate-400 mt-2 flex items-center gap-1 uppercase">
                  <Globe className="h-3 w-3 text-slate-300" /> Cross-Origin Portable
                </div>
              </div>

              <div className="bg-white border border-slate-150 rounded-xl p-3 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 leading-none">
                  <Cloud className="h-4 w-4 text-emerald-600" />
                  <span>Cloud Live Database</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal mt-2">
                  When authenticated via Google or Email on different links, Firestore syncs learning items in real-time.
                </p>
                <div className="text-[9px] font-mono font-bold text-emerald-600 mt-2 flex items-center gap-1 uppercase">
                  <CheckCircle className="h-3 w-3 text-emerald-400" /> Auto-sync Active
                </div>
              </div>
            </div>
          </div>

          {/* ERROR & SUCCESS STATUS ALERTS */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-2xl flex items-start gap-2.5 text-emerald-800 text-[11px] font-semibold font-sans animate-fade-in"
              >
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-red-50 border border-red-150 p-3.5 rounded-2xl flex items-start gap-2.5 text-red-800 text-[11px] font-semibold font-sans animate-fade-in"
              >
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DANGER DESTRUCTIVE CORE ACTIONS ZONE */}
          <div className="border border-red-100 rounded-2xl p-4.5 bg-red-50/10 space-y-2.5">
            <span className="text-[10px] font-mono font-extrabold text-red-600 uppercase tracking-widest block">
              Danger Zone (System Re-Initialization)
            </span>
            <p className="text-[10.5px] text-slate-500 leading-normal">
              Revert registry data, customized learning tasks progression, grades, and logs to factory defaults.
            </p>
            
            {isResetConfirming ? (
              <div className="p-3 bg-red-50 border border-red-150 rounded-xl flex items-center justify-between gap-3 animate-fade-in">
                <span className="text-[10.5px] font-bold text-red-800 flex items-center gap-1 leading-none">
                  <AlertTriangle className="h-4 w-4 shrink-0" /> Are you 100% sure?
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleExecuteReset}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[10.5px] cursor-pointer"
                  >
                    Yes, Hard Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsResetConfirming(false)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-[10.5px] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsResetConfirming(true)}
                className="flex items-center gap-1.5 py-2 px-3.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-150 font-bold rounded-xl transition cursor-pointer text-[10.5px] leading-none"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Reseed/Reset System Baseline</span>
              </button>
            )}
          </div>

        </div>

        {/* Modal footer control buttons */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-150 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4.5 py-2 bg-slate-800 hover:bg-slate-900 border border-slate-700 transition cursor-pointer text-white text-xs font-bold rounded-xl block leading-none"
          >
            Close Settings Panel
          </button>
        </div>

      </motion.div>
    </div>
  );
}
