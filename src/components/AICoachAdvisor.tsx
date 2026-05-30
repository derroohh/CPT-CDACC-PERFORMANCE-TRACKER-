/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { CDACCDashboardData, CompetenceStatus } from "../types.ts";
import { 
  Sparkles, 
  Brain, 
  Send, 
  MessageSquare, 
  AlertCircle, 
  RefreshCw, 
  ChevronRight, 
  HelpCircle, 
  Loader2, 
  Calendar, 
  BookOpen, 
  Award, 
  Trash2, 
  CheckCircle, 
  CheckSquare, 
  Square, 
  Check, 
  Lightbulb, 
  Play, 
  UserCheck 
} from "lucide-react";

interface AICoachAdvisorProps {
  data: CDACCDashboardData;
  preSelectedUnitCode: string;
  onClearPreSelectedUnitCode: () => void;
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

interface StudyTask {
  id: string;
  title: string;
  category: "Theory" | "PoE Evidence" | "CAT Prep";
  completed: boolean;
}

interface WeeklyPlan {
  weekNo: number;
  focus: string;
  tasks: StudyTask[];
}

// Complete Offline local TVET CDACC Expertise mappings to simulate elite AI responses
const OFFLINE_COMPETENCY_AUDITS: Record<string, string> = {
  "ICT-OS-60-01": `## ## Offline CDACC Mentorship Audit: ICT-OS-60-01 (Digital Literacy)
###  Overview of CDACC Continuous Progress
- **Unit Average Score**: 72% | **Attendance**: 82%
- **PoE Binder Integrity**: In Progress (Draft stage).

### ⚠️ Performance Bottlenecks & Critical Risks
- **Practical Log gaps**: You have completed Word documents but Spreadsheet formulas are currently lacking. Your signed Lab Assessor sheet for Excel nested IF clauses has not been uploaded.
- **Continuous assessment pass**: Excellent! Your score of 72% exceeds the 50% competent threshold.

### 📋 Action Plan & Remedial Strategies
1. **Slick Nested IF Practice**: Complete two tasks showing complex conditional formats (grades scaling).
2. **Signed Assessor Form**: Ensure the school's TVET internal verifier signs the Excel practical sheet list by next Tuesday.
3. **Typography Standards**: Refine layout alignment using double spacing on official proposals to clear CDACC assessment parameters.`,

  "ICT-OS-60-02": `## ## Offline CDACC Mentorship Audit: ICT-OS-60-02 (Hardware Maintenance)
###  Overview of CDACC Continuous Progress
- **Unit Average Score**: 65% | **Attendance**: 85%
- **PoE Binder Integrity**: Approved & Certified.

### ⚠️ Performance Bottlenecks & Critical Risks
- **Overall Status**: Secure base. Your hardware diagnostics checklist of motherboard memory is fully signed off by lab assessors.
- **BIOS setups progress**: Safe competency recorded.

### 📋 Action Plan & Remedial Strategies
1. **Low-level Setup Mastery**: Revise different legacy parameters vs UEFI keys.
2. **Dual-Boot installations**: Revise file layout structures (GPT partitions vs MBR limits) to prepare for national assessments.`,

  "ICT-OS-60-03": `## ## Offline CDACC Mentorship Audit: ICT-OS-60-03 (Computer Networking)
### ⚠️ CRITICAL BOTTLENECK REMEDIATION REPORT
- **Unit Average**: 48% (NYC) | **Attendance**: 70% (⚠️ WARNING: BELOW EXAMINATION PERMISSIONS THRESHOLD of 75%)
- **PoE Binder Status**: In Progress - Missing critical physical verification reports.

### ⚠️ Performance Bottlenecks & Critical Risks
- **Attendance Alert (70%)**: You are currently below the required 75% class attendance threshold to qualify for national registration. It is critical to attend all remaining makeup lab sessions.
- **NYC Continuances (48%)**: Your initial CAT 1 marks was graded "Not Yet Competent" (below 50%). You need a reassessment on IPv4 Classless Inter-Domain Routing (CIDR) calculations.

### 📋 Action Plan & Remedial Strategies
1. **Remedial Subnetting Practicum**: Request a remedial CAT re-sit on VLSM addressing lists. (Score >= 50% required).
2. **UTP Termination Evidence**: Upload high-resolution photographs of your custom terminated RJ-45 Cat6 patch cable (verified green on analogue tester) to secure PoE marks.
3. **Attendance Restoration**: Coordinate with school assessor Mr. Kiprop to register 8 makeup lab hours before registration lock.`,

  "ICT-OS-60-04": `## ## Offline CDACC Mentorship Audit: ICT-OS-60-04 (Database Systems)
###  Overview of CDACC Continuous Progress
- **Unit Average Score**: 45% (NYC) | **Attendance**: 80%
- **PoE Binder Integrity**: Not Started.

### ⚠️ Performance Bottlenecks & Critical Risks
- **NYC marks (45%)**: Your relational normalization tests failed to reach 50%. SQL JOIN algorithms are causing delays.
- **Portfolio Gap**: No Entity-Relationship diagrams are signed off in the portfolio binder yet.

### 📋 Action Plan & Remedial Strategies
1. **Normalization Drills**: Re-test 1NF to 3NF decompositions using online practice sets.
2. **Mock ERD Submission**: Draw a full enterprise relational database mapping and submit it to assessor by Friday to secure an "In-Progress" PoE status.`,

  "ICT-OS-60-05": `## ## Offline CDACC Mentorship Audit: ICT-OS-60-05 (Application Development)
###  Overview of CDACC Continuous Progress
- **Unit Average Score**: 78% | **Attendance**: 90%
- **PoE Binder Integrity**: Ready for CDACC External Evaluation.

### ⚠️ Performance Bottlenecks & Portfolio Security
- **Outstanding Competence**: Excellent marks in coding logic! GitHub history is populated with clean modular commits.
- **Continuous assessment status**: 100% Competent.

### 📋 Action Plan & Practical Reminders
1. **REST Integration**: Ensure clean error boundary catches are written for APIs.
2. **Internal Assessment Mock**: Audit Jest or JUnit testing scripts to guarantee perfect code safety marks under board examiners.`,
};

export default function AICoachAdvisor({
  data,
  preSelectedUnitCode,
  onClearPreSelectedUnitCode,
}: AICoachAdvisorProps) {
  const [activeTab, setActiveTab] = useState<"diagnostic" | "chat" | "study-plan">("diagnostic");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string>("");
  const [diagnosticError, setDiagnosticError] = useState<string>("");
  const [focusUnit, setFocusUnit] = useState<string>("");
  const [offlineBrainEnabled, setOfflineBrainEnabled] = useState<boolean>(false);

  // Stateful multiple chat sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem("cdacc_coach_sessions_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "session-tvet-intro",
        title: "Default TVET Advisor",
        messages: [
          {
            role: "model",
            text: "Sasa Derrick! I am your TVET CDACC Mentor. Ask me any syllabus questions, request remedial CAT preparation questions, or ask about practical PoE evidence templates. How can I help you today?",
          },
        ],
        updatedAt: new Date().toISOString()
      }
    ];
  });
  const [activeSessionId, setActiveSessionId] = useState<string>("session-tvet-intro");
  
  // Quick inputs
  const [userInput, setUserInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Study Planner States
  const [plannerUnit, setPlannerUnit] = useState<string>(data.units[0]?.code || "");
  const [studyPace, setStudyPace] = useState<"Standard" | "Determined" | "Aggressive">("Standard");
  const [studyObjective, setStudyObjective] = useState<"Syllabus" | "Portfolio" | "CATs">("Syllabus");
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>(() => {
    try {
      const saved = localStorage.getItem("cdacc_study_weekly_plans");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return [];
  });

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
  }, [sessions, activeSessionId, isSendingMessage]);

  useEffect(() => {
    localStorage.setItem("cdacc_coach_sessions_v2", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (weeklyPlans.length > 0) {
      localStorage.setItem("cdacc_study_weekly_plans", JSON.stringify(weeklyPlans));
    }
  }, [weeklyPlans]);

  // Active Chats helper
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const chatHistory = activeSession ? activeSession.messages : [];

  const handleCreateNewSession = () => {
    const newId = "session-" + Math.random().toString(36).substring(2, 9);
    const newSession: ChatSession = {
      id: newId,
      title: `Mentorship Dialogue ${sessions.length + 1}`,
      messages: [
        {
          role: "model",
          text: "Sasa! This is a fresh mentorship channel. Select a quick TVET topic or ask your own question to start diagnostic revision.",
        }
      ],
      updatedAt: new Date().toISOString()
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      alert("You must keep at least one active chat session.");
      return;
    }
    const nextSessions = sessions.filter(s => s.id !== idToDelete);
    setSessions(nextSessions);
    if (activeSessionId === idToDelete) {
      setActiveSessionId(nextSessions[0].id);
    }
  };

  const playSynthesizedTone = () => {
    try {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {}
  };

  const handleRunDiagnostic = async (overrideFocus?: string) => {
    setIsAnalyzing(true);
    setDiagnosticError("");
    const unitToken = overrideFocus !== undefined ? overrideFocus : focusUnit;

    // Elegant fallback simulation check
    if (offlineBrainEnabled) {
      // Simulate real-time delay
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const text = unitToken && OFFLINE_COMPETENCY_AUDITS[unitToken]
        ? OFFLINE_COMPETENCY_AUDITS[unitToken]
        : `## ## Offline CDACC Comprehensive Program Audit
### 🎓 Student Profile Overview
- **Student Profile**: Derrick Ngure
- **Program of Study**: CDACC Technical Portfolio (Level 6)
- **Cumulative Competency Quotient**: ${Math.round(data.units.filter(u => u.competenceStatus === CompetenceStatus.COMPETENT).length / (data.units.length || 1) * 100)}%

### ⚠️ Critical Alerts & National Assessment Risks
- **Urgent Code Red (ICT-OS-60-03)**: Class attendance is **70%**, which fails the national 75% examinations registry rule. Critical makeup lab periods are required in CIDR addressing tasks.
- **NYC Continuances (Assessments)**: You recorded less than 50% in initial Computer Networking assessments. A structured CAT retake is strongly advised to achieve CBET standards.

### 📋 Actionable Remedial Steps
1. **Secure Portfolios First**: Bind signed lab records for practical networking terminals (Cat6 assembly) to achieve "Ready for Assessment" grades.
2. **Engage Makeup Labs**: Complete 2 additional hours of practical instruction with Supervisor Kiprop.
3. **Trigger Practice CATs**: Use the Study Planner tab or Chat Assistant to practice CDACC level questions!`;

      setDiagnosticResult(text);
      setIsAnalyzing(false);
      playSynthesizedTone();
      return;
    }

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
      playSynthesizedTone();
    } catch (err: any) {
      console.error(err);
      // Fallback automatically to high-fidelity simulated response instead of dead error block
      setOfflineBrainEnabled(true);
      const simulatedText = unitToken && OFFLINE_COMPETENCY_AUDITS[unitToken]
        ? OFFLINE_COMPETENCY_AUDITS[unitToken]
        : `## ## Offline CDACC General Program Diagnostic
- **Core Averages**: Mapped successfully.
- **System status**: Running in persistent offline CBET verification mode.

### 📋 Action Plan:
1. Revise network architectures using Packet Tracer practice labs.
2. Ensure you attend scheduled remedial seminars before CDACC Registrar deadlines.`;
      setDiagnosticResult(simulatedText);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isSendingMessage) return;

    const currentMessage = userInput;
    setUserInput("");
    
    // Add user message to history in current session
    const updatedMessages = [...chatHistory, { role: "user" as const, text: currentMessage }];
    const updatedSessions = sessions.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: updatedMessages,
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    });
    setSessions(updatedSessions);
    setIsSendingMessage(true);

    if (offlineBrainEnabled) {
      await new Promise(r => setTimeout(r, 900));
      let responseText = `### 💡 Offline TVET Mentor Advice
Thank you for your question: *"${currentMessage}"*. Here is a practical CDACC-compliant explanation:

1. **Continuous Assessments (CATs)**: Under Kenya Technical and Vocational Board standards, all core competencies require at least **50%** marks to be termed "Competent".
2. **Weekly Remedials**: If your continuous tasks fall short, request local reassessments immediately. Make sure to complete signed lab sheets in your PoE binder before registration dates.
3. **Sample Study Concept**: Check out the **"Study Planner"** tab on the dashboard to build a 4-week task checklist for revision!`;

      const msgLower = currentMessage.toLowerCase();
      if (msgLower.includes("subnet") || msgLower.includes("ip") || msgLower.includes("vlsm")) {
        responseText = `### 🔌 Custom Cisco CIDR Subnetting Practicum Task
Here is an official Level 6 Computer Networking practice problem with answers:

- **Prompt**: A newly established TVET computer lab has 28 host machines. You have been assigned the base network range \`192.168.10.0/24\`. Design a custom VLSM segment.
- **Remedial Explanation**:
  - Since we require 28 host nodes, the hosts pool must support $2^5 - 2 = 30$ machines.
  - This requires a \`/27\` subnet mask (\`255.255.255.224\`).
  - **Subnet Address Allocation**: \`192.168.10.0/27\`
  - **Usable IP Pool Range**: \`192.168.10.1\` to \`192.168.10.30\`
  - **Broadcast Address**: \`192.168.10.31\`

**PoE Binder Deliverable**: Re-draw this VLSM address map in your practical workbook. Submit to the assessor for signature logs before External week!`;
      } else if (msgLower.includes("poe") || msgLower.includes("portfolio") || msgLower.includes("evidence")) {
        responseText = `### 📁 TVET Portfolio of Evidence (PoE) Binder Standards
To verify competencies for External National Examiners, your portfolio binder MUST have:

1. **Continuous Assessment Tests Logs**: Signed CAT scripts graded above 50%.
2. **Assessor Field Sign-offs**: Specific checklists validating practical machinery handling, cooking, or coding terminals.
3. **Trainee Assessment Entry Form**: Form signed by you, the school internal assessor, and verified by external panel staff.

*Recommendation*: Check our CDACC PoE progress matrix on the summary panels to ensure zero gaps!`;
      }

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...updatedMessages, { role: "model", text: responseText }],
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      }));
      setIsSendingMessage(false);
      return;
    }

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentMessage,
          chatHistory: updatedMessages.slice(-6), 
        }),
      });

      if (!response.ok) {
        throw new Error("Chat assistant server is offline.");
      }

      const resData = await response.json();
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...updatedMessages, { role: "model", text: resData.reply }],
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      }));
    } catch (err: any) {
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [
              ...updatedMessages,
              {
                role: "model",
                text: "Pole sana, connecting to online services timed out. Running in local fallback coaching mode. You can continue typing to consult offline resources!",
              },
            ],
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      }));
      setOfflineBrainEnabled(true);
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

  // Compile full dynamic weekly calendar study guide checklist
  const handleCompileStudyPlan = () => {
    const selectedUnitName = data.units.find(u => u.code === plannerUnit)?.name || plannerUnit;
    
    // Generate tailored tasks depending on selected Trade preset objectives
    const planFocus = studyObjective === "Syllabus" 
      ? "Comprehensive Curriculum Syllabus and Theory review"
      : studyObjective === "Portfolio"
      ? "Practical Portfolio Evidence checklist and sign-off preparations"
      : "High-yield continuous practice test prep";

    const baseTasks: { [key: string]: string[][] } = {
      "Syllabus": [
        ["Read course guide, outline core sub-topics", "Construct flashcards of definitions"],
        ["Review practical case study parameters", "Solve introductory chapter challenges"],
        ["Draft summary summaries of advanced modules", "Peer discuss engineering models with peers"],
        ["Attempt full end-term program assessment review", "Clear diagnostic theory gap sheets"]
      ],
      "Portfolio": [
        ["Audit required PoE form list in syllabus", "Prepare binder directories and tags"],
        ["Assemble and print practical evidence logs", "Crimp physical samples or take photo portfolios"],
        ["Submit assessment logs to TVET Instructor", "Coordinate missing signatures verification"],
        ["Review complete portfolios with external assessor", "Pre-pack final signed work binder securely"]
      ],
      "CATs": [
        ["Solve model test question paper 1 (timed)", "Highlight weak formulae sections"],
        ["Attempt diagnostic practical speed test challenge", "Participate in teacher remedial review"],
        ["Complete timed mock exams paper 2", "Review wrong questions diagnostics with AI Coach"],
        ["Final rapid fire quiz review", "Relax and prepare for assessment registration papers"]
      ]
    };

    const selections = baseTasks[studyObjective] || baseTasks["Syllabus"];

    const generated: WeeklyPlan[] = [
      {
        weekNo: 1,
        focus: `Foundations of ${selectedUnitName}`,
        tasks: [
          { id: `task-1-1`, title: selections[0][0], category: "Theory", completed: false },
          { id: `task-1-2`, title: selections[0][1], category: "Theory", completed: false },
          { id: `task-1-3`, title: `CAT Quiz: Basic ${plannerUnit} introductory terms`, category: "CAT Prep", completed: false }
        ]
      },
      {
        weekNo: 2,
        focus: `Practical Application & Laboratorial Terminology`,
        tasks: [
          { id: `task-2-1`, title: selections[1][0], category: "PoE Evidence", completed: false },
          { id: `task-2-2`, title: selections[1][1], category: "PoE Evidence", completed: false },
          { id: `task-2-3`, title: `Midterm check: Complete practical assessment 1`, category: "CAT Prep", completed: false }
        ]
      },
      {
        weekNo: 3,
        focus: `Integration, Normalization & High-yield Review`,
        tasks: [
          { id: `task-3-1`, title: selections[2][0], category: "Theory", completed: false },
          { id: `task-3-2`, title: selections[2][1], category: "Theory", completed: false },
          { id: `task-3-3`, title: `Assess performance margins and core limits`, category: "PoE Evidence", completed: false }
        ]
      },
      {
        weekNo: 4,
        focus: `Simulation Week & Board Examinations Readiness`,
        tasks: [
          { id: `task-4-1`, title: selections[3][0], category: "CAT Prep", completed: false },
          { id: `task-4-2`, title: selections[3][1], category: "CAT Prep", completed: false },
          { id: `task-4-3`, title: `Settle final external log-sheets for ${plannerUnit}`, category: "PoE Evidence", completed: false }
        ]
      }
    ];

    setWeeklyPlans(generated);
  };

  const handleToggleTask = (weekIndex: number, taskId: string) => {
    const updated = [...weeklyPlans];
    const task = updated[weekIndex].tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      setWeeklyPlans(updated);
    }
  };

  const handleAskAIToRefinePlan = (weekNo: number, weekFocus: string) => {
    const refinedMsg = `Help me refine my Week ${weekNo} TVET CDACC study plan for ${focusUnit || plannerUnit}. The current focus is: "${weekFocus}". Give me concrete syllabus concepts to study, specific exercises, and a challenge practical task!`;
    setUserInput(refinedMsg);
    setActiveTab("chat");
  };

  // Simple clean helper to render Markdown-like segments
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-xs font-bold text-slate-850 mt-4 mb-1.5 font-display flex items-center gap-1"><Lightbulb className="h-4 w-4 text-emerald-500" /> {line.substring(4)}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1 mt-4 mb-2 font-display">{line.substring(3)}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={idx} className="text-sm font-black text-emerald-850 mt-5 mb-2.5 font-display uppercase tracking-wider">{line.substring(2)}</h2>;
      }
      
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const content = line.trim().substring(2);
        return (
          <li key={idx} className="list-disc ml-5 text-xs text-slate-650 leading-relaxed mb-1 font-sans">
            {parseInlineStyles(content)}
          </li>
        );
      }
      
      if (line.trim() === "") return <div key={idx} className="h-1.5"></div>;
      
      return (
        <p key={idx} className="text-[11.5px] text-slate-600 leading-relaxed mb-2 font-sans">
          {parseInlineStyles(line)}
        </p>
      );
    });
  };

  const parseInlineStyles = (txt: string) => {
    const parts = [];
    let currentIdx = 0;
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(txt)) !== null) {
      const precedingText = txt.substring(currentIdx, match.index);
      if (precedingText) parts.push(precedingText);
      parts.push(<strong key={match.index} className="font-bold text-slate-800">{match[1]}</strong>);
      currentIdx = boldRegex.lastIndex;
    }
    
    const remainingText = txt.substring(currentIdx);
    if (remainingText) {
      const codeRegex = /`(.*?)`/g;
      let codeMatch;
      const subParts = [];
      let subIdx = 0;
      
      while ((codeMatch = codeRegex.exec(remainingText)) !== null) {
        const subPre = remainingText.substring(subIdx, codeMatch.index);
        if (subPre) subParts.push(subPre);
        subParts.push(
          <code key={codeMatch.index} className="bg-slate-100 text-emerald-750 font-mono text-[10px] px-1 py-0.5 rounded border border-slate-200">
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
      
      {/* COLUMN 1: CONTROLS & SEED TOPICS & SESSION LIST */}
      <div className="space-y-4">
        
        {/* TAB CONTROL CONTAINER */}
        <div className="bg-slate-900 text-white rounded-2xl p-1.5 flex gap-1 shadow-sm border border-slate-800">
          <button
            onClick={() => setActiveTab("diagnostic")}
            className={`flex-1 text-[11px] py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "diagnostic" ? "bg-emerald-600 text-white shadow" : "hover:text-white text-slate-400"}`}
          >
            <Brain className="h-3.5 w-3.5" /> CDACC Audit
          </button>
          
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 text-[11px] py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "chat" ? "bg-emerald-600 text-white shadow" : "hover:text-white text-slate-400"}`}
          >
            <MessageSquare className="h-3.5 w-3.5" /> Chat Advisor
          </button>

          <button
            onClick={() => {
              setActiveTab("study-plan");
              if (weeklyPlans.length === 0) {
                handleCompileStudyPlan();
              }
            }}
            className={`flex-1 text-[11px] py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "study-plan" ? "bg-emerald-600 text-white shadow" : "hover:text-white text-slate-400"}`}
          >
            <Calendar className="h-3.5 w-3.5" /> Study Plan
          </button>
        </div>

        {/* STUDY UNIT TARGET PANEL */}
        {activeTab === "diagnostic" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 animate-fade-in">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-emerald-600" /> Audit Scope
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Focus Unit</label>
                <select
                  value={focusUnit}
                  onChange={(e) => setFocusUnit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                className="w-full bg-slate-900 border border-slate-850 hover:bg-slate-800 text-white hover:text-emerald-300 transition-all font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-inner cursor-pointer disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> auditing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" /> Run CBET Audit
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* CHAT SESSION LIST - DISPLAYED ONLY ON CHAT TAB */}
        {activeTab === "chat" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm animate-fade-in space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                Advisory Journals
              </span>
              <button
                onClick={handleCreateNewSession}
                className="text-[10px] font-bold text-emerald-600 hover:text-white hover:bg-emerald-650 bg-emerald-50 px-2.5 py-1 rounded-lg transition"
              >
                + Start New
              </button>
            </div>

            <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1 scrollable">
              {sessions.map(s => (
                <div
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={`p-2.5 rounded-xl text-left cursor-pointer transition flex items-center justify-between text-xs font-medium border ${activeSessionId === s.id ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-650 border-slate-100 hover:bg-slate-100/70"}`}
                >
                  <div className="truncate pr-2">
                    <p className="font-semibold truncate">{s.title}</p>
                    <p className={`text-[9px] mt-0.5 opacity-60`}>
                      Last update: {new Date(s.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(s.id, e)}
                    className={`hover:bg-rose-500 hover:text-white p-1 rounded transition text-slate-400`}
                    title="Delete session"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STUDY PLAN CONFIGURATOR PANELS */}
        {activeTab === "study-plan" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm animate-fade-in space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-750 font-mono flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-emerald-650" /> Program Modulations
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-0.5">Focus Syllabus Unit</label>
                <select
                  value={plannerUnit}
                  onChange={(e) => setPlannerUnit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium"
                >
                  {data.units.map(u => (
                    <option key={u.id} value={u.code}>{u.code} - {u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-0.5">Study Pacing</label>
                <div className="grid grid-cols-3 gap-1">
                  {(["Standard", "Determined", "Aggressive"] as const).map(pace => (
                    <button
                      key={pace}
                      onClick={() => setStudyPace(pace)}
                      className={`py-1.5 rounded-lg text-[10px] font-semibold transition ${studyPace === pace ? "bg-slate-900 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-650"}`}
                    >
                      {pace === "Standard" ? "Steady" : pace === "Determined" ? "Focused" : "Sprint"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[9.5px] uppercase font-bold text-slate-400 mb-0.5">Core Priority</label>
                <div className="grid grid-cols-3 gap-1">
                  {(["Syllabus", "Portfolio", "CATs"] as const).map(obj => (
                    <button
                      key={obj}
                      onClick={() => setStudyObjective(obj)}
                      className={`py-1.5 rounded-lg text-[10px] font-semibold transition ${studyObjective === obj ? "bg-slate-900 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-655"}`}
                    >
                      {obj === "Syllabus" ? "Theory" : obj === "Portfolio" ? "PoE" : "Exams"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCompileStudyPlan}
                className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-700 transition cursor-pointer shadow-sm"
              >
                Compile Plan Calendar
              </button>
            </div>
          </div>
        )}

        {/* QUICK QUESTION CARDS / OFFLINE TOGGLE */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-4 rounded-2xl text-white shadow-md border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-400 flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5 animate-pulse" /> TVET CDACC Support
            </h4>
            
            <button
              onClick={() => {
                setOfflineBrainEnabled(!offlineBrainEnabled);
                playSynthesizedTone();
              }}
              className={`px-2 py-1 rounded-lg text-[8.5px] font-mono uppercase font-black tracking-widest transition-all ${offlineBrainEnabled ? "bg-amber-550 text-slate-900 border border-amber-400" : "bg-emerald-600/30 text-emerald-300 border border-emerald-500/30"}`}
              title="Toggle between real Gemini Claude-based cloud API and offline local simulator fallback"
            >
              {offlineBrainEnabled ? "● Local Offline" : "⚡ Cloud Live"}
            </button>
          </div>

          <p className="text-[10.5px] text-indigo-200 leading-relaxed">
            Click any core study question to load explanations and practical troubleshooting guides:
          </p>
          
          <div className="space-y-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestionClick(q.text)}
                className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-[10px] font-medium leading-relaxed text-indigo-100 flex items-center justify-between"
              >
                <span className="truncate mr-2">{q.label}</span>
                <ChevronRight className="h-3 w-3 shrink-0 text-emerald-400" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* COLUMN 2 & 3: MAIN VIEW SCREEN */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col min-h-[460px]">
        
        {/* DIAGNOSTIC AUDIT CONTAINER */}
        {activeTab === "diagnostic" && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-emerald-605 bg-emerald-50 p-1 rounded-lg text-emerald-600" />
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

              {diagnosticError && !offlineBrainEnabled && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">Full Stack Service Connection</p>
                    <p className="opacity-90 leading-relaxed mt-0.5">{diagnosticError}</p>
                    <button
                      onClick={() => {
                        setOfflineBrainEnabled(true);
                        handleRunDiagnostic();
                      }}
                      className="mt-2 text-[10.5px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg transition"
                    >
                      Use Simulated Offline Expert Core
                    </button>
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
                  {offlineBrainEnabled && (
                    <div className="mb-3 px-3 py-1 bg-amber-50 rounded-lg border border-amber-200/50 text-[10px] text-amber-800 font-semibold inline-flex items-center gap-1 font-mono">
                      <AlertCircle className="h-3 w-3" /> Offline Simulated Brain Active
                    </div>
                  )}
                  {renderMarkdown(diagnosticResult)}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-4 border border-dashed border-slate-200 rounded-2xl">
                  <Sparkles className="h-12 w-12 text-slate-300 animate-pulse" />
                  <div className="max-w-md px-6">
                    <p className="text-xs font-bold text-slate-850">No diagnostic compiled yet</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Select your scope options on the left, then click <strong>"Run CBET Audit"</strong>. The AI Mentor will process all your grades and attendance to highlight any assessment bottlenecks!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100/60 bg-white font-mono">
              <span>Backed by Gemini Content Generation</span>
              <span>CBET Continuous Assessor Compliance</span>
            </div>
          </div>
        )}

        {/* INTERACTIVE CHAT ADVISOR CONTAINER */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in">
            {/* ACTIVE SESSION TITLE HEADER */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3.5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-emerald-600" /> Current Dialogue: <span className="text-emerald-700 underline font-mono">{activeSession?.title}</span>
              </span>
              
              {offlineBrainEnabled && (
                <span className="text-[9px] font-mono px-2 py-0.5 bg-amber-50 rounded text-amber-700 border border-amber-200/50">
                  Offline Mode Active
                </span>
              )}
            </div>

            {/* CHAT CHRONOLOGY */}
            <div className="flex-1 overflow-y-auto max-h-[290px] mb-4 space-y-4 pr-1 scrollable">
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
                      {chat.role === "user" ? "Trainee" : "TVET Assessor Coach"}
                    </div>
                    {chat.role === "user" ? (
                      <p className="whitespace-pre-wrap">{chat.text}</p>
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
                      <span className="text-[10px] text-slate-400 font-medium">Mentor checking CDACC frameworks...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* SEND MESSAGE FIELD */}
            <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-105 pt-3 border-slate-200">
              <input
                type="text"
                placeholder="Ask about VLSM subnets, standard PoE checklists, CAT re-takes criteria..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isSendingMessage}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isSendingMessage || !userInput.trim()}
                className="bg-emerald-600 text-white p-2 text-xs font-bold rounded-xl hover:bg-emerald-700 transition flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* WEEKLY STUDY PLAN WORKBOARD CHECKLISTS */}
        {activeTab === "study-plan" && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-850">Dynamic Weekly Revision Scheduler</h3>
                    <p className="text-[10px] text-slate-400">Adjust weekly checks below to maintain continuous compliance</p>
                  </div>
                </div>
                {weeklyPlans.length > 0 && (
                  <div className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                    {Math.round((weeklyPlans.flatMap(w => w.tasks).filter(t => t.completed).length / (weeklyPlans.flatMap(w => w.tasks).length || 1)) * 100)}% Done
                  </div>
                )}
              </div>

              {weeklyPlans.length === 0 ? (
                <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  <Calendar className="h-10 w-10 text-slate-350 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-bold text-slate-800">No Study Plan compiled yet</p>
                  <p className="text-[10.5px] text-slate-400 max-w-sm mx-auto leading-relaxed mt-1">
                    Select your focus unit and intensiveness variables on the left controls pane, then click <strong>"Compile Plan Calendar"</strong> to launch!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-[330px] pr-1.5 scrollable pb-2">
                  {weeklyPlans.map((week, weekIdx) => (
                    <div key={week.weekNo} className="border border-slate-100 bg-slate-50/20 rounded-xl p-3.5 space-y-2">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-1.5">
                        <div>
                          <span className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-emerald-600">Week {week.weekNo} Milestone</span>
                          <h4 className="text-xs font-bold text-slate-800 mt-0.5">{week.focus}</h4>
                        </div>
                        <button
                          onClick={() => handleAskAIToRefinePlan(week.weekNo, week.focus)}
                          className="flex items-center gap-1 text-[9.5px] font-black text-indigo-650 hover:underline hover:text-indigo-805"
                          title="Ask advisor chatbot to give remedial practice exercises on this week"
                        >
                          <Sparkles className="h-3 w-3 text-emerald-500 fill-emerald-500" /> Detail with AI
                        </button>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {week.tasks.map(task => (
                          <div 
                            key={task.id} 
                            onClick={() => handleToggleTask(weekIdx, task.id)}
                            className="flex items-start gap-2 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition text-[11px]"
                          >
                            <div className="mt-0.5">
                              {task.completed ? (
                                <div className="h-4 w-4 bg-emerald-500 text-white rounded flex items-center justify-center">
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="h-4 w-4 border border-slate-300 rounded bg-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${task.completed ? "line-through text-slate-400" : "text-slate-700"}`}>
                                {task.title}
                              </p>
                              <span className={`text-[8.5px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded leading-none inline-block mt-1 ${task.category === "Theory" ? "bg-slate-100 text-slate-500" : task.category === "PoE Evidence" ? "bg-indigo-50 text-indigo-700" : "bg-amber-50 text-amber-700"}`}>
                                {task.category}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Interactive Checklist state saves locally</span>
              <span className="text-indigo-600 block hover:underline cursor-pointer" onClick={() => { localStorage.removeItem("cdacc_study_weekly_plans"); setWeeklyPlans([]); }}>Reset Schedule Grid</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
