/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Initialize environment variables config
dotenv.config();

// Safe ESM/CJS path resolution
let serverDirname = "";
try {
  if (typeof __dirname !== "undefined" && __dirname) {
    serverDirname = __dirname;
  } else {
    const filename = fileURLToPath(import.meta.url);
    serverDirname = path.dirname(filename);
  }
} catch (e) {
  serverDirname = path.resolve();
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client helper to avoid crashes on startup if secret is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured in your application secrets. Please configure it in the Secrets panel on the top right.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Global server API Health Route
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Active Coach endpoint
app.post("/api/coach/analyze", async (req, res) => {
  try {
    const { student, units, deadlines, focusUnitCode } = req.body;
    const ai = getGeminiClient();

    const statsText = units.map((u: any) => {
      const attendancePct = Math.round((u.hoursAttended / u.hoursRequired) * 100);
      const assessmentsText = u.assessments?.map((a: any) => 
        `- ${a.title} (${a.type}): ${a.obtainedScore}% [${a.status}]`
      ).join("\n") || "No assessments recorded yet.";
      
      return `### Unit: ${u.name} (Code: ${u.code})
- Level: ${u.level} | Required Hours: ${u.hoursRequired} | Attended: ${u.hoursAttended} (${attendancePct}%)
- Portfolio of Evidence (PoE) Status: ${u.poeStatus}
- Overall CDACC Competency Status: ${u.competenceStatus}
- Continuous Assessments:
${assessmentsText}`;
    }).join("\n\n");

    const upcomingText = deadlines?.map((d: any) => 
      `- **${d.title}** (${d.type}) due on ${d.dueDate} for ${d.unitName}. Details: ${d.description}`
    ).join("\n") || "No upcoming deadlines listed.";

    let systemInstruction = `You are an expert Kenya TVET CDACC Competency-Based Education and Training (CBET) Academic Coach and Mentor. 
Your tone is professional, extremely supportive, culturally aligned, and encouraging. 
You possess vast knowledge of Technical and Vocational Education and Training (TVET) Curriculum Development, Assessment and Certification Council (CDACC) guidelines in Kenya.
Key CDACC regulations you must reference when relevant:
1. Attendance: TVET trainees MUST maintain a minimum of 75% to 80% class attendance to qualify for CDACC National Examinations registration.
2. Portfolios of Evidence (PoE): TVET CDACC is highly practical and portfolio-driven. Trainees must accumulate sheets, practical products, pictures, logs, and signed assessor records in their PoE binders before CDACC external assessments.
3. Assessment Scale: Instead of normal letter scales (A, B, C, D), trainees are marked as "Competent" (usually 50% or 60% and above in continuous tasks dependent on standard curricula) or "Not Yet Competent" (NYC) which is positive and means they need re-assessment/remedial work.

Provide feedback structured with clean, bold Markdown subheadings, bullet points, and dynamic advice for the student. Do not list JSON codes or system fields. Use terms common in Kenya (e.g. polytrechnic, National Polytechnics, TVET centers, CATs)`;

    let prompt = `Here is the student data for Derrick Ngure, pursuing CDACC courses:
Student Profile:
Name: ${student.name}
AdNo: ${student.admissionNo}
Institution: ${student.institution}
Course Course: ${student.courseName}

Units of Learning list:
${statsText}

Upcoming CDACC and Institutional Deadlines:
${upcomingText}
`;

    if (focusUnitCode) {
      prompt += `\n\nFocus specifically on assisting the student with Unit of Learning: ${focusUnitCode}. Provide targeted revision questions and core concepts for this unit.`;
    } else {
      prompt += `\n\nProvide an elegant complete mentor diagnostic of Derrick's grades, portfolio progressions, and attendance. Highlight any critical risks (e.g. any unit with attendance near/below 75%, or continuous tasks marked "Not Yet Competent" requiring revision). Give 3 high-impact strategies to guarantee his "Competent" status in his upcoming CDACC External National evaluations. Use Kenyan examples.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("AI Coach analysis failure:", error);
    res.status(500).json({ error: error.message || "Something went wrong on the server" });
  }
});

// Interactive chatbot chat route
app.post("/api/coach/chat", async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are a helpful and knowledgeable Kenya TVET CDACC Student Advisor. 
Answer questions related to Kenyan TVET courses, curricula, the Continuous Assessment Test (CAT) requirements, the Portfolio of Evidence (PoE) structures, practical logs, and CDACC national exam patterns.
Give helpful code examples if they ask about ICT units, or circuit troubleshooting steps if they ask about Electrical Installation. Keep your answers clear, concise, and structured.`;

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
      },
    });

    // Populate history if provided
    if (chatHistory && chatHistory.length > 0) {
      // The modern SDK expects standard chats creation, let's keep interactions simple and fast:
      // Send the prompt directly containing the query plus context history to ensure seamless support
    }

    const formattedPrompt = chatHistory && chatHistory.length > 0
      ? `Below is the previous conversation context:\n${chatHistory.map((h: any) => `${h.role === 'user' ? 'Student' : 'Advisor'}: ${h.text}`).join("\n")}\n\nStudent asks: ${message}`
      : message;

    const response = await chat.sendMessage({ message: formattedPrompt });
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Coach chatbot failure:", error);
    res.status(500).json({ error: error.message || "Something went wrong on the server" });
  }
});

// Wrapper async start function to avoid top-level await bundler blocks in CommonJS formatting
async function startServer() {
  // Dev environment asset routing vs Production build file routing
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Start Server on PORT 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kenya TVET CDACC Student Tracker server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
