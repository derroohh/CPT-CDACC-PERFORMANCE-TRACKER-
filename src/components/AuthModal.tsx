/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Mail, 
  Lock, 
  UserPlus, 
  LogIn, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles, 
  Info,
  CheckCircle2
} from "lucide-react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase.ts";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin: () => void;
  onNotification: (title: string, body: string) => void;
  defaultIsSignUp?: boolean;
}

export default function AuthModal({
  isOpen,
  onClose,
  onGoogleLogin,
  onNotification,
  defaultIsSignUp = false,
}: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsSignUp(defaultIsSignUp);
    }
  }, [isOpen, defaultIsSignUp]);
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isFirebaseConfigured || !auth) {
      setErrorMsg("Firebase is currently operating in offline simulation mode. Run set_up_firebase to connect actual Auth services.");
      return;
    }

    // Input Validation
    if (!email.trim() || !password.trim()) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setErrorMsg("Passwords do not match.");
          setLoading(false);
          return;
        }
        if (!fullName.trim()) {
          setErrorMsg("Trainee name is required for registration.");
          setLoading(false);
          return;
        }

        // 1. Create email/password user
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        
        // 2. Set profile display name
        if (credential.user) {
          await updateProfile(credential.user, {
            displayName: fullName.trim()
          });
        }
        
        setSuccessMsg("Account successfully registered! Creating your TVET CDACC environment...");
        onNotification("🎉 Registry Created!", `Welcome to Kenya TVET Hub, ${fullName.trim()}! Please complete your syllabus details.`);
        
        // Reset and close after delay
        setTimeout(() => {
          onClose();
        }, 1500);

      } else {
        // Sign In Flow
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMsg("Access verified. Loading student registry files...");
        onNotification("🔑 authenticated", "Successfully loaded encrypted records from live CDACC database.");
        
        // Reset and close after delay
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (error: any) {
      console.error("Authentication Error: ", error);
      let friendlyError = error?.message || "An unexpected error occurred.";
      
      // Map common Firebase errors to friendly messages
      if (error?.code === "auth/email-already-in-use") {
        friendlyError = "The email address is already in use by another student.";
      } else if (error?.code === "auth/invalid-email") {
        friendlyError = "The email address is invalid.";
      } else if (error?.code === "auth/user-not-found" || error?.code === "auth/wrong-password" || error?.code === "auth/invalid-credential") {
        friendlyError = "Incorrect student credentials. Please check your registry email and passkey code.";
      } else if (error?.code === "auth/operation-not-allowed") {
        friendlyError = "Email/Password sign-in has not been activated in this Firebase Project's console.";
      }
      
      setErrorMsg(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Black Backdrop Scrim */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      {/* Main Dialog Panel */}
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 10 }}
        className="relative bg-white border border-slate-200 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden z-10"
      >
        {/* Colorful Kenya TVET Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-black via-red-600 to-emerald-600"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          title="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header titles */}
          <div className="space-y-1 text-center">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-mono text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest mx-auto">
              {isSignUp ? "Account Registration" : "Official TVET Portal"}
            </span>
            <h3 className="text-xl font-bold font-display text-slate-900 tracking-tight">
              {isSignUp ? "Set up Trainee Registry" : "Sign In to CDACC Tracker"}
            </h3>
            <p className="text-xs text-slate-500">
              Access your continuous assessment ledger, PoE binder, and AI mentor.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            
            {/* Full Name (Sign Up only) */}
            <AnimatePresence mode="popLayout">
              {isSignUp && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                    Full Trainee Name
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-900 rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-emerald-600 transition-colors"
                      placeholder="e.g., Derrick Ng'ure"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                Student Registry Email
              </label>
              <div className="relative flex items-center">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-900 rounded-xl py-2 px-3.5 pl-10 text-xs focus:outline-none focus:border-emerald-600 transition-colors"
                  placeholder="name@polytechnic.ac.ke"
                  required
                />
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono flex justify-between">
                <span>Passcode / Password</span>
                {!isSignUp && (
                  <span className="text-[9px] text-emerald-600 hover:underline cursor-not-allowed">Reset Code?</span>
                )}
              </label>
              <div className="relative flex items-center">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-900 rounded-xl py-2 px-3.5 pl-10 pr-10 text-xs focus:outline-none focus:border-emerald-600 transition-colors"
                  placeholder="Min 6 characters code"
                  required
                />
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Reveal password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            <AnimatePresence mode="popLayout">
              {isSignUp && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                    Confirm Code
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-900 rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:border-emerald-600 transition-colors"
                      placeholder="Repeat passcode exactly"
                      required={isSignUp}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Errors / Success announcements */}
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 flex items-start gap-2 animate-shake">
                <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                <p className="leading-tight font-medium">{errorMsg}</p>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-100 flex items-start gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-tight font-medium">{successMsg}</p>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 font-bold text-white text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm
                ${loading ? "opacity-60 cursor-wait" : ""}
              `}
            >
              {loading ? (
                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : isSignUp ? (
                <>
                  <UserPlus className="h-4 w-4" /> Register Trainee Profile
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Secure Registry Sign In
                </>
              )}
            </button>

          </form>

          {/* Prompt Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-bold transition hover:underline cursor-pointer"
            >
              {isSignUp 
                ? "Already have an official trainee account? Sign In" 
                : "New TVET trainee? Register a custom cloud registry file"
              }
            </button>
          </div>

          {/* Social login line divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-150"></div>
            <span className="flex-shrink mx-4 text-slate-400 font-mono text-[9px] font-bold uppercase tracking-widest">or connect with Google</span>
            <div className="flex-grow border-t border-slate-150"></div>
          </div>

          {/* Alternate Google Authorization */}
          <button
            type="button"
            onClick={() => {
              onGoogleLogin();
              onClose();
            }}
            className="w-full py-2 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
          >
            {/* Standard G icon */}
            <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Continue with Google Check-in
          </button>

          {/* Firebase Authentication Admin Configuration banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-2.5 items-start">
            <Info className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black text-amber-800 uppercase tracking-wider block">
                Enable Email Provider
              </span>
              <p className="text-[10px] leading-relaxed text-amber-700">
                To sign up with email and password, ensure that the <strong>Email/Password</strong> provider is enabled in your Firebase Console under Auth &rarr; Sign-in method.
              </p>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
