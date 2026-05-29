/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { CDACCDashboardData } from "../types.ts";
import { Sparkles, Brain, Send, MessageSquare, AlertCircle, RefreshCw, ChevronRight, HelpCircle, Loader2 } from "lucide-react";

interface AICoachAdvisorProps {
  data: CDACCDashboardData;
  preSelectedUnitCode: string;
  onClearPreSelectedUnitCode: () => void;
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export default function AICoachAdvisor({
  data,
  preSelectedUnitCode,
  onClearPreSelectedUnitCode,
}: AICoachAdvisorProps) {
  const [activeTab, setActiveTab] = useState<"diagnostic" | "chat">("diagnostic");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string>("");
  const [diagnosticError, setDiagnosticError] = useState<string>("");
  const [focusUnit, setFocusUnit] = useState<string>("");

  // Chatbot state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Sasa! I am your TVET CDACC Mentor. Ask me any syllabus questions, request remedial CAT preparation questions, or ask about practical PoE evidence templates. How can I help you today?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-trigger analysis if a pre-selected unit is highlighted
  useEffect(() => {
    if (preSelectedUnitCode) {
      setFocusUnit(preSelectedUnitCode);
      setActiveTab("diagnostic");
      handleRunDiagnostic(preSelectedUnitCode);
      onClearPreSelectedUnitCode(); // Clear so it won't trigger continuously
    }
  }, [preSelectedUnitCode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleRunDiagnostic = async (overrideFocus?: string) => {
    setIsAnalyzing(true);
    setDiagnosticError("");
    const unitToken = overrideFocus !== undefined ? overrideFocus : focusUnit;

    try {
      const response = await fetch("/api/coach/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: data.student,
          units: data.units,
          deadlines: data.deadlines,
          focusUnitCode: unitToken || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server returned code ${response.status}`);
      }

      const resData = await response.json();
      setDiagnosticResult(resData.analysis);
    } catch (err: any) {
      console.error(err);
      setDiagnosticError(err.message || "Unable to connect to full-stack mentor service. Please ensure GEMINI_API_KEY is configured in your Settings > Secrets panel on the top right.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isSendingMessage) return;

    const currentMessage = userInput;
    setUserInput("");
    
    // Add user message to history
    const nextHistory = [...chatHistory, { role: "user" as const, text: currentMessage }];
    setChatHistory(nextHistory);
    setIsSendingMessage(true);

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentMessage,
          chatHistory: nextHistory.slice(-6), // Send last few messages for core context
        }),
      });

      if (!response.ok) {
        throw new Error("Chat assistant server failure.");
      }

      const resData = await response.json();
      setChatHistory([...nextHistory, { role: "model", text: resData.reply }]);
    } catch (err: any) {
      setChatHistory([
        ...nextHistory,
        {
          role: "model",
          text: "Pole sana, I am currently facing an issue connecting to my brain. Please check that your TVET GEMINI_API_KEY is set in your Secrets panel, or try again in a few moments.",
        },
      ]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const quickQuestions = [
    { label: "PoE guidelines in Kenya", text: "What are the common files and forms required in a CDACC Portfolio of Evidence portfolio binder?" },
    { label: "CAT retry regulations", text: "What happens if I get a score below 50% in my TVET institutional continuous assessment test?" },
    { label: "IP subnetting practice task", text: "Give me some sample CDACC Level 6 practice questions on IPv4 and subnet calculations." },
  ];

  const handleQuickQuestionClick = (questionText: string) => {
    setUserInput(questionText);
    setActiveTab("chat");
  };

  // Simple clean helper to render Markdown-like segments (Headings, bold text, lists) in UI
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // 1. Check for headings
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-sm font-bold text-slate-800 mt-4 mb-2 font-display">{line.substring(4)}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1 mt-5 mb-2.5 font-display">{line.substring(3)}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={idx} className="text-lg font-black text-slate-900 mt-6 mb-3 font-display">{line.substring(2)}</h2>;
      }
      
      // 2. Check for bullet list items
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const content = line.trim().substring(2);
        return (
          <li key={idx} className="list-disc ml-5 text-xs text-slate-600 leading-relaxed mb-1.5 font-sans">
            {parseInlineStyles(content)}
          </li>
        );
      }
      
      // 3. Regular block
      if (line.trim() === "") return <div key={idx} className="h-2"></div>;
      
      return (
        <p key={idx} className="text-xs text-slate-600 leading-relaxed mb-2.5 font-sans">
          {parseInlineStyles(line)}
        </p>
      );
    });
  };

  // Simple parser to extract bold (**text**) or code (`text`) formats inline
  const parseInlineStyles = (txt: string) => {
    const parts = [];
    let currentIdx = 0;
    
    // Simple double-asterisk finder
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(txt)) !== null) {
      const precedingText = txt.substring(currentIdx, match.index);
      if (precedingText) parts.push(precedingText);
      
      parts.push(<strong key={match.index} className="font-semibold text-slate-800">{match[1]}</strong>);
      currentIdx = boldRegex.lastIndex;
    }
    
    const remainingText = txt.substring(currentIdx);
    if (remainingText) {
      // Parse inline code format
      const codeRegex = /`(.*?)`/g;
      let codeMatch;
      const subParts = [];
      let subIdx = 0;
      
      while ((codeMatch = codeRegex.exec(remainingText)) !== null) {
        const subPre = remainingText.substring(subIdx, codeMatch.index);
        if (subPre) subParts.push(subPre);
        subParts.push(
          <code key={codeMatch.index} className="bg-slate-100 text-slate-700 font-mono text-[10.5px] px-1 py-0.5 rounded border border-slate-200">
            {codeMatch[1]}
          </code>
        );
        subIdx = codeRegex.lastIndex;
      }
      
      const subRemaining = remainingText.substring(subIdx);
      if (subRemaining) subParts.push(subRemaining);
      
      parts.push(...subParts);
    } else if (parts.length === 0) {
      return txt;
    }
    
    return parts;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans mb-6">
      
      {/* COLUMN 1: CONTROLS & SEED TOPICS */}
      <div className="space-y-4">
        
        {/* TAB CONTROL CONTAINER */}
        <div className="bg-slate-900 text-white rounded-2xl p-2 flex gap-1 shadow-sm border border-slate-800">
          <button
            onClick={() => setActiveTab("diagnostic")}
            className={`flex-1 text-xs py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "diagnostic" ? "bg-emerald-600 text-white shadow-sm" : "hover:text-white text-slate-400"}`}
          >
            <Brain className="h-4 w-4" /> CDACC Audit
          </button>
          
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 text-xs py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "chat" ? "bg-emerald-600 text-white shadow-sm" : "hover:text-white text-slate-400"}`}
          >
            <MessageSquare className="h-4 w-4" /> Trainee Chat
          </button>
        </div>

        {/* STUDY UNIT TARGET PANEL */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider font-mono">
            Diagnostic Scope
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Focus Unit</label>
              <select
                value={focusUnit}
                onChange={(e) => setFocusUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Audit overall records (all units)</option>
                {data.units.map(u => (
                  <option key={u.id} value={u.code}>{u.code} - {u.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleRunDiagnostic()}
              disabled={isAnalyzing}
              className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white hover:text-emerald-300 transition-all font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-inner cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Performing Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-emerald-400 fill-emerald-400" /> Run Academic Diagnostic
                </>
              )}
            </button>
          </div>
        </div>

        {/* QUICK QUESTION CARDS */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-5 rounded-2xl text-white shadow-md border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-400 flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4" /> Quick TVET Topics
          </h4>
          <p className="text-[11px] text-indigo-200 mt-1 leading-relaxed">
            Click any core TVET CDACC query to instantly load custom questions or clarifications:
          </p>
          
          <div className="space-y-2 mt-4">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestionClick(q.text)}
                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-[11px] font-medium leading-relaxed text-indigo-100 flex items-center justify-between"
              >
                <span className="truncate mr-2">{q.label}</span>
                <ChevronRight className="h-3 w-3 shrink-0 text-emerald-400" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* COLUMN 2 & 3: MAIN VIEW SCREEN */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col min-h-[460px]">
        {activeTab === "diagnostic" ? (
          /* DIAGNOSTIC AUDIT CONTAINER */
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-emerald-600 bg-emerald-50 p-1 rounded-lg" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-850">AI Competency Diagnostic Summary</h3>
                    <p className="text-[10px] text-slate-400">Generates instant corrective planning and unit metrics</p>
                  </div>
                </div>
                {diagnosticResult && (
                  <button
                    onClick={() => handleRunDiagnostic()}
                    disabled={isAnalyzing}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                    title="Recalculate audit"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                  </button>
                )}
              </div>

              {diagnosticError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Missing API Credentials</p>
                    <p className="opacity-90 leading-relaxed mt-0.5">{diagnosticError}</p>
                  </div>
                </div>
              )}

              {isAnalyzing ? (
                <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
                  <div>
                    <p className="text-xs font-bold text-slate-700">Gemini-3.5-Flash processing continuous records...</p>
                    <p className="text-[10px] text-slate-400">Reviewing class attendance & continuous compliance checklists</p>
                  </div>
                </div>
              ) : diagnosticResult ? (
                <div className="max-h-[380px] overflow-y-auto pr-2 pb-4 border-b border-slate-100/60 scrollable">
                  {renderMarkdown(diagnosticResult)}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-4 border border-dashed border-slate-200 rounded-2xl">
                  <Sparkles className="h-12 w-12 text-slate-300 animate-pulse" />
                  <div className="max-w-md px-6">
                    <p className="text-xs font-bold text-slate-800">No diagnostic compiled yet</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Select your scope options on the left, then click <strong>"Run Academic Diagnostic"</strong>. The AI Mentor will process all your grades and attendance to highlight any assessment bottlenecks!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100/60 bg-white">
              <span>Backed by Gemini Content Generation</span>
              <span>CBET Continuous Assessor Compliance</span>
            </div>
          </div>
        ) : (
          /* INTERACTIVE CHAT ADVISOR CONTAINER */
          <div className="flex-1 flex flex-col justify-between">
            {/* CHAT CHRONOLOGY */}
            <div className="flex-1 overflow-y-auto max-h-[320px] mb-4 space-y-4 pr-1 scrollable">
              {chatHistory.map((chat, idx) => (
                <div
                  key={idx}
                  className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      chat.role === "user"
                        ? "bg-slate-900 text-white rounded-tr-none"
                        : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/40"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-[10px] uppercase font-mono tracking-wider opacity-60">
                      {chat.role === "user" ? "Student Account" : "CDACC Coach Advisor"}
                    </div>
                    {chat.role === "user" ? (
                      <p>{chat.text}</p>
                    ) : (
                      <div className="space-y-1">{renderMarkdown(chat.text)}</div>
                    )}
                  </div>
                </div>
              ))}
              {isSendingMessage && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-850 rounded-2xl rounded-tl-none p-4 text-xs border border-slate-200/40">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Mentor studying CDACC guides...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* SEND MESSAGE FIELD */}
            <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-100 pt-4">
              <input
                type="text"
                placeholder="Ask about subnetting, PoE verification, CATs schedule, or Kenyan TVET..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isSendingMessage}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isSendingMessage || !userInput.trim()}
                className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
