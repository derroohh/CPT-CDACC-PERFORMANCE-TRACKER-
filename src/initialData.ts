/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CDACCDashboardData, PoEStatus, CompetenceStatus } from "./types.ts";

/**
 * Robust Kenyan CDACC Curricula Catalogue
 * Maps Level 6 Diploma pathways to their official national units, standards, and topics.
 */
export const CDACC_CURRICULA_PRESETS: Record<string, CDACCDashboardData> = {
  ict: {
    student: {
      name: "Derrick Ngure",
      admissionNo: "TVET/KAP/ICT/2025/1043",
      courseName: "Diploma in ICT Technician (Level 6)",
      institution: "Kabete National Polytechnic, Nairobi",
      cohort: "2025/2026 Intake (Year 2, Sem 1)",
      photoUrl: "",
      email: "derrickngure39@gmail.com"
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
            id: "as-ict-1",
            title: "Operating Systems (Ubuntu CLI vs Windows Server Active Directory)",
            type: "CAT",
            obtainedScore: 82,
            weight: 20,
            date: "2026-02-14",
            feedback: "Outstanding proficiency with Linux terminal tools and scripting commands.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-ict-2",
            title: "Advanced Word Processing & Spreadsheets Audit Report",
            type: "Practical Project",
            obtainedScore: 78,
            weight: 20,
            date: "2026-02-28",
            feedback: "Excellent layout structure, standard format matches CDACC PoE specifications.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-ict-3",
            title: "Digital Literacy Final Registry Theory Exam",
            type: "Internal Exam",
            obtainedScore: 75,
            weight: 60,
            date: "2026-03-20",
            feedback: "Completed successfully. Solid grasp of digital hardware systems.",
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
            id: "as-ict-4",
            title: "Hardware Assembly (Motherboards, RAM speed synchronization, & BIOS flashing)",
            type: "CAT",
            obtainedScore: 70,
            weight: 20,
            date: "2026-03-05",
            feedback: "Ensure proper wrist placement to avoid static electricity on raw semiconductors.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-ict-5",
            title: "Operating System Deployment and Dynamic Driver Security Patches",
            type: "Practical Project",
            obtainedScore: 85,
            weight: 20,
            date: "2026-03-25",
            feedback: "Clean partitions configuration. Excellent automated installation script.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-ict-6",
            title: "Computer Hardware Registry Mock Exam",
            type: "Internal Exam",
            obtainedScore: 68,
            weight: 60,
            date: "2026-04-10",
            feedback: "Satisfactory theory knowledge, practical test completed within 45 mins limit.",
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
            id: "as-ict-7",
            title: "Variable Length Subnet Masking (VLSM) & IPv4/IPv6 Dual-strafing",
            type: "CAT",
            obtainedScore: 58,
            weight: 25,
            date: "2026-04-18",
            feedback: "Bit calculations were shaky. Requires remedial practice on network masking blocks.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-ict-8",
            title: "Enterprise Core Router and Managed Switch VLAN configurations",
            type: "Practical Project",
            obtainedScore: 48,
            weight: 25,
            date: "2026-05-10",
            feedback: "Failed to configure static Routing Matrices correctly. Scheduled for lab recovery session.",
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
            id: "as-ict-9",
            title: "Entity Relationship Diagrams (ERDs) & Third Normal Form (3NF) Normalization",
            type: "CAT",
            obtainedScore: 65,
            weight: 30,
            date: "2026-05-02",
            feedback: "Stellar normalizations. Some transitional relations require explicit primary keys.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-ict-10",
            title: "Procedural SQL Trigger systems and Relational Store Procedures",
            type: "Practical Project",
            obtainedScore: 72,
            weight: 30,
            date: "2026-05-18",
            feedback: "Triggers execute with excellent transaction safety safeguards.",
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
            id: "as-ict-11",
            title: "Object-Oriented Design Principles (SOLID Pattern Mapping & UML Modeling)",
            type: "CAT",
            obtainedScore: 74,
            weight: 20,
            date: "2026-04-20",
            feedback: "Good class modularization. Use interface design for factory architecture bindings.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-ict-12",
            title: "Kenyan Citizen Portal Application (Frontend + Node Express Backend Service)",
            type: "Practical Project",
            obtainedScore: 82,
            weight: 30,
            date: "2026-05-15",
            feedback: "Superb responsive UI design. Securely maps internal API routes.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      }
    ],
    deadlines: [
      {
        id: "dl-ict-1",
        unitId: "ICT-OS-60-03",
        unitName: "Configure and Troubleshoot Computer Networks",
        title: "WAN & LAN Configurations Lab Remedial",
        dueDate: "2026-06-03",
        type: "Practical Prep",
        description: "Practice assignment for Cisco CLI terminal commands. Master interface routing & subnet allocation values.",
        completed: false
      },
      {
        id: "dl-ict-2",
        unitId: "ICT-OS-60-04",
        unitName: "Perform Database Design and Development",
        title: "Submit PoE Portfolio Binder of Evidence",
        dueDate: "2026-06-08",
        type: "PoE Submission",
        description: "Compile and present standardized CDACC internal continuous assessment scripts signed by the internal examiner.",
        completed: false
      },
      {
        id: "dl-ict-3",
        unitId: "ICT-OS-60-02",
        unitName: "Install and Configure Computer Systems",
        title: "National CDACC Practical Board Exams",
        dueDate: "2026-06-21",
        type: "CDACC National Exam",
        description: "Official 4-hour CDACC Assessment on physical assembly, driver installation, and disk RAID configuration.",
        completed: false
      }
    ],
    attendanceLogs: [
      {
        id: "att-ict-1",
        unitId: "ICT-OS-60-03",
        unitName: "Configure and Troubleshoot Computer Networks",
        unitCode: "ICT/OS/60/03-A",
        date: "2026-05-20",
        duration: 3,
        status: "Present",
        remarks: "IPv4 VLSM subnet boundaries assignment review."
      },
      {
        id: "att-ict-2",
        unitId: "ICT-OS-60-03",
        unitName: "Configure and Troubleshoot Computer Networks",
        unitCode: "ICT/OS/60/03-A",
        date: "2026-05-22",
        duration: 3,
        status: "Absent (Unexcused)",
        remarks: "Overstretching family engagement without official notification."
      }
    ]
  },
  electrical: {
    student: {
      name: "Derrick Ngure",
      admissionNo: "TVET/KAP/ELE/2025/1102",
      courseName: "Diploma in Electrical & Electronics Engineering (Power Option)",
      institution: "Kabete National Polytechnic, Nairobi",
      cohort: "2025/2026 Intake (Year 2, Sem 1)",
      photoUrl: "",
      email: "derrickngure39@gmail.com"
    },
    units: [
      {
        id: "ELE-OS-PO-01-6",
        code: "ELE/OS/PO/01/6-A",
        name: "Apply Electrical Principles and Circuit Analysis",
        level: 6,
        creditHours: 6,
        hoursRequired: 60,
        hoursAttended: 58,
        poeStatus: PoEStatus.CERTIFIED,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-ele-1",
            title: "AC Circuit Analysis (Impedance, Phase angle, Resonance, Power Factor correction)",
            type: "CAT",
            obtainedScore: 78,
            weight: 30,
            date: "2026-02-18",
            feedback: "Perfect impedance triangles. Well conceptualized power equations.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-ele-2",
            title: "Three-Phase Star/Delta Balanced & Unbalanced Loads Lab",
            type: "Practical Project",
            obtainedScore: 84,
            weight: 30,
            date: "2526-03-12",
            feedback: "Exceptional safety adherence. Clean waveforms matching expectations.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "ELE-OS-PO-02-6",
        code: "ELE/OS/PO/02/6-A",
        name: "Install Electrical Wiring Systems and Control Devices",
        level: 6,
        creditHours: 8,
        hoursRequired: 80,
        hoursAttended: 76,
        poeStatus: PoEStatus.READY_FOR_ASSESSMENT,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-ele-3",
            title: "Industrial Cable Conduit Bending & Distribution Board Trunking",
            type: "CAT",
            obtainedScore: 88,
            weight: 20,
            date: "2026-03-20",
            feedback: "Conduits are aligned flawlessly. Gland connections fit tightly and safely.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-ele-4",
            title: "Automatic Star-Delta Starter Panel with Thermal Overload Relays",
            type: "Practical Project",
            obtainedScore: 74,
            weight: 20,
            date: "2026-04-05",
            feedback: "Wired up correctly. Interlocking protection lines operate flawlessly.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-ele-5",
            title: "Wiring Standards (IEE Regulations & Energy Regulatory Authority Laws)",
            type: "Internal Exam",
            obtainedScore: 70,
            weight: 60,
            date: "2026-04-25",
            feedback: "Sound interpretation of legal and safety provisions for earthing systems.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "ELE-OS-PO-03-6",
        code: "ELE/OS/PO/03/6-A",
        name: "Install and Maintain Electrical Machines and Control Gears",
        level: 6,
        creditHours: 8,
        hoursRequired: 90,
        hoursAttended: 72,
        poeStatus: PoEStatus.IN_PROGRESS,
        competenceStatus: CompetenceStatus.ONGOING,
        assessments: [
          {
            id: "as-ele-6",
            title: "AC Induction Motor Overhaul (Winding tests, bearing replacement, slip ring servicing)",
            type: "CAT",
            obtainedScore: 61,
            weight: 25,
            date: "2026-04-22",
            feedback: "Minor mistake when indexing coil pole orientations. Corrected under supervision.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-ele-7",
            title: "Programmable Logic Controllers (PLC) Industrial Escalator Ladder Logic Simulation",
            type: "Practical Project",
            obtainedScore: 50,
            weight: 25,
            date: "2026-05-12",
            feedback: "Latch instruction timer parameters were logic-faulty. Needs retry on digital interface.",
            status: CompetenceStatus.NOT_YET_COMPETENT
          }
        ]
      }
    ],
    deadlines: [
      {
        id: "dl-ele-1",
        unitId: "ELE-OS-PO-03-6",
        unitName: "Install and Maintain Electrical Machines and Control Gears",
        title: "Ladder Logic Simulation Correction Resubmit",
        dueDate: "2026-06-04",
        type: "Practical Prep",
        description: "Re-model control loops for escalator pneumatic gate logic. Test inputs and triggers using Allen-Bradley simulator.",
        completed: false
      },
      {
        id: "dl-ele-2",
        unitId: "ELE-OS-PO-02-6",
        unitName: "Install Electrical Wiring Systems and Control Devices",
        title: "Logbook of Evidence CDACC Validation",
        dueDate: "2026-06-12",
        type: "PoE Submission",
        description: "Submit physically bound wiring schematics and instructor inspection sign-off logs for the DB board panels.",
        completed: false
      }
    ],
    attendanceLogs: [
      {
        id: "att-ele-1",
        unitId: "ELE-OS-PO-02-6",
        unitName: "Install Electrical Wiring Systems and Control Devices",
        unitCode: "ELE/OS/PO/02/6-A",
        date: "2026-05-18",
        duration: 4,
        status: "Present",
        remarks: "Metal conduit threading and structural die sizing practical lab."
      },
      {
        id: "att-ele-2",
        unitId: "ELE-OS-PO-03-6",
        unitName: "Install and Maintain Electrical Machines and Control Gears",
        unitCode: "ELE/OS/PO/03/6-A",
        date: "2026-05-21",
        duration: 3,
        status: "Present",
        remarks: "PLC hardware interfacing, input/output addressing, and memory allocation formats."
      }
    ]
  },
  hospitality: {
    student: {
      name: "Derrick Ngure",
      admissionNo: "TVET/KAP/HOT/2025/2095",
      courseName: "Diploma in Food and Beverage Production (Culinary Arts - Level 6)",
      institution: "Kabete National Polytechnic, Nairobi",
      cohort: "2025/2026 Intake (Year 2, Sem 1)",
      photoUrl: "",
      email: "derrickngure39@gmail.com"
    },
    units: [
      {
        id: "FAB-OS-01-6",
        code: "FAB/OS/01/6-A",
        name: "Apply Food Safety, Kitchen Hygiene, and Sanitization Standards",
        level: 6,
        creditHours: 4,
        hoursRequired: 40,
        hoursAttended: 40,
        poeStatus: PoEStatus.CERTIFIED,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-fab-1",
            title: "HACCP Principles Planning & Cross-Contamination Hazards Prevention Profile",
            type: "CAT",
            obtainedScore: 85,
            weight: 30,
            date: "2026-02-15",
            feedback: "Exceptional flow design for storage and garbage segregation.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-fab-2",
            title: "Kitchen Sanitation Audit & Critical Control Points Live Assessment",
            type: "Practical Project",
            obtainedScore: 92,
            weight: 70,
            date: "2026-03-05",
            feedback: "Exceptional personal grooming, sanitization procedure execution, and workstation hygiene.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "FAB-OS-02-6",
        code: "FAB/OS/02/6-A",
        name: "Prepare Underpinning Stocks, Mother Sauces, and Soups",
        level: 6,
        creditHours: 6,
        hoursRequired: 60,
        hoursAttended: 54,
        poeStatus: PoEStatus.READY_FOR_ASSESSMENT,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-fab-3",
            title: "Classical French Mother Sauces (Béchamel, Velouté, Espagnole, Tomato, and Emulsified Hollandaise)",
            type: "CAT",
            obtainedScore: 78,
            weight: 25,
            date: "2026-03-18",
            feedback: "Excellent thickening control. Hollandaise was highly stable with pleasant balance.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-fab-4",
            title: "Preparation of Clear and Thickened Soups (Consommé clarifying & bisque thickening)",
            type: "Practical Project",
            obtainedScore: 80,
            weight: 25,
            date: "2026-04-02",
            feedback: "Consommé was perfectly crystal clear. Beautiful raft execution.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "FAB-OS-03-6",
        code: "FAB/OS/03/6-A",
        name: "Execute High-Volume Professional Menu Production & Gastronomy",
        level: 6,
        creditHours: 10,
        hoursRequired: 100,
        hoursAttended: 88,
        poeStatus: PoEStatus.IN_PROGRESS,
        competenceStatus: CompetenceStatus.ONGOING,
        assessments: [
          {
            id: "as-fab-5",
            title: "Recipe costing card, yields mapping, & Portioning analysis matrix",
            type: "CAT",
            obtainedScore: 66,
            weight: 20,
            date: "2026-04-18",
            feedback: "Mathematical calculations were accurate. Make sure to factor seasonal gas price changes.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-fab-6",
            title: "CDACC Practical Banquet Menu - Kenyan-Themed Fine Dining Plate-up",
            type: "Practical Project",
            obtainedScore: 52,
            weight: 30,
            date: "2026-05-15",
            feedback: "Traditional pilau presentation was messy, and beef cubes were tough. Re-run scheduled.",
            status: CompetenceStatus.NOT_YET_COMPETENT
          }
        ]
      }
    ],
    deadlines: [
      {
        id: "dl-fab-1",
        unitId: "FAB-OS-03-6",
        unitName: "Execute High-Volume Professional Menu Production & Gastronomy",
        title: "Banquet Plating and Beef Tenderizing Re-test",
        dueDate: "2026-06-05",
        type: "Practical Prep",
        description: "Practice cuts and wet-marination techniques for structural beef tenderization. Refine plate margins design.",
        completed: false
      },
      {
        id: "dl-fab-2",
        unitId: "FAB-OS-02-6",
        unitName: "Prepare Underpinning Stocks, Mother Sauces, and Soups",
        title: "Submit Culinary Recipe Portfolio Binder",
        dueDate: "2026-06-15",
        type: "PoE Submission",
        description: "Submit complete recipes file containing high-definition step pictures and certified ingredient index sheets.",
        completed: false
      }
    ],
    attendanceLogs: [
      {
        id: "att-fab-1",
        unitId: "FAB-OS-02-6",
        unitName: "Prepare Underpinning Stocks, Mother Sauces, and Soups",
        unitCode: "FAB/OS/02/6-A",
        date: "2026-05-12",
        duration: 4,
        status: "Present",
        remarks: "Brown veal stock preparation and skimming intervals demonstration."
      },
      {
        id: "att-fab-2",
        unitId: "FAB-OS-03-6",
        unitName: "Execute High-Volume Professional Menu Production & Gastronomy",
        unitCode: "FAB/OS/03/6-A",
        date: "2026-05-19",
        duration: 5,
        status: "Present",
        remarks: "Menu planning and kitchen line simulation (Sous Chef delegation role)."
      }
    ]
  },
  construction: {
    student: {
      name: "Derrick Ngure",
      admissionNo: "TVET/KAP/CIV/2025/1330",
      courseName: "Diploma in Civil & Structural Engineering (Level 6)",
      institution: "Kabete National Polytechnic, Nairobi",
      cohort: "2025/2026 Intake (Year 2, Sem 1)",
      photoUrl: "",
      email: "derrickngure39@gmail.com"
    },
    units: [
      {
        id: "CIV-OS-01-6",
        code: "CIV/OS/01/6-A",
        name: "Apply Structural Principles & Mechanical Calculations",
        level: 6,
        creditHours: 8,
        hoursRequired: 80,
        hoursAttended: 76,
        poeStatus: PoEStatus.CERTIFIED,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-civ-1",
            title: "Shear Force & Bending Moments Diagram Calculations (Simply supported & Cantilever beams)",
            type: "CAT",
            obtainedScore: 81,
            weight: 30,
            date: "2026-02-20",
            feedback: "Perfect diagrams and reaction force solutions. Keep equations clean.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-civ-2",
            title: "Structural Trusses Joint Tension Analysis and Stress vectors",
            type: "Practical Project",
            obtainedScore: 78,
            weight: 30,
            date: "2026-03-10",
            feedback: "Solid graphical and analytical results. Accurate vector projections.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "CIV-OS-02-6",
        code: "CIV/OS/02/6-A",
        name: "Perform Engineering Surveying Operations",
        level: 6,
        creditHours: 8,
        hoursRequired: 90,
        hoursAttended: 82,
        poeStatus: PoEStatus.READY_FOR_ASSESSMENT,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-civ-3",
            title: "Total Station Setup and Radial Surveying Coordinates Capture",
            type: "CAT",
            obtainedScore: 72,
            weight: 20,
            date: "2026-03-24",
            feedback: "Minor centering calibration lag. Overall coordinates layout is accurate.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-civ-4",
            title: "Grid Levelling, Traverse Survey, & Contour Interpolation Mapping",
            type: "Practical Project",
            obtainedScore: 84,
            weight: 30,
            date: "2026-04-12",
            feedback: "Clean leveling sheets. Close horizontal check errors fall of-well within tolerable margins.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "CIV-OS-03-6",
        code: "CIV/OS/03/6-A",
        name: "Apply Structural Design & Computer Aided Drafting (CAD)",
        level: 6,
        creditHours: 10,
        hoursRequired: 100,
        hoursAttended: 78,
        poeStatus: PoEStatus.IN_PROGRESS,
        competenceStatus: CompetenceStatus.ONGOING,
        assessments: [
          {
            id: "as-civ-5",
            title: "Rebar Detailing Standard of Reinforced Concrete structural columns (Eurocode 2 compliance)",
            type: "CAT",
            obtainedScore: 70,
            weight: 20,
            date: "2026-04-28",
            feedback: "Proper links allocation and anchor parameters. Good draft layouts.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-civ-6",
            title: "Submission of complete 2D/3D commercial portal frame structural layout in AutoCAD/Revit",
            type: "Practical Project",
            obtainedScore: 54,
            weight: 30,
            date: "2026-05-18",
            feedback: "Roof truss joint connection details are missing. Revise CAD drawing layers.",
            status: CompetenceStatus.NOT_YET_COMPETENT
          }
        ]
      }
    ],
    deadlines: [
      {
        id: "dl-civ-1",
        unitId: "CIV-OS-03-6",
        unitName: "Apply Structural Design & Computer Aided Drafting (CAD)",
        title: "Revit Roof Joint Detail Drawing Revision",
        dueDate: "2026-06-07",
        type: "Practical Prep",
        description: "Re-edit column layers and purlin support connection details in AutoCAD/Revit. Meet structural checklist rules.",
        completed: false
      },
      {
        id: "dl-civ-2",
        unitId: "CIV-OS-02-6",
        unitName: "Perform Engineering Surveying Operations",
        title: "Logbook of Survey Field Computations",
        dueDate: "2026-06-18",
        type: "PoE Submission",
        description: "Compile traverse worksheets and radial leveling sheets signed by internal surveyor supervisor.",
        completed: false
      }
    ],
    attendanceLogs: [
      {
        id: "att-civ-1",
        unitId: "CIV-OS-02-6",
        unitName: "Perform Engineering Surveying Operations",
        unitCode: "CIV/OS/02/6-A",
        date: "2026-05-15",
        duration: 4,
        status: "Present",
        remarks: "Total station prism target leveling and base settings loop."
      },
      {
        id: "att-civ-2",
        unitId: "CIV-OS-03-6",
        unitName: "Apply Structural Design & Computer Aided Drafting (CAD)",
        unitCode: "CIV/OS/03/6-A",
        date: "2026-05-22",
        duration: 4,
        status: "Present",
        remarks: "AutoCAD structural rebar detailing setup for slab panels."
      }
    ]
  },
  automotive: {
    student: {
      name: "Derrick Ngure",
      admissionNo: "TVET/KAP/AUT/2025/1169",
      courseName: "Diploma in Automotive Engineering (Level 6)",
      institution: "Kabete National Polytechnic, Nairobi",
      cohort: "2025/2026 Intake (Year 2, Sem 1)",
      photoUrl: "",
      email: "derrickngure39@gmail.com"
    },
    units: [
      {
        id: "AUT-OS-01-6",
        code: "AUT/OS/01/6-A",
        name: "Perform Vehicle Engine Overhaul and Tune-up",
        level: 6,
        creditHours: 8,
        hoursRequired: 80,
        hoursAttended: 74,
        poeStatus: PoEStatus.CERTIFIED,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-aut-1",
            title: "Four-stroke petrol engine compression diagnostics & cylinder leak-back logs",
            type: "CAT",
            obtainedScore: 76,
            weight: 30,
            date: "2026-02-17",
            feedback: "Accurate interpretation of cylinder pressure loss records. Correct diagnostic conclusions.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-aut-2",
            title: "Crankshaft micrometer tolerance check and main bearing replacement",
            type: "Practical Project",
            obtainedScore: 82,
            weight: 30,
            date: "2026-03-11",
            feedback: "Extremely tidy valve-grinding and micrometrical tolerance clearances logging.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "AUT-OS-02-6",
        code: "AUT/OS/02/6-A",
        name: "Service and Repair Vehicle Transmission Systems",
        level: 6,
        creditHours: 8,
        hoursRequired: 80,
        hoursAttended: 78,
        poeStatus: PoEStatus.READY_FOR_ASSESSMENT,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-aut-3",
            title: "Manual Clutch assembly overhaul, pilot bearing replacement, and pressure-plate adjustments",
            type: "CAT",
            obtainedScore: 80,
            weight: 20,
            date: "2026-03-22",
            feedback: "Masterful centering tool deployment. Clutch clearance values align perfectly.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-aut-4",
            title: "Service and diagnostics of planetary gearsets in Automatic transmissions",
            type: "Practical Project",
            obtainedScore: 71,
            weight: 20,
            date: "2026-04-14",
            feedback: "Solid understanding of clutch packs and brake band mechanical limits.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-aut-5",
            title: "Transmission Systems National CDACC Internal Theory Mock",
            type: "Internal Exam",
            obtainedScore: 75,
            weight: 60,
            date: "2026-04-28",
            feedback: "Exceptional representation of differential spider gears action math.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "AUT-OS-03-6",
        code: "AUT/OS/03/6-A",
        name: "Perform Live Vehicle Electrical & On-Board Diagnostics (OBD)",
        level: 6,
        creditHours: 8,
        hoursRequired: 90,
        hoursAttended: 70,
        poeStatus: PoEStatus.IN_PROGRESS,
        competenceStatus: CompetenceStatus.ONGOING,
        assessments: [
          {
            id: "as-aut-6",
            title: "Alternator rectifier diode systems logic testing and waveform analysis on oscilloscope",
            type: "CAT",
            obtainedScore: 68,
            weight: 20,
            date: "2026-05-04",
            feedback: "Identified open circuit diode anomaly successfully directly from display curves.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-aut-7",
            title: "OBD II Scanner Live Parameters Stream Analysis and DTC Fault Code Clearing",
            type: "Practical Project",
            obtainedScore: 49,
            weight: 30,
            date: "2026-05-20",
            feedback: "Failed to isolate oxygen sensor heater short circuit on fuse network. Retry set.",
            status: CompetenceStatus.NOT_YET_COMPETENT
          }
        ]
      }
    ],
    deadlines: [
      {
        id: "dl-aut-1",
        unitId: "AUT-OS-03-6",
        unitName: "Perform Live Vehicle Electrical & On-Board Diagnostics (OBD)",
        title: "OBD Sensor Circuit Isolation Practical Re-run",
        dueDate: "2026-06-06",
        type: "Practical Prep",
        description: "Diagnose short-to-ground variables in dynamic vehicle wiring looms using multimeter voltage checks.",
        completed: false
      },
      {
        id: "dl-aut-2",
        unitId: "AUT-OS-01-6",
        unitName: "Perform Vehicle Engine Overhaul and Tune-up",
        title: "Submit CDACC Certified Mechanical Engine Logs",
        dueDate: "2026-06-18",
        type: "PoE Submission",
        description: "Submit all micrometer recordings and cylinder leakage worksheets signed by workshop supervisor.",
        completed: false
      }
    ],
    attendanceLogs: [
      {
        id: "att-aut-1",
        unitId: "AUT-OS-02-6",
        unitName: "Service and Repair Vehicle Transmission Systems",
        unitCode: "AUT/OS/02/6-A",
        date: "2026-05-14",
        duration: 3,
        status: "Present",
        remarks: "Synchromesh unit assembly tolerances and selector fork clearance practical."
      },
      {
        id: "att-aut-2",
        unitId: "AUT-OS-03-6",
        unitName: "Perform Live Vehicle Electrical & On-Board Diagnostics (OBD)",
        unitCode: "AUT/OS/03/6-A",
        date: "2026-05-22",
        duration: 4,
        status: "Present",
        remarks: "CAN Bus protocol waveforms analysis on visual oscilloscope and live scanner checks."
      }
    ]
  },
  agriculture: {
    student: {
      name: "Derrick Ngure",
      admissionNo: "TVET/KAP/AGR/2025/1410",
      courseName: "Diploma in Agricultural Extension & Agro-Entrepreneurship Practice (Level 6)",
      institution: "Kabete National Polytechnic, Nairobi",
      cohort: "2025/2026 Intake (Year 2, Sem 1)",
      photoUrl: "",
      email: "derrickngure39@gmail.com"
    },
    units: [
      {
        id: "AGR-OS-60-01",
        code: "AGR/OS/60/01-A",
        name: "Apply General Agro-Crop Production Techniques",
        level: 6,
        creditHours: 6,
        hoursRequired: 60,
        hoursAttended: 58,
        poeStatus: PoEStatus.CERTIFIED,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-agr-1",
            title: "Horticulture Greenhouse Siting & Irrigation Layout Design",
            type: "CAT",
            obtainedScore: 84,
            weight: 30,
            date: "2026-02-19",
            feedback: "Exceptional drip layout planning and water pressure calculation metrics.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-agr-2",
            title: "Dryland Grain Crop Disease & Pest Control Protocol Practice",
            type: "Practical Project",
            obtainedScore: 78,
            weight: 30,
            date: "2026-03-08",
            feedback: "Excellent biological pest mitigation strategies. Formulations are completely accurate.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "AGR-OS-60-02",
        code: "AGR/OS/60/02-A",
        name: "Perform Livestock Rearing and Animal Breeding",
        level: 6,
        creditHours: 8,
        hoursRequired: 80,
        hoursAttended: 74,
        poeStatus: PoEStatus.READY_FOR_ASSESSMENT,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-agr-3",
            title: "Dairy Feed Formulation & Silage Preparation Log sheets",
            type: "CAT",
            obtainedScore: 76,
            weight: 20,
            date: "2026-03-24",
            feedback: "Balanced crude protein calculations aligned with high-yield lactation targets.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-agr-4",
            title: "Artificial Insemination (AI) Procedures & Poultry Breeding Records",
            type: "Practical Project",
            obtainedScore: 82,
            weight: 30,
            date: "2026-04-14",
            feedback: "Outstanding safety procedures and sterile containment handling during procedure.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "AGR-OS-60-03",
        code: "AGR/OS/60/03-A",
        name: "Soil Science, Nutrient Analysis & Agronomy Management",
        level: 6,
        creditHours: 8,
        hoursRequired: 80,
        hoursAttended: 62,
        poeStatus: PoEStatus.IN_PROGRESS,
        competenceStatus: CompetenceStatus.ONGOING,
        assessments: [
          {
            id: "as-agr-5",
            title: "Spectrophotometric Nitrogen-Phosphorus-Potassium (NPK) Soil Test CAT",
            type: "CAT",
            obtainedScore: 68,
            weight: 20,
            date: "2026-05-02",
            feedback: "Good chemical dilution practices. Be precise with pH meter calibration.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-agr-6",
            title: "Acidity Remediation and Organic Compost Enrichment Field Project",
            type: "Practical Project",
            obtainedScore: 48,
            weight: 30,
            date: "2026-05-22",
            feedback: "Lime calculation was flawed, leading to localized soil alkalinity spikes. Re-calculation set.",
            status: CompetenceStatus.NOT_YET_COMPETENT
          }
        ]
      }
    ],
    deadlines: [
      {
        id: "dl-agr-1",
        unitId: "AGR-OS-60-03",
        unitName: "Soil Science, Nutrient Analysis & Agronomy Management",
        title: "Soil Liming & pH Calibration Practice",
        dueDate: "2026-06-05",
        type: "Practical Prep",
        description: "Recompute liming rates for high-acidity volcanic soils of the Rift Valley highlands. Test composting ratios.",
        completed: false
      },
      {
        id: "dl-agr-2",
        unitId: "AGR-OS-60-01",
        unitName: "Apply General Agro-Crop Production Techniques",
        title: "Submit Crop Nursery Evidence Binders",
        dueDate: "2026-06-16",
        type: "PoE Submission",
        description: "Compile and present step-by-step germination records and seedling management photo grids signed by supervisor.",
        completed: false
      }
    ],
    attendanceLogs: [
      {
        id: "att-agr-1",
        unitId: "AGR-OS-60-02",
        unitName: "Perform Livestock Rearing and Animal Breeding",
        unitCode: "AGR/OS/60/02-A",
        date: "2026-05-14",
        duration: 3,
        status: "Present",
        remarks: "Silage compression, molasses concentration, and pit closure walkthrough."
      },
      {
        id: "att-agr-2",
        unitId: "AGR-OS-60-03",
        unitName: "Soil Science, Nutrient Analysis & Agronomy Management",
        unitCode: "AGR/OS/60/03-A",
        date: "2026-05-21",
        duration: 4,
        status: "Present",
        remarks: "NPK extraction from Kabete farm soil samples using spectrophotometric indices."
      }
    ]
  },
  business: {
    student: {
      name: "Derrick Ngure",
      admissionNo: "TVET/KAP/BUS/2025/1592",
      courseName: "Diploma in Business Management & Cooperatives (Level 6)",
      institution: "Kabete National Polytechnic, Nairobi",
      cohort: "2025/2026 Intake (Year 2, Sem 1)",
      photoUrl: "",
      email: "derrickngure39@gmail.com"
    },
    units: [
      {
        id: "BUS-OS-60-01",
        code: "BUS/OS/60/01-A",
        name: "Apply Principles of Management and Leadership",
        level: 6,
        creditHours: 6,
        hoursRequired: 60,
        hoursAttended: 57,
        poeStatus: PoEStatus.CERTIFIED,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-bus-1",
            title: "Managerial Decision Trees and Conflict Resolution Matrix CAT",
            type: "CAT",
            obtainedScore: 78,
            weight: 30,
            date: "2026-02-16",
            feedback: "Outstanding application of Hersey-Blanchard situational leadership matrix models.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-bus-2",
            title: "Kenyan SACCO Cooperative Governance Structural Analysis Project",
            type: "Practical Project",
            obtainedScore: 84,
            weight: 30,
            date: "2026-03-04",
            feedback: "In-depth review of SACCO regulatory compliance guidelines and board management practices.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "BUS-OS-60-02",
        code: "BUS/OS/60/02-A",
        name: "Perform Financial Accounting and Costing Operations",
        level: 6,
        creditHours: 8,
        hoursRequired: 80,
        hoursAttended: 78,
        poeStatus: PoEStatus.READY_FOR_ASSESSMENT,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-bus-3",
            title: "Consolidated Balance Sheets, Trial Balances, and Bank Reconciliation Accounts",
            type: "CAT",
            obtainedScore: 90,
            weight: 20,
            date: "2026-03-20",
            feedback: "Perfect double-entry books. Outstanding ledger accuracy.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-bus-4",
            title: "High-Volume Inventory Valuation and Costing Systems Audit",
            type: "Practical Project",
            obtainedScore: 76,
            weight: 30,
            date: "2026-04-12",
            feedback: "Excellent comparative application of FIFO, LIFO, and weighted average cost methods.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "BUS-OS-60-03",
        code: "BUS/OS/60/03-A",
        name: "Manage Supply Chain Logistics and Warehouse Auditing",
        level: 6,
        creditHours: 8,
        hoursRequired: 90,
        hoursAttended: 70,
        poeStatus: PoEStatus.IN_PROGRESS,
        competenceStatus: CompetenceStatus.ONGOING,
        assessments: [
          {
            id: "as-bus-5",
            title: "Supply Chain Risk Assessment Planning CAT",
            type: "CAT",
            obtainedScore: 72,
            weight: 20,
            date: "2026-04-30",
            feedback: "Good mitigation plans for port and customs clearance delays of incoming raw materials.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-bus-6",
            title: "Dynamic Procurement Cycle Audit & Vendor Selection Log sheets",
            type: "Practical Project",
            obtainedScore: 49,
            weight: 30,
            date: "2026-05-18",
            feedback: "Incorrect optimal order size (EOQ) calculation. Review holding cost variables.",
            status: CompetenceStatus.NOT_YET_COMPETENT
          }
        ]
      }
    ],
    deadlines: [
      {
        id: "dl-bus-1",
        unitId: "BUS-OS-60-03",
        unitName: "Manage Supply Chain Logistics and Warehouse Auditing",
        title: "EOQ & Safety Stock Calculation Corrections",
        dueDate: "2026-06-03",
        type: "Practical Prep",
        description: "Re-adjust carrying and purchasing cost ratios for procurement mock logs. Fix safety buffer sizes.",
        completed: false
      },
      {
        id: "dl-bus-2",
        unitId: "BUS-OS-60-01",
        unitName: "Apply Principles of Management and Leadership",
        title: "Submit SACCO Case Study Portfolios",
        dueDate: "2026-06-14",
        type: "PoE Submission",
        description: "Submit certified case binders containing structural templates, internal bylaws, and regulatory checklists.",
        completed: false
      }
    ],
    attendanceLogs: [
      {
        id: "att-bus-1",
        unitId: "BUS-OS-60-02",
        unitName: "Perform Financial Accounting and Costing Operations",
        unitCode: "BUS/OS/60/02-A",
        date: "2026-05-13",
        duration: 3,
        status: "Present",
        remarks: "Partnership liquidation double-entry accounts review and capital adjustments."
      },
      {
        id: "att-bus-2",
        unitId: "BUS-OS-60-03",
        unitName: "Manage Supply Chain Logistics and Warehouse Auditing",
        unitCode: "BUS/OS/60/03-A",
        date: "2026-05-20",
        duration: 3,
        status: "Present",
        remarks: "Optimal logistics routing and dynamic buffer stock model walkthrough."
      }
    ]
  },
  fashion: {
    student: {
      name: "Derrick Ngure",
      admissionNo: "TVET/KAP/FAS/2025/1218",
      courseName: "Diploma in Fashion Design & Apparel Technology (Level 6)",
      institution: "Kabete National Polytechnic, Nairobi",
      cohort: "2025/2026 Intake (Year 2, Sem 1)",
      photoUrl: "",
      email: "derrickngure39@gmail.com"
    },
    units: [
      {
        id: "FAS-OS-60-01",
        code: "FAS/OS/60/01-A",
        name: "Perform Pattern Drafting and Garment Construction",
        level: 6,
        creditHours: 8,
        hoursRequired: 90,
        hoursAttended: 86,
        poeStatus: PoEStatus.CERTIFIED,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-fas-1",
            title: "Bodice Block Manipulation & Sleeve Pattern Drafting CAT",
            type: "CAT",
            obtainedScore: 82,
            weight: 30,
            date: "2026-02-17",
            feedback: "Perfect dart manipulations. Balance notches and grading parameters are correct.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-fas-2",
            title: "Construct Tailored Gentlemen Jacket with Piping and Linings",
            type: "Practical Project",
            obtainedScore: 88,
            weight: 40,
            date: "2026-03-06",
            feedback: "High structural finish. Excellent neatness indices in seam lines and collar lapel folds.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "FAS-OS-60-02",
        code: "FAS/OS/60/02-A",
        name: "Apply Textile Science and Color Chemistry Principles",
        level: 6,
        creditHours: 6,
        hoursRequired: 60,
        hoursAttended: 56,
        poeStatus: PoEStatus.READY_FOR_ASSESSMENT,
        competenceStatus: CompetenceStatus.COMPETENT,
        assessments: [
          {
            id: "as-fas-3",
            title: "Microscopic Fiber Identification and Burning Behavior Study",
            type: "CAT",
            obtainedScore: 78,
            weight: 25,
            date: "2026-03-24",
            feedback: "Accurate logging of synthetic and natural fiber thermal characteristics.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-fas-4",
            title: "Tie-Dye Dyeing using Vat Colors & Pigment Fastness Testing",
            type: "Practical Project",
            obtainedScore: 70,
            weight: 35,
            date: "2026-04-10",
            feedback: "Vibrant custom pattern creations. Good dye stabilization and rinsing steps control.",
            status: CompetenceStatus.COMPETENT
          }
        ]
      },
      {
        id: "FAS-OS-60-03",
        code: "FAS/OS/60/03-A",
        name: "Apply CAD in Fashion Design and Mass Production Illustration",
        level: 6,
        creditHours: 8,
        hoursRequired: 80,
        hoursAttended: 64,
        poeStatus: PoEStatus.IN_PROGRESS,
        competenceStatus: CompetenceStatus.ONGOING,
        assessments: [
          {
            id: "as-fas-5",
            title: "Digital Croquis Drawing and Capsule Collection Rendering",
            type: "CAT",
            obtainedScore: 65,
            weight: 20,
            date: "2026-04-28",
            feedback: "Good dynamic poses and realistic fabric texture overlays.",
            status: CompetenceStatus.COMPETENT
          },
          {
            id: "as-fas-6",
            title: "Marker Planning and Multi-Size Digital Pattern Layout in Gerber/Optitex",
            type: "Practical Project",
            obtainedScore: 51,
            weight: 30,
            date: "2026-05-19",
            feedback: "Fabric utilization rate fell below minimum standards of 82%. Fix seam-allowance margins.",
            status: CompetenceStatus.NOT_YET_COMPETENT
          }
        ]
      }
    ],
    deadlines: [
      {
        id: "dl-fas-1",
        unitId: "FAS-OS-60-03",
        unitName: "Apply CAD in Fashion Design and Mass Production Illustration",
        title: "Garment Marker Planning Digital Optimization",
        dueDate: "2026-06-04",
        type: "Practical Prep",
        description: "Nest pieces dynamically on Optitex CAD to maximize fabric yield above 85% to cut industrial material waste.",
        completed: false
      },
      {
        id: "dl-fas-2",
        unitId: "FAS-OS-60-01",
        unitName: "Perform Pattern Drafting and Garment Construction",
        title: "Submit Pattern Portfolios to Board Assessor",
        dueDate: "2026-06-15",
        type: "PoE Submission",
        description: "Submit 1:5 scaled bodice, skirt and trouser drafts securely bound, with full measurement charts.",
        completed: false
      }
    ],
    attendanceLogs: [
      {
        id: "att-fas-1",
        unitId: "FAS-OS-60-01",
        unitName: "Perform Pattern Drafting and Garment Construction",
        unitCode: "FAS/OS/60/01-A",
        date: "2026-05-18",
        duration: 4,
        status: "Present",
        remarks: "Collar lapel double-breasted coat pattern drafting and slashes review."
      },
      {
        id: "att-fas-2",
        unitId: "FAS-OS-60-03",
        unitName: "Apply CAD in Fashion Design and Mass Production Illustration",
        unitCode: "FAS/OS/60/03-A",
        date: "2026-05-22",
        duration: 4,
        status: "Present",
        remarks: "Multi-size grading templates, seam overlay settings, and plotter layouts session."
      }
    ]
  }
};

/**
 * Kenyan TVET CDACC Curricula definitions for National Certificate (Lvl 4) & Craft Certificate (Lvl 5).
 * Level 6 is manually detailed as direct static trade keys above.
 */
interface UnitMeta {
  code: string;
  name: string;
  hours: number;
  creditHours: number;
}

const LEVEL_PRESETS: Record<string, Record<number, { title: string; prefix: string; units: UnitMeta[] }>> = {
  ict: {
    4: {
      title: "Certificate in ICT Support (Level 4)",
      prefix: "ICT-CT4-",
      units: [
        { code: "ICT/OS/4/1-A", name: "Perform Basic Word Processing", hours: 40, creditHours: 4 },
        { code: "ICT/OS/4/2-A", name: "Inputting and Processing Data", hours: 45, creditHours: 4 },
        { code: "ICT/OS/4/3-A", name: "Basic Software Installation & Troubleshooting", hours: 50, creditHours: 5 },
        { code: "ICT/OS/4/4-A", name: "Basic Internet and Email Communications", hours: 35, creditHours: 3 }
      ]
    },
    5: {
      title: "Craft Certificate in Information Technology (Level 5)",
      prefix: "ICT-CR5-",
      units: [
        { code: "ICT/OS/5/1-A", name: "Run Workstation Operating Systems", hours: 50, creditHours: 5 },
        { code: "ICT/OS/5/2-A", name: "Perform Word Processing and Spreadsheets", hours: 60, creditHours: 6 },
        { code: "ICT/OS/5/3-A", name: "Connect Basic Local Area Network (LAN) Nodes", hours: 70, creditHours: 7 },
        { code: "ICT/OS/5/4-A", name: "Design Basic Structured Queries (SQL)", hours: 75, creditHours: 7 },
        { code: "ICT/OS/5/5-A", name: "Write Structured Program Routines", hours: 80, creditHours: 8 }
      ]
    }
  },
  electrical: {
    4: {
      title: "Certificate in Electrical Installation (Level 4)",
      prefix: "ELE-CT4-",
      units: [
        { code: "ELE/OS/4/1-A", name: "Perform Single Phase Domestic Wiring", hours: 50, creditHours: 5 },
        { code: "ELE/OS/4/2-A", name: "Fit Electrical Metal Conduits and Pipes", hours: 45, creditHours: 4 },
        { code: "ELE/OS/4/3-A", name: "Repair Domestic Electrical Appliances", hours: 40, creditHours: 4 }
      ]
    },
    5: {
      title: "Craft Certificate in Electrical Power Option (Level 5)",
      prefix: "ELE-CR5-",
      units: [
        { code: "ELE/OS/5/1-A", name: "Interpret Electrical Schematics & Layouts", hours: 60, creditHours: 6 },
        { code: "ELE/OS/5/2-A", name: "Install Industrial 3-Phase Motors & Motor Starters", hours: 75, creditHours: 7 },
        { code: "ELE/OS/5/3-A", name: "Solar Photovoltaic Systems Installation & Wiring", hours: 70, creditHours: 7 },
        { code: "ELE/OS/5/4-A", name: "Perform Cable Joints and Earthing Terminations", hours: 65, creditHours: 6 }
      ]
    }
  },
  hospitality: {
    4: {
      title: "Certificate in Food and Beverage Artisanry (Level 4)",
      prefix: "FAB-CT4-",
      units: [
        { code: "FAB/OS/4/1-A", name: "Clean and Sanitize Kitchen Spaces", hours: 40, creditHours: 4 },
        { code: "FAB/OS/4/2-A", name: "Basic Preparations of Vegetables and Fruits", hours: 45, creditHours: 4 },
        { code: "FAB/OS/4/3-A", name: "Bake Basic Pastry Products & Desserts", hours: 50, creditHours: 5 }
      ]
    },
    5: {
      title: "Craft Certificate in Food & Beverage Production (Level 5)",
      prefix: "FAB-CR5-",
      units: [
        { code: "FAB/OS/5/1-A", name: "Implement Safe Food Handling & Hygiene", hours: 55, creditHours: 5 },
        { code: "FAB/OS/5/2-A", name: "Cook Main Course Dishes (Meat, Poultry, Fish)", hours: 80, creditHours: 8 },
        { code: "FAB/OS/5/3-A", name: "Run Restaurant Beverage Station operations", hours: 60, creditHours: 6 },
        { code: "FAB/OS/5/4-A", name: "Recipe Sizing and Commercial Buffet Production", hours: 75, creditHours: 7 }
      ]
    }
  },
  construction: {
    4: {
      title: "Certificate in Artisanry Masonry & Blockwork (Level 4)",
      prefix: "CIV-CT4-",
      units: [
        { code: "CIV/OS/4/1-A", name: "Prepare Mortar mix and brickwork foundations", hours: 45, creditHours: 4 },
        { code: "CIV/OS/4/2-A", name: "Lay Stone & Block Walls in structures", hours: 55, creditHours: 5 },
        { code: "CIV/OS/4/3-A", name: "Basic Site Demarcations & Hand Tools handling", hours: 40, creditHours: 4 }
      ]
    },
    5: {
      title: "Craft Certificate in Building Construction (Level 5)",
      prefix: "CIV-CR5-",
      units: [
        { code: "CIV/OS/5/1-A", name: "Read Structural Blueprinted Concrete Schematics", hours: 60, creditHours: 6 },
        { code: "CIV/OS/5/2-A", name: "Frame timber formwork and structural scaffolding", hours: 70, creditHours: 7 },
        { code: "CIV/OS/5/3-A", name: "Cast reinforced concrete columns and slab parts", hours: 80, creditHours: 8 },
        { code: "CIV/OS/5/4-A", name: "Site Levelling using dumpy level structures", hours: 65, creditHours: 6 }
      ]
    }
  },
  automotive: {
    4: {
      title: "Certificate in Automotive Artisan Mechanics (Level 4)",
      prefix: "AUT-CT4-",
      units: [
        { code: "AUT/OS/4/1-A", name: "Perform Basic Engine Servicing (Filters & Oils)", hours: 45, creditHours: 4 },
        { code: "AUT/OS/4/2-A", name: "Overhaul drum brake components & alignment", hours: 50, creditHours: 5 },
        { code: "AUT/OS/4/3-A", name: "Repair suspension bushings & shock struts", hours: 40, creditHours: 4 }
      ]
    },
    5: {
      title: "Craft Certificate in Automotive Engineering (Level 5)",
      prefix: "AUT-CR5-",
      units: [
        { code: "AUT/OS/5/1-A", name: "Diagnose petrol engine fuel feeds & sparks", hours: 70, creditHours: 7 },
        { code: "AUT/OS/5/2-A", name: "Service manual clutches & gearbox synchromesh", hours: 75, creditHours: 7 },
        { code: "AUT/OS/5/3-A", name: "Diagnose basic chassis wiring and relay loops", hours: 60, creditHours: 6 },
        { code: "AUT/OS/5/4-A", name: "Maintain vehicle hydraulic braking networks", hours: 65, creditHours: 6 }
      ]
    }
  },
  agriculture: {
    4: {
      title: "Certificate in General Agriculture Artisanry (Level 4)",
      prefix: "AGR-CT4-",
      units: [
        { code: "AGR/OS/4/1-A", name: "Sow Field crops and vegetable nursery seeds", hours: 40, creditHours: 4 },
        { code: "AGR/OS/4/2-A", name: "Apply fertilizers and crop nutrition spray feeds", hours: 45, creditHours: 4 },
        { code: "AGR/OS/4/3-A", name: "Basic rearing guidelines for poultry & livestock", hours: 50, creditHours: 5 }
      ]
    },
    5: {
      title: "Craft Certificate in General Agriculture (Level 5)",
      prefix: "AGR-CR5-",
      units: [
        { code: "AGR/OS/5/1-A", name: "Design greenhouse layouts & drip feed lines", hours: 65, creditHours: 6 },
        { code: "AGR/OS/5/2-A", name: "Formulate poultry and cattle feeds", hours: 60, creditHours: 6 },
        { code: "AGR/OS/5/3-A", name: "Perform soil sampling and nutrient analysis", hours: 75, creditHours: 7 },
        { code: "AGR/OS/5/4-A", name: "Set up bee nurseries & apiculture honey harvests", hours: 55, creditHours: 5 }
      ]
    }
  },
  business: {
    4: {
      title: "Certificate in Office Administration (Level 4)",
      prefix: "BUS-CT4-",
      units: [
        { code: "BUS/OS/4/1-A", name: "Perform Office Filing and Records Management", hours: 40, creditHours: 4 },
        { code: "BUS/OS/4/2-A", name: "Handle Customer Service Desk interactions", hours: 45, creditHours: 4 },
        { code: "BUS/OS/4/3-A", name: "Maintain Petty Cash records & ledger logs", hours: 35, creditHours: 3 }
      ]
    },
    5: {
      title: "Craft Certificate in Business Management (Level 5)",
      prefix: "BUS-CR5-",
      units: [
        { code: "BUS/OS/5/1-A", name: "Process General Ledger Journal entry books", hours: 60, creditHours: 6 },
        { code: "BUS/OS/5/2-A", name: "Handle payroll & statutory tax (PAYE/NSSF)", hours: 65, creditHours: 6 },
        { code: "BUS/OS/5/3-A", name: "Perform Sacco customer records auditing", hours: 70, creditHours: 7 },
        { code: "BUS/OS/5/4-A", name: "Maintain warehouse inventories and tracking files", hours: 60, creditHours: 6 }
      ]
    }
  },
  fashion: {
    4: {
      title: "Certificate in Fashion Design & Tailoring (Level 4)",
      prefix: "FAS-CT4-",
      units: [
        { code: "FAS/OS/4/1-A", name: "Stitch basic seams and pockets profiles", hours: 45, creditHours: 4 },
        { code: "FAS/OS/4/2-A", name: "Cut patterns and fabrics safely", hours: 40, creditHours: 4 },
        { code: "FAS/OS/4/3-A", name: "Operate domestic embroidery & lockstitch", hours: 50, creditHours: 5 }
      ]
    },
    5: {
      title: "Craft Certificate in Fashion Design (Level 5)",
      prefix: "FAS-CR5-",
      units: [
        { code: "FAS/OS/5/1-A", name: "Prepare classic shirt patterns and trouser blocks", hours: 75, creditHours: 7 },
        { code: "FAS/OS/5/2-A", name: "Analyze fabric compositions & fiber burn properties", hours: 60, creditHours: 6 },
        { code: "FAS/OS/5/3-A", name: "Perform manual resist dyeing (Tie & Dye, Batik)", hours: 65, creditHours: 6 },
        { code: "FAS/OS/5/4-A", name: "Assemble finished garments matching criteria", hours: 80, creditHours: 8 }
      ]
    }
  }
};

// Procedural population of Certificate (Level 4) and Craft (Level 5) sets to keep bundle sizes slim but content high-fidelity
Object.keys(LEVEL_PRESETS).forEach((tradeKey) => {
  const levels = LEVEL_PRESETS[tradeKey];
  Object.keys(levels).forEach((levelStr) => {
    const levelNum = parseInt(levelStr);
    const { title, prefix, units } = levels[levelNum];
    
    const formattedUnits = units.map((u, idx) => {
      const poeStatus = [PoEStatus.CERTIFIED, PoEStatus.READY_FOR_ASSESSMENT, PoEStatus.IN_PROGRESS, PoEStatus.NOT_STARTED][idx % 4];
      const competenceStatus = poeStatus === PoEStatus.CERTIFIED 
        ? CompetenceStatus.COMPETENT 
        : poeStatus === PoEStatus.READY_FOR_ASSESSMENT 
        ? CompetenceStatus.COMPETENT 
        : CompetenceStatus.ONGOING;
      
      const attPercentages = [94, 82, 74, 80];
      const attPct = attPercentages[idx % attPercentages.length];
      const hoursAttended = Math.round((attPct / 100) * u.hours);
      
      // Standard continuous assessments
      const assessments = [];
      if (poeStatus !== PoEStatus.NOT_STARTED) {
        assessments.push({
          id: `as-${tradeKey}-${levelNum}-${idx}-cat1`,
          title: `Continuous Assessment (CAT 1 on ${u.name})`,
          type: "CAT" as const,
          obtainedScore: [78, 64, 82, 59][idx % 4],
          weight: 30,
          date: `2026-02-${10 + idx * 4}`,
          feedback: "Accomplished with core syllabus standard compliance guidelines.",
          status: CompetenceStatus.COMPETENT
        });
        
        if (poeStatus === PoEStatus.CERTIFIED || poeStatus === PoEStatus.READY_FOR_ASSESSMENT) {
          assessments.push({
            id: `as-${tradeKey}-${levelNum}-${idx}-proj`,
            title: `Practical Demonstration Portfolio Task: ${u.name}`,
            type: "Practical Project" as const,
            obtainedScore: [83, 70, 78, 88][idx % 4],
            weight: 30,
            date: `2026-03-${14 + idx * 3}`,
            feedback: "Exceptional skills mastery demonstrated. Signed off safely in workshop logs.",
            status: CompetenceStatus.COMPETENT
          });
          
          if (poeStatus === PoEStatus.CERTIFIED) {
            assessments.push({
              id: `as-${tradeKey}-${levelNum}-${idx}-exam`,
              title: `End of Unit Competency Assessment (National Board standard)`,
              type: "Internal Exam" as const,
              obtainedScore: [70, 75, 68, 82][idx % 4],
              weight: 40,
              date: `2026-04-${20 + idx * 2}`,
              feedback: "Approved and authenticated under Kenya CDACC Joint Registry board.",
              status: CompetenceStatus.COMPETENT
            });
          }
        }
      }
      
      return {
        id: prefix + (idx + 1),
        code: u.code,
        name: u.name,
        level: levelNum,
        creditHours: u.creditHours,
        hoursRequired: u.hours,
        hoursAttended,
        poeStatus,
        competenceStatus,
        assessments
      };
    });

    const deadlines = formattedUnits.slice(0, 2).map((u, i) => ({
      id: `dl-${tradeKey}-${levelNum}-${i}`,
      unitId: u.id,
      unitName: u.name,
      title: i === 0 ? "Compile PoE Logbook Binder" : "Practical Skills Board Assessment",
      dueDate: `2026-06-0${4 + i * 6}`,
      type: (i === 0 ? "PoE Submission" : "CDACC National Exam") as any,
      description: `Complete and present validated scripts for units on ${u.name}.`,
      completed: false
    }));

    const attendanceLogs = formattedUnits.map((u, i) => ({
      id: `att-${tradeKey}-${levelNum}-${i}`,
      unitId: u.id,
      unitName: u.name,
      unitCode: u.code,
      date: `2026-05-${14 + i * 2}`,
      duration: 3,
      status: (i % 6 === 0 ? "Absent (Unexcused)" : "Present") as any,
      remarks: `Study session for Unit component ${u.name}.`
    }));

    CDACC_CURRICULA_PRESETS[`${tradeKey}_${levelNum}`] = {
      student: {
        name: "Derrick Ngure",
        admissionNo: `TVET/KAP/${tradeKey.toUpperCase().substring(0, 3)}/2025/${2000 + levelNum * 123 + tradeKey.length * 17}`,
        courseName: title,
        institution: "Kabete National Polytechnic, Nairobi",
        cohort: "2025/2026 Intake (Year 1, Sem 1)",
        photoUrl: "",
        email: "derrickngure39@gmail.com"
      },
      units: formattedUnits,
      deadlines,
      attendanceLogs
    };
  });
});

// Alias default level 6 presets to trade_6 and base key mappings to guarantee compatibility.
Object.keys(CDACC_CURRICULA_PRESETS).forEach((tradeKey) => {
  if (!tradeKey.includes("_")) {
    CDACC_CURRICULA_PRESETS[`${tradeKey}_6`] = { ...CDACC_CURRICULA_PRESETS[tradeKey] };
  }
});
// Verify and map base keys to level 6 by default
["ict", "electrical", "hospitality", "construction", "automotive", "agriculture", "business", "fashion"].forEach((k) => {
  if (!CDACC_CURRICULA_PRESETS[k]) {
    CDACC_CURRICULA_PRESETS[k] = CDACC_CURRICULA_PRESETS[`${k}_6`] || CDACC_CURRICULA_PRESETS[`${k}_5`];
  }
});

// Default Initial Baseline
export const initialCDACCData: CDACCDashboardData = CDACC_CURRICULA_PRESETS.ict_6;

