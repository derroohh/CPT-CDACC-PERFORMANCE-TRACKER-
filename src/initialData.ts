/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CDACCDashboardData, PoEStatus, CompetenceStatus } from "./types.ts";

export const initialCDACCData: CDACCDashboardData = {
  student: {
    name: "Derrick Ngure",
    admissionNo: "TVET/KAP/ICT/2025/1043",
    courseName: "Diploma in ICT Technician (Level 6)",
    institution: "Kabete National Polytechnic, Nairobi",
    cohort: "2025/2026 Intake (Year 2, Sem 1)",
    photoUrl: "" // Will render a fallback avatar
  },
  units: [
    {
      id: "ICT-OS-60-01",
      code: "ICT/OS/60/01-A",
      name: "Apply Digital Literacy",
      level: 6,
      creditHours: 4,
      hoursRequired: 45,
      hoursAttended: 42,
      poeStatus: PoEStatus.CERTIFIED,
      competenceStatus: CompetenceStatus.COMPETENT,
      assessments: [
        {
          id: "as-1",
          title: "Introduction to Windows & Linux",
          type: "CAT",
          obtainedScore: 82,
          weight: 20,
          date: "2026-02-14",
          feedback: "Demonstrated excellent understanding of Linux filesystem structures.",
          status: CompetenceStatus.COMPETENT
        },
        {
          id: "as-2",
          title: "Office Productivity Tools Suite",
          type: "Practical Project",
          obtainedScore: 78,
          weight: 20,
          date: "2026-02-28",
          feedback: "Great formatting on standard technical specifications document.",
          status: CompetenceStatus.COMPETENT
        },
        {
          id: "as-3",
          title: "Institutional Written Exam",
          type: "Internal Exam",
          obtainedScore: 75,
          weight: 60,
          date: "2026-03-20",
          feedback: "Completed successfully. Recommend external certification.",
          status: CompetenceStatus.COMPETENT
        }
      ]
    },
    {
      id: "ICT-OS-60-02",
      code: "ICT/OS/60/02-A",
      name: "Install and Configure Computer Systems",
      level: 6,
      creditHours: 6,
      hoursRequired: 60,
      hoursAttended: 56,
      poeStatus: PoEStatus.READY_FOR_ASSESSMENT,
      competenceStatus: CompetenceStatus.COMPETENT,
      assessments: [
        {
          id: "as-4",
          title: "Motherboard & CPU Assembly",
          type: "CAT",
          obtainedScore: 70,
          weight: 20,
          date: "2026-03-05",
          feedback: "Be careful with dynamic anti-static procedures next time.",
          status: CompetenceStatus.COMPETENT
        },
        {
          id: "as-5",
          title: "Troubleshooting Operating Systems",
          type: "Practical Project",
          obtainedScore: 85,
          weight: 20,
          date: "2026-03-25",
          feedback: "Solid systematic troubleshooting and log file analysis.",
          status: CompetenceStatus.COMPETENT
        },
        {
          id: "as-6",
          title: "Installation Internal Mock Mock",
          type: "Internal Exam",
          obtainedScore: 68,
          weight: 60,
          date: "2026-04-10",
          feedback: "Excellent practical implementation; theory section needs mild revision on POST codes.",
          status: CompetenceStatus.COMPETENT
        }
      ]
    },
    {
      id: "ICT-OS-60-03",
      code: "ICT/OS/60/03-A",
      name: "Configure and Troubleshoot Computer Networks",
      level: 6,
      creditHours: 8,
      hoursRequired: 90,
      hoursAttended: 72,
      poeStatus: PoEStatus.IN_PROGRESS,
      competenceStatus: CompetenceStatus.ONGOING,
      assessments: [
        {
          id: "as-7",
          title: "IPv4 & IPv6 Subnetting CAT",
          type: "CAT",
          obtainedScore: 58,
          weight: 25,
          date: "2026-04-18",
          feedback: "Subnetting calculations were shaky. Needs more practice before final external exams.",
          status: CompetenceStatus.COMPETENT
        },
        {
          id: "as-8",
          title: "Router and Switch Configuration",
          type: "Practical Project",
          obtainedScore: 48,
          weight: 25,
          date: "2026-05-10",
          feedback: "Failed to configure static routing matrices correctly. Scheduled for remedial training.",
          status: CompetenceStatus.NOT_YET_COMPETENT
        }
      ]
    },
    {
      id: "ICT-OS-60-04",
      code: "ICT/OS/60/04-A",
      name: "Perform Database Design and Development",
      level: 6,
      creditHours: 8,
      hoursRequired: 90,
      hoursAttended: 81,
      poeStatus: PoEStatus.IN_PROGRESS,
      competenceStatus: CompetenceStatus.ONGOING,
      assessments: [
        {
          id: "as-9",
          title: "ERD & Schema Normalization",
          type: "CAT",
          obtainedScore: 65,
          weight: 30,
          date: "2026-05-02",
          feedback: "Good grasp of 3rd Normal Form. Some relations were missing foreign keys.",
          status: CompetenceStatus.COMPETENT
        },
        {
          id: "as-10",
          title: "Pl/SQL Store Procedures Implementation",
          type: "Practical Project",
          obtainedScore: 72,
          weight: 30,
          date: "2026-05-18",
          feedback: "Excellent database access optimization.",
          status: CompetenceStatus.COMPETENT
        }
      ]
    },
    {
      id: "ICT-OS-60-05",
      code: "ICT/OS/60/05-A",
      name: "Design and Develop Computer Applications",
      level: 6,
      creditHours: 10,
      hoursRequired: 120,
      hoursAttended: 102,
      poeStatus: PoEStatus.IN_PROGRESS,
      competenceStatus: CompetenceStatus.ONGOING,
      assessments: [
        {
          id: "as-11",
          title: "Object Oriented Design & Patterns",
          type: "CAT",
          obtainedScore: 74,
          weight: 20,
          date: "2026-04-20",
          feedback: "Excellent object modeling. Design patterns correctly implemented.",
          status: CompetenceStatus.COMPETENT
        },
        {
          id: "as-12",
          title: "Full-Stack React + Node CRUD Task",
          type: "Practical Project",
          obtainedScore: 82,
          weight: 30,
          date: "2026-05-15",
          feedback: "Outstanding application with robust error handlers and delightful styles.",
          status: CompetenceStatus.COMPETENT
        }
      ]
    },
    {
      id: "BUS-OS-01",
      code: "BUS/OS/01-A",
      name: "Apply Communication Skills",
      level: 6,
      creditHours: 4,
      hoursRequired: 45,
      hoursAttended: 40,
      poeStatus: PoEStatus.CERTIFIED,
      competenceStatus: CompetenceStatus.COMPETENT,
      assessments: [
        {
          id: "as-13",
          title: "Written CAT on Corporate Communications",
          type: "CAT",
          obtainedScore: 90,
          weight: 30,
          date: "2026-02-10",
          feedback: "Exceptional memorandum and minutes formatting expertise.",
          status: CompetenceStatus.COMPETENT
        },
        {
          id: "as-14",
          title: "Presentation Skills Assessment",
          type: "Practical Project",
          obtainedScore: 85,
          weight: 70,
          date: "2026-03-01",
          feedback: "Confident speaking, crisp slides, and clear response to questions.",
          status: CompetenceStatus.COMPETENT
        }
      ]
    }
  ],
  deadlines: [
    {
      id: "dl-1",
      unitId: "ICT-OS-60-03",
      unitName: "Configure and Troubleshoot Computer Networks",
      title: "Router Remedial Configuration Assessment",
      dueDate: "2026-06-03",
      type: "Practical Prep",
      description: "Repeat assignment for router config assessment. Focus on static trunk configuration and ripv2 dynamic route entries.",
      completed: false
    },
    {
      id: "dl-2",
      unitId: "ICT-OS-60-04",
      unitName: "Perform Database Design and Development",
      title: "Submit PoE Portfolio Binder of Evidence",
      dueDate: "2026-06-08",
      type: "PoE Submission",
      description: "Submit all continuous assessment forms, checked CAT scripts, and verified practical assignment sheets signed by instructor.",
      completed: false
    },
    {
      id: "dl-3",
      unitId: "ICT-OS-60-05",
      unitName: "Design and Develop Computer Applications",
      title: "Continuous Assessment Test 2 (Systems Architectures)",
      dueDate: "2026-06-12",
      type: "Internal CAT",
      description: "Theory written CAT covering MVC design pattern, REST APIs, Microservices patterns, and caching mechanics.",
      completed: false
    },
    {
      id: "dl-4",
      unitId: "ICT-OS-60-02",
      unitName: "Install and Configure Computer Systems",
      title: "Institutional Final Internal Practical Examination",
      dueDate: "2026-06-20",
      type: "Institutional Exam",
      description: "4-hour practical lab configuring active directory domains, installing RAID 5, and setting up file backups and folder security permissions.",
      completed: false
    },
    {
      id: "dl-5",
      unitId: "ICT-OS-60-03",
      unitName: "Configure and Troubleshoot Computer Networks",
      title: "CDACC National Final External Examination (Theory)",
      dueDate: "2026-07-06",
      type: "CDACC National Exam",
      description: "CDACC national written assessment of 3 hours. Compulsory national paper registered online via the CDACC portal.",
      completed: false
    }
  ],
  attendanceLogs: [
    {
      id: "att-1",
      unitId: "ICT-OS-60-03",
      unitName: "Configure and Troubleshoot Computer Networks",
      unitCode: "ICT/OS/60/03-A",
      date: "2026-05-20",
      duration: 3,
      status: "Present",
      remarks: "Router interface subnet configurations lab practical."
    },
    {
      id: "att-2",
      unitId: "ICT-OS-60-03",
      unitName: "Configure and Troubleshoot Computer Networks",
      unitCode: "ICT/OS/60/03-A",
      date: "2026-05-22",
      duration: 3,
      status: "Absent (Unexcused)",
      remarks: "Missed session due to local travel delays."
    },
    {
      id: "att-3",
      unitId: "ICT-OS-60-05",
      unitName: "Design and Develop Computer Applications",
      unitCode: "ICT/OS/60/05-A",
      date: "2026-05-25",
      duration: 4,
      status: "Present",
      remarks: "React hook forms and dynamic state management models."
    },
    {
      id: "att-4",
      unitId: "ICT-OS-60-04",
      unitName: "Perform Database Design and Development",
      unitCode: "ICT/OS/60/04-A",
      date: "2026-05-26",
      duration: 3,
      status: "Present",
      remarks: "PL/SQL triggers and store functions audit session."
    }
  ]
};
