/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from "jspdf";
import { CDACCDashboardData, UnitOfLearning } from "../types.ts";

export function exportCDACCTranscriptToPDF(data: CDACCDashboardData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const PAGE_HEIGHT = 297;
  const MARGIN_LEFT = 15;
  const MARGIN_RIGHT = 195;
  const CONTENT_WIDTH = 180;
  
  let y = 12;

  // Helper function to check page boundaries and add page
  const checkPageEnd = (neededHeight: number) => {
    if (y + neededHeight > PAGE_HEIGHT - 15) {
      doc.addPage();
      drawPageBorder();
      y = 15;
      return true;
    }
    return false;
  };

  // Helper to draw clean borders on every page
  const drawPageBorder = () => {
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.rect(8, 8, 210 - 16, 297 - 16);
    
    // Draw subtle watermarks/footers on page corners
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7);
    doc.setFillColor(148, 163, 184); // slate-400
    doc.text("Kenya National Qualifications Framework (KNQF) Tracker • Official Copy", 15, 297 - 11);
    doc.text(`Generated on: ${new Date().toLocaleDateString("en-KE")} ${new Date().toLocaleTimeString("en-KE")}`, 145, 297 - 11);
  };

  // 1. Initial Page Border & Kenya Accent Banner
  drawPageBorder();
  
  // Kenyan National Colors top accent flag line (Black, Red, Green, Gold)
  doc.setLineWidth(1.2);
  doc.setDrawColor(0, 0, 0); // Black
  doc.line(8, 8, 202, 8);
  doc.setDrawColor(186, 12, 47); // Red
  doc.line(8, 9.2, 202, 9.2);
  doc.setDrawColor(0, 104, 56); // Green
  doc.line(8, 10.4, 202, 10.4);

  y = 20;

  // 2. INSTITUTION OFFICIAL CREST & REPORT TITLE
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("REPUBLIC OF KENYA", 105, y, { align: "center" });
  y += 5;
  
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text("MINISTRY OF EDUCATION | STATE DEPARTMENT FOR TVET", 105, y, { align: "center" });
  y += 5;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(4, 120, 87); // emerald-700 primary
  doc.text("TVET CURRICULUM DEVELOPMENT ASSESSMENT & CERTIFICATION COUNCIL", 105, y, { align: "center" });
  y += 4.5;

  doc.setFontSize(9);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("OFFICIAL LEARNER COMPETENCE DOSSIER (LEVEL 6 CAPABILITY TRANSCRIPT)", 105, y, { align: "center" });
  y += 6;

  // Double thin separator
  doc.setLineWidth(0.4);
  doc.setDrawColor(148, 163, 184); // slate-400
  doc.line(15, y, 195, y);
  y += 0.8;
  doc.line(15, y, 195, y);
  y += 8;

  // 3. STUDENT INDIVIDUALIZED METADATA PROFILE BOX
  checkPageEnd(45);
  doc.setFillColor(248, 250, 252); // slate-50 background
  doc.setDrawColor(203, 213, 225); // slate-300 border
  doc.setLineWidth(0.3);
  doc.rect(15, y, 180, 36, "F");
  doc.rect(15, y, 180, 36, "D");

  // Grid vertical separator lines
  doc.line(100, y + 2, 100, y + 34);

  // Left column student detail markers
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text("Candidate Name:", 20, y + 7);
  doc.text("Reg / Admission No:", 20, y + 14);
  doc.text("Host Institution:", 20, y + 21);
  doc.text("Assigned Cohort:", 20, y + 28);

  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(9.5);
  doc.text(data.student.name.toUpperCase(), 53, y + 7);
  doc.setFont("Helvetica", "bold");
  doc.text(data.student.admissionNo, 53, y + 14);
  doc.text(data.student.institution, 53, y + 21);
  doc.text(data.student.cohort, 53, y + 28);

  // Right column certificate details
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Course of Study:", 105, y + 7);
  doc.text("Qualification Type:", 105, y + 14);
  doc.text("Assessed Syllabus:", 105, y + 21);
  doc.text("Transcript Status:", 105, y + 28);

  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.text(data.student.courseName, 137, y + 7);
  doc.setFont("Helvetica", "normal");
  doc.text("TVET National Certificate L6", 137, y + 14);
  doc.text("CDACC CBET Curricula (2026)", 137, y + 21);
  
  // Highlight stamp text
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.text("ACTIVE / VERIFIED REGISTRY", 137, y + 28);

  y += 44;

  // 4. STATISTICAL PORTFOLIO SUMMARY INDICATORS
  checkPageEnd(25);
  doc.setFillColor(240, 253, 250); // green-50 BG
  doc.setDrawColor(167, 243, 208); // green-200 border
  doc.rect(15, y, 180, 16, "F");
  doc.rect(15, y, 180, 16, "D");

  // Crunch summaries numbers
  const totalRequired = data.units.reduce((sum, u) => sum + u.hoursRequired, 0);
  const totalAttended = data.units.reduce((sum, u) => sum + u.hoursAttended, 0);
  const totalAttendancePct = totalRequired > 0 ? Math.round((totalAttended / totalRequired) * 100) : 0;

  // Calc score averages
  let totalScoreSum = 0;
  let totalAssessments = 0;
  data.units.forEach(u => {
    u.assessments.forEach(a => {
      totalScoreSum += a.obtainedScore;
      totalAssessments++;
    });
  });
  const systemGradeAvg = totalAssessments > 0 ? Math.round(totalScoreSum / totalAssessments) : 0;

  // Distinctions Count
  const distinctionUnitsCount = data.units.filter(u => {
    if (u.assessments.length === 0) return false;
    const avg = Math.round(u.assessments.reduce((sum, a) => sum + a.obtainedScore, 0) / u.assessments.length);
    return avg >= 80;
  }).length;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(4, 120, 87); // emerald-700
  
  doc.text("SYLLABUS CORE KPIS:", 20, y + 6);
  
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(51, 65, 85); // slate-700
  
  doc.text("Overall Grade Avg:", 20, y + 11);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${systemGradeAvg}%`, 48, y + 11);

  doc.setFont("Helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text("Course Attendance:", 75, y + 11);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(totalAttendancePct >= 75 ? 16 : 239, totalAttendancePct >= 75 ? 185 : 68, totalAttendancePct >= 75 ? 129 : 68);
  doc.text(`${totalAttendancePct}% (Required: 75%)`, 105, y + 11);

  doc.setFont("Helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text("Syllabus Distinctions:", 145, y + 11);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${distinctionUnitsCount} Unit(s)`, 175, y + 11);

  y += 24;

  // 5. TRANSCRIPT TABLE HEADER
  checkPageEnd(18);
  doc.setFillColor(15, 23, 42); // slate-900 header
  doc.rect(15, y, 180, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.text("CODE", 18, y + 5);
  doc.text("UNIT OF LEARNING", 36, y + 5);
  doc.text("CREDITS", 115, y + 5, { align: "center" });
  doc.text("ATTENDANCE", 137, y + 5, { align: "center" });
  doc.text("AVG GRADE", 163, y + 5, { align: "center" });
  doc.text("STATUS", 185, y + 5, { align: "center" });

  y += 8;

  // 6. RECORD ROWS LOOP
  data.units.forEach((unit, index) => {
    checkPageEnd(10);
    
    // Rows styling - zebra backgrounds
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252); // slate-50
    } else {
      doc.setFillColor(255, 255, 255); // pure white
    }
    doc.rect(15, y, 180, 9, "F");

    // Row borders
    doc.setDrawColor(241, 245, 249); // slate-100
    doc.line(15, y + 9, 195, y + 9);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(unit.code, 18, y + 5.5);

    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont("Helvetica", "bold");
    // Truncate name safely to avoid line bleed
    let uName = unit.name;
    if (uName.length > 43) {
      uName = uName.substring(0, 41) + "...";
    }
    doc.text(uName, 36, y + 5.5);

    // Credit hours
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`${unit.creditHours || 0} CH`, 115, y + 5.5, { align: "center" });

    // Attendance percentages
    const attPct = unit.hoursRequired > 0 ? Math.round((unit.hoursAttended / unit.hoursRequired) * 100) : 0;
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(attPct >= 75 ? 16 : 225, attPct >= 75 ? 122 : 29, attPct >= 75 ? 87 : 72); // green or red
    doc.text(`${attPct}%`, 137, y + 5.5, { align: "center" });

    // Grade values
    let unitSumScore = 0;
    unit.assessments.forEach(a => unitSumScore += a.obtainedScore);
    const unitAvg = unit.assessments.length > 0 ? Math.round(unitSumScore / unit.assessments.length) : 0;

    doc.setTextColor(15, 23, 42);
    doc.text(`${unitAvg}%`, 163, y + 5.5, { align: "center" });

    // Competence status
    const isComp = unitAvg >= 50 && attPct >= 75;
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(isComp ? 4 : 225, isComp ? 120 : 29, isComp ? 87 : 72);
    doc.text(isComp ? "COMPETENT" : "INCOMPLETE", 185, y + 5.5, { align: "center" });

    y += 9;
  });

  y += 6;

  // 7. KEY LEGENDS BLOCK
  checkPageEnd(18);
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.rect(15, y, 180, 14, "F");
  doc.rect(15, y, 180, 14, "D");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("TVET CDACC GRADING LEGEND:", 18, y + 9);

  doc.setFont("Helvetica", "normal");
  doc.text("● Distinction: 80% - 100%", 70, y + 9);
  doc.text("● Competent: 50% - 79%", 112, y + 9);
  doc.text("● Not Yet Competent (NYC): Cut-off <50%", 148, y + 9);

  y += 24;

  // 8. FINAL OFFICIAL AUTHORIZATION SIGNATURE GRID BLOCK
  checkPageEnd(36);
  y += 4;
  doc.setLineWidth(0.35);
  doc.setDrawColor(148, 163, 184); // slate-400 signatures lines

  // Registrar Line
  doc.line(20, y + 20, 75, y + 20);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  doc.text("REGISTRAR, ACADEMIC DIVISION", 21, y + 24);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Signature Block & Institution Stamp", 21, y + 28);

  // Instructor/Expert Line
  doc.line(135, y + 20, 190, y + 20);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  doc.text("TVET / CDACC EXTERNAL ASSESSOR", 136, y + 24);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Syllabus Director & Verification Autograph", 136, y + 28);

  // Generate binary name safely
  const docFilename = `tvet_cdacc_transcript_${data.student.admissionNo.replace(/\//g, "_")}.pdf`;
  doc.save(docFilename);
}
