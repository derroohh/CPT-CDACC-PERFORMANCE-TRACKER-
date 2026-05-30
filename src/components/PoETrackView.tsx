/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CDACCDashboardData, UnitOfLearning, PoEStatus } from "../types.ts";
import { 
  BookOpen, 
  FolderCheck, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  Save,
  Laptop, 
  Zap, 
  Utensils, 
  Hammer, 
  Car, 
  Sprout, 
  Briefcase, 
  Scissors, 
  ChevronDown, 
  ChevronUp, 
  UserCheck, 
  Award, 
  ClipboardList,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CDACC_CURRICULA_PRESETS } from "../initialData.ts";

interface PoETrackViewProps {
  data: CDACCDashboardData;
  onUpdatePoEStatus: (unitId: string, status: PoEStatus) => void;
  onSelectUnitForAI: (unitCode: string) => void;
  onLoadCurriculaPreset?: (key: string) => void;
}

// Deeply documented database mapping every CDACC unit code/ID to its specific topics & evidence needs.
const SYLLABUS_DETAILS_MAP: Record<string, { topics: string[]; evidenceRequired: string[]; standards: string }> = {
  // ICT
  "ICT-OS-60-01": {
    topics: [
      "Operating System administration baseline (Windows, Linux CLI, directory tree manipulation)",
      "Technical typography: Formatting official TVET reports, document hierarchies, page grids, style templates",
      "Dynamic data calculations: Nested IF clauses, lookup indexes (VLOOKUP, INDEX-MATCH), trend lines, spreadsheets charts",
      "Relational database tables definition, queries basics, internet secure search parameters"
    ],
    evidenceRequired: [
      "Completed Office Productivity suite practical task logs (Word/Excel)",
      "Academic research project proposal draft with correct typography styling",
      "Dynamic classroom grade spreadsheet with multi-argument calculations"
    ],
    standards: "CDACC Digital Literacy Baseline (ICT/OS/60/01-A)"
  },
  "ICT-OS-60-02": {
    topics: [
      "System components identification, matching specifications, static electricity safety protocols",
      "BIOS/UEFI low-level setups, boot parameters adjustments, secure boot activation",
      "Disk partitioning schemes (GPT vs MBR), file systems structure (NTFS, ext4, APFS)",
      "Motherboard diagnostics testing, system error codes, and driver installs"
    ],
    evidenceRequired: [
      "Diagnostics checklists of motherboard memory, CMOS battery, and capacitor checks",
      "Multi-OS installation logs (Dual Boot setup windows + Ubuntu Linux)",
      "Hardware inspection checklist signed by lab assessor"
    ],
    standards: "CDACC Hardware Maintenance Specification (ICT/OS/60/02-A)"
  },
  "ICT-OS-60-03": {
    topics: [
      "OSI layer architecture & frame header encapsulations",
      "IP addressing schemes, classless inter-domain routing (CIDR) & variable length subnet masking (VLSM)",
      "UTP cable termination standards (TIA/EIA-568A vs 568B) using RJ-45 & field verification",
      "VLAN segmentation planning, routing protocols setup (single-area OSPFv2) on manageable switches"
    ],
    evidenceRequired: [
      "Cisco Packet Tracer blueprint files showing router subinterfaces and trunking",
      "UTP Cat6 custom terminated patch cable tested green on analog tester with photos",
      "VLAN mapping tables spreadsheet listing subnet ranges & IP allocation plans"
    ],
    standards: "CDACC Computer Networking Core Code (ICT/OS/60/03-A)"
  },
  "ICT-OS-60-04": {
    topics: [
      "Database normal forms calculations (1NF, 2NF, 3NF, Boyce-Codd normal form)",
      "Entity-Relationship diagrams mapping, Primary-Foreign key validations, cardinality rules",
      "SQL structured queries tuning, multi-table JOIN operations, subqueries, relational triggers",
      "Database backup regimes (logical dumps vs physical snapshots), access roles (GRANT, REVOKE)"
    ],
    evidenceRequired: [
      "Enterprise Database Schema ERD blueprint signed by internal verifier",
      "Comprehensive SQL file scripts containing complex joins, subqueries, and aggregations",
      "MySQL backup script automation crontab configuration"
    ],
    standards: "CDACC Database Systems Guideline (ICT/OS/60/04-A)"
  },
  "ICT-OS-60-05": {
    topics: [
      "Object-Oriented Programming (OOP) design patterns (Inheritance, Polymorphism, Encapsulation)",
      "API integrations using RESTful architectures and JSON serialization parsing",
      "Software Development Lifecycle (SDLC) models, agile scrum sprint methodologies",
      "State preservation mechanisms, web application component rendering cycles"
    ],
    evidenceRequired: [
      "Responsive React functional application with component modular folder structures",
      "Published GitHub repository history containing multiple documented dev commits",
      "Detailed JUnit or Jest unit testing script coverage diagnostics logs"
    ],
    standards: "CDACC Professional Applications Dev Standards (ICT/OS/60/05-A)"
  },

  // Electrical
  "ELE-OS-PO-01-6": {
    topics: [
      "Direct Current (DC) circuit parameters calculations using Kirchhoff's Mesh & Nodal laws",
      "Alternating Current (AC) fundamentals: Impedance triangle, power factor adjustments, phase boundaries",
      "Electromagnetic induction properties: Lenz's Law, magnetic flux, loop formulas",
      "Precision measurement instrumentation handling: Oscilloscopes, megohmmeter (Megger), clamp-on meters"
    ],
    evidenceRequired: [
      "Solved Kirchhoff network network analysis worksheets",
      "AC circuit frequency frequency response curves plotting curves",
      "Multimeter verification calibration logs and classroom laboratory notes"
    ],
    standards: "CDACC Electrical Principles baseline (ELE/OS/PO/01/6-A)"
  },
  "ELE-OS-PO-02-6": {
    topics: [
      "Domestic layout practices complying with IEE wiring regulations standards",
      "Conduit bending techniques, trunking installation & secure wall routing",
      "Consumer units and master distribution boards termination layouts",
      "Radial circuit topologies, rings main, three-way lighting selectors"
    ],
    evidenceRequired: [
      "Manual drafting design schematic of a domestic consumer unit routing plan",
      "Loop impedance and insulation resistance values records sheet",
      "Practical project photos of completed surface wiring mock panel"
    ],
    standards: "CDACC Domestic Wiring Standard (ELE/OS/PO/02/6-A)"
  },
  "ELE-OS-PO-03-6": {
    topics: [
      "Three-phase AC induction motors construction, windings coil tests",
      "Starter control systems setup: Direct-On-Line (DOL), Forward-Reverse, Star-Delta manual starters",
      "Transformer copper-iron losses calculation, testing oil hydration levels",
      "AC Power generator synchronization checks, phase sequence, grid coupling requirements"
    ],
    evidenceRequired: [
      "Wiring schematics of electromagnetic Star-Delta motor starter with control logic",
      "Stator coils insulation resistance logs signed by classroom verifier",
      "Generators phase sequencing testing logs spreadsheet"
    ],
    standards: "CDACC Electrical Machinery Specification (ELE/OS/PO/03/6-A)"
  },

  // Hospitality / Culinary Arts (FAB)
  "FAB-OS-01-6": {
    topics: [
      "HACCP standard operating steps for modern professional kitchens",
      "Cross-contamination risks mitigation, thermal boundaries for food poisoning safety",
      "Sanitization chemicals mixing concentrations, surface testing strips",
      "Commercial grease traps clearing intervals, waste disposal guidelines"
    ],
    evidenceRequired: [
      "Weekly Kitchen Hygiene checklist log sheets",
      "Valid food handler medical fitness certificate copy",
      "HACCP flow chart mapped for high-risk poultry storage"
    ],
    standards: "CDACC Global Kitchen Hygiene Guideline (FAB/OS/01/6-A)"
  },
  "FAB-OS-02-6": {
    topics: [
      "White and brown stocks cooking methods & clarification procedures",
      "Mother Sauces building (Béchamel, Velouté, Espagnole, Tomato, Hollandaise)",
      "Knife skills execution & cutting types (Julienne, Brunoise, Paysanne, Chiffonade)",
      "Traditional clear and cream soups portioning, consistency scaling"
    ],
    evidenceRequired: [
      "Stocks recipe sheets with preparation logs",
      "High-resolution photos of cut dimensions on grading board",
      "Espagnole sauce consistency and reduction logs spreadsheet"
    ],
    standards: "CDACC Classical Underpinning Culinary Standards (FAB/OS/02/6-A)"
  },
  "FAB-OS-03-6": {
    topics: [
      "Industrial menu planning, pricing strategies, yields ratios",
      "Continental main courses fabrication (Beef, Pork, Poultry, Seafood)",
      "Modern molecular gastronomy elements & stylish plate decoration",
      "Ingredient portion controls & cold station salad buffet setups"
    ],
    evidenceRequired: [
      "Continental three-course exam meal plating photo folder",
      "Standard Recipe Yield costing card containing profit margins",
      "Sensory evaluation sheets signed by internal exam assessors"
    ],
    standards: "CDACC High-Volume Gastronomy Standard (FAB/OS/03/6-A)"
  },

  // Civil / Construction (CIV)
  "CIV-OS-01-6": {
    topics: [
      "Structural load analytics (Dead, Live, Wind, and Seismic forces)",
      "Bending moment & Shear force calculations for supported beams",
      "Soil mechanics: shear strength, bearing capacity and compaction",
      "Stresses in materials: elastic modulus, tensile tests and yield limits"
    ],
    evidenceRequired: [
      "Solved beam load calculation reports containing BMD/SFD graphs",
      "Laboratory concrete cube compression crushing test certificate",
      "Soil sieve analysis grading curves spreadsheet charting"
    ],
    standards: "CDACC Building Mechanics Standard (CIV/OS/01/6-A)"
  },
  "CIV-OS-02-6": {
    topics: [
      "Levelling techniques: Height of Instrument vs Rise and Fall methods",
      "Theodolite traverse Surveys and Total Station layout surveying",
      "Contour mapping, excavation volume calculation and profiling",
      "GPS survey coordination and land boundaries mapping"
    ],
    evidenceRequired: [
      "AutoCAD formatted contour layout plan drawings",
      "Field notebook traverse alignment checks and correction sheets",
      "Differential leveling traverse loop closure computations log"
    ],
    standards: "CDACC Land Surveying Specification (CIV/OS/02/6-A)"
  },
  "CIV-OS-03-6": {
    topics: [
      "Reinforced concrete structure drafting detailing: beams, slabs, columns",
      "AutoCAD software operations: layer setups, scaling, hatching layouts",
      "Structural steel trusses connection designs and fasteners layouts",
      "Building regulation codes & compliance approvals templates"
    ],
    evidenceRequired: [
      "Certified 2D floor plans, sections & elevations architectural blueprints",
      "Dynamic structural steel roof truss design drawings file",
      "Bending schedule table calculations worksheet printouts"
    ],
    standards: "CDACC CAD and Building Drafting Specification (CIV/OS/03/6-A)"
  },

  // Automotive (AUT)
  "AUT-OS-01-6": {
    topics: [
      "Internal combustion engine 4-stroke thermal cycles mechanics",
      "Engine block cylinder gauging, micrometer clearances and wear assessment",
      "Cylinder head reconditioning: valves grinding, clearance adjustments",
      "Lubrication & Cooling systems overhaul diagnostics & repair loops"
    ],
    evidenceRequired: [
      "Engine cylinder micrometer taper log sheets with wear maps",
      "Cylinder head valves compression values test certificates",
      "Torque wrench sequence diagram layout signed by trainer"
    ],
    standards: "CDACC Engine Overhaul Standard (AUT/OS/01/6-A)"
  },
  "AUT-OS-02-6": {
    topics: [
      "Manual gearboxes ratios calculation, gears wear and synchronic meshes",
      "Automatic transmissions: epicyclic gear chains, torque converters",
      "Differential drives and constant velocity joint axles assembly",
      "Clutch mechanisms: slave cylinders, pressure plates alignments"
    ],
    evidenceRequired: [
      "Transmissions overhaul components identification photo catalog",
      "Gearbox ratio simulation calculation spreadsheet files",
      "Clutch installation step-by-step clearance records sheet"
    ],
    standards: "CDACC Transmission Systems Standard (AUT/OS/02/6-A)"
  },
  "AUT-OS-03-6": {
    topics: [
      "Automotive multiplex networks: Controller Area Network (CAN bus) logs",
      "Diagnostic scan tools operations: OBD-II codes, real-time live logs",
      "Automotive sensors (O2, MAF, Crankshaft, Knock) wave profiling",
      "Battery health profiling, alternator output voltage & starter currents"
    ],
    evidenceRequired: [
      "OBD-II scanner fault codes report and live parameters dumps",
      "Automobile alternator voltage waveform analysis graphs",
      "Chassis wiring system testing checklist logs sheet"
    ],
    standards: "CDACC Vehicle Electronics Standard (AUT/OS/03/6-A)"
  },

  // Agriculture (AGR)
  "AGR-OS-60-01": {
    topics: [
      "Greenhouse Siting, structure layouts & thermal venting systems",
      "Drip irrigation installation layout and water friction heads sizing",
      "Integrated Pest Management (IPM) biological and chemical controls",
      "Seedbed nursery preparation and germinating media formulation rules"
    ],
    evidenceRequired: [
      "Drip irrigation hydraulic layout calculations",
      "Weekly tomato greenhouse environmental logging sheets",
      "Nursery crop development photo journal signed by assessor"
    ],
    standards: "CDACC Agro-Crops Production Code (AGR/OS/60/01-A)"
  },
  "AGR-OS-60-02": {
    topics: [
      "Animal nutrition calculation: dry matter intake, crude protein balancing",
      "Artificial Insemination (AI) sterile procedures & genetics metrics",
      "Poultry brooding cycles & temperature controls blueprints",
      "Silage preparation: compression and structural sealing methods"
    ],
    evidenceRequired: [
      "Dairy Cow Crude Protein rationing formula calculations spreadsheet",
      "Official Artificial Insemination (AI) field log sheet",
      "Silage pit temperature and moisture logs tracker"
    ],
    standards: "CDACC Livestock Breeding Standard (AGR/OS/60/02-A)"
  },
  "AGR-OS-60-03": {
    topics: [
      "Soil sampling styles & field laboratory prep procedures",
      "Spectrophotometric soil nutrient testing (N, P, K components)",
      "Soil acidity neutralization calculations (Liming rates mapping)",
      "Industrial fertilizer application protocols and agronomic rotations"
    ],
    evidenceRequired: [
      "Spectrophotometric soil test readings log report sheet",
      "Rift Valley volcanic soil liming rate calculations sheet",
      "Composting organic ratios composition table calculations"
    ],
    standards: "CDACC Soil Nutrient Management standard (AGR/OS/60/03-A)"
  },

  // Business Management (BUS)
  "BUS-OS-60-01": {
    topics: [
      "Hersey-Blanchard situational leadership models mapping",
      "Organization structure design and functional departmentation",
      "Corporate governance guidelines & regulatory compliance in SACCOs",
      "Conflict management resolution protocols and labor laws of Kenya"
    ],
    evidenceRequired: [
      "Standard corporate departmentation layout structure blueprint",
      "Case analysis diary of cooperative leadership scenarios",
      "Employee dispute negotiation template documentation"
    ],
    standards: "CDACC Corporate Leadership Specification (BUS/OS/60/01-A)"
  },
  "BUS-OS-60-02": {
    topics: [
      "Double-entry bookkeeping accounts, consolidated ledgers & Trial Balance",
      "Bank reconciliation statements tracking & deposits adjustment logs",
      "Costing methods: FIFO, LIFO, Weighted Average Valuation audits",
      "Partnership liquidation adjustments and cash distribution schedules"
    ],
    evidenceRequired: [
      "Consolidated Balance Sheet ledger spreadsheets",
      "Solved Bank Statement Reconciliation lab worksheet reports",
      "Inventory Valuations audit checklist spreadsheets"
    ],
    standards: "CDACC Financial ledger Accounting Code (BUS/OS/60/02-A)"
  },
  "BUS-OS-60-03": {
    topics: [
      "The Procurement Lifecycle: Sourcing, requisitioning, purchase orders",
      "Economic Order Quantity (EOQ) optimization mathematical formula",
      "Warehouse safety compliance steps and layout logistics planning",
      "Vendor performance assessment criteria and selection scorecard"
    ],
    evidenceRequired: [
      "Solved Procurement Cycle audit scorecard files",
      "Calculated EOQ & safety stocks balance equations maps",
      "Warehouse safety standard audit assessment report templates"
    ],
    standards: "CDACC Procurement & Supply Chain Standard (BUS/OS/60/03-A)"
  },

  // Fashion Design (FAS)
  "FAS-OS-60-01": {
    topics: [
      "Garments bodice block pattern manipulation and style lines",
      "Sleeves pattern drafting and cuff grading techniques",
      "Tailors jacket layout construction with linings and interfacing",
      "Collar grading, notches placement and seam allowance margins"
    ],
    evidenceRequired: [
      "1:5 Scaled bodice, skirt, and trousers draft layouts",
      "Finished men jacket lining photo evidence sheets",
      "Draft adjustments measurement logs table sheets"
    ],
    standards: "CDACC Pattern Drafting baseline (FAS/OS/60/01-A)"
  },
  "FAS-OS-60-02": {
    topics: [
      "Microscopic identification & chemical structure of textile fibers",
      "Fiber thermal burning behaviors analytical log sheet",
      "Vat dye chemical composition, coloring fastness rating scales",
      "Organic weaving configurations and thread count metrics"
    ],
    evidenceRequired: [
      "Dye formulation ratios sheet for natural indigo colors",
      "Weekly fiber thermal burning logs diary report sheets",
      "Fabric colorfastness test result files signed by Assessor"
    ],
    standards: "CDACC Textile Chemical Science specification (FAS/OS/60/02-A)"
  },
  "FAS-OS-60-03": {
    topics: [
      "CAD pattern drafting: Gerber / Optitex workstation guidelines",
      "Digital multi-size grading & nesting optimizations layouts",
      "Digital croquis illustration & capsules clothing coloring design",
      "Nesting files compilation, scaling configurations and plot layouts"
    ],
    evidenceRequired: [
      "Completed Gerber workstation CAD grading layout file prints",
      "Fabric utilization rate calculator sheets showing above 85% yield",
      "Digital capsule fashion collection design illustrations folder"
    ],
    standards: "CDACC Computer-Aided Fashion Design rules (FAS/OS/60/03-A)"
  }
};

export default function PoETrackView({
  data,
  onUpdatePoEStatus,
  onSelectUnitForAI,
  onLoadCurriculaPreset,
}: PoETrackViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"portfolio" | "catalog">("portfolio");
  const [selectedUnitId, setSelectedUnitId] = useState<string>(data.units[0]?.id || "");
  const [selectedCatalogCourse, setSelectedCatalogCourse] = useState<string>("ict");
  const [expandedCatalogUnitId, setExpandedCatalogUnitId] = useState<string>("");

  // Setup checklists matching My Active Portfolio
  const [checklists, setChecklists] = useState<Record<string, boolean[]>>(() => {
    const initialChecklistState: Record<string, boolean[]> = {};
    data.units.forEach((u) => {
      if (u.poeStatus === PoEStatus.CERTIFIED) {
        initialChecklistState[u.id] = [true, true, true, true];
      } else if (u.poeStatus === PoEStatus.READY_FOR_ASSESSMENT) {
        initialChecklistState[u.id] = [true, true, true, false];
      } else if (u.poeStatus === PoEStatus.IN_PROGRESS) {
        initialChecklistState[u.id] = [true, true, false, false];
      } else {
        initialChecklistState[u.id] = [false, false, false, false];
      }
    });
    return initialChecklistState;
  });

  const handleToggleCheck = (unitId: string, index: number) => {
    const updatedChecks = [...(checklists[unitId] || [false, false, false, false])];
    updatedChecks[index] = !updatedChecks[index];
    
    const nextChecklists = { ...checklists, [unitId]: updatedChecks };
    setChecklists(nextChecklists);

    const trueCount = updatedChecks.filter(Boolean).length;
    let nextStatus = PoEStatus.NOT_STARTED;
    if (trueCount === 4) {
      nextStatus = PoEStatus.CERTIFIED;
    } else if (trueCount === 3) {
      nextStatus = PoEStatus.READY_FOR_ASSESSMENT;
    } else if (trueCount > 0) {
      nextStatus = PoEStatus.IN_PROGRESS;
    }

    onUpdatePoEStatus(unitId, nextStatus);
  };

  const selectedUnit = data.units.find((u) => u.id === selectedUnitId) || data.units[0];
  const selectedChecks = checklists[selectedUnit?.id] || [false, false, false, false];
  const completedCount = selectedChecks.filter(Boolean).length;
  const progressPct = Math.round((completedCount / 4) * 100);

  const checklistDescriptions = [
    {
      title: "Course Register & Unit Descriptor Signature",
      desc: "Trainee-signed introductory checklist confirming study objectives and hours of engagement are fully understood.",
    },
    {
      title: "Verifiable CAT Sheets (Signed by Assessor)",
      desc: "Institution-verified scripts for CAT 1 and CAT 2 displaying grades above 50% threshold for registration eligibility.",
    },
    {
      title: "CDACC F4 Record Form (Signed Assessor Log)",
      desc: "Official assessor confirmation of competencies logged during lab activities, checked by internal verifiers.",
    },
    {
      title: "Practical Evidence Report / Photos of Deliverables",
      desc: "Student portfolio items including code screenshots, wiring designs, configuration tables, or structural logs.",
    },
  ];

  // List of catalog courses mapped with metadata and icons
  const catalogCourses = [
    { key: "ict", title: "Information Comm Tech (ICT)", code: "IT-OS-60-LEVEL6", icon: Laptop, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { key: "electrical", title: "Electrical Engineering", code: "EE-OS-PO-LEVEL6", icon: Zap, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { key: "hospitality", title: "Hospitality & Food Beverage", code: "FAB-OS-LEVEL6", icon: Utensils, color: "text-rose-600 bg-rose-50 border-rose-100" },
    { key: "construction", title: "Civil & Building Construction", code: "CE-OS-LEVEL6", icon: Hammer, color: "text-cyan-600 bg-cyan-50 border-cyan-100" },
    { key: "automotive", title: "Automotive Engineering", code: "AU-OS-LEVEL6", icon: Car, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { key: "agriculture", title: "Agriculture / Agro-Business", code: "AGR-OS-LEVEL6", icon: Sprout, color: "text-teal-600 bg-teal-50 border-teal-100" },
    { key: "business", title: "Business Management", code: "BUS-OS-LEVEL6", icon: Briefcase, color: "text-violet-600 bg-violet-50 border-violet-100" },
    { key: "fashion", title: "Fashion Design & Textile", code: "FAS-OS-LEVEL6", icon: Scissors, color: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100" }
  ];

  const currentSelectionPreset = CDACC_CURRICULA_PRESETS[selectedCatalogCourse] || CDACC_CURRICULA_PRESETS.ict;
  const isEnrolledInCatalogSelection = data.student.courseName === currentSelectionPreset.student.courseName;

  return (
    <div className="space-y-6">
      
      {/* Dynamic Sub-tab Switcher Bar with Premium Theme */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 border border-slate-200/80 p-2.5 rounded-2xl gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/50 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab("portfolio")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold font-sans transition flex items-center justify-center gap-2 border-0 cursor-pointer ${
              activeSubTab === "portfolio"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-950 bg-transparent"
            }`}
          >
            <FolderCheck className="h-4 w-4" /> My Active Portfolio Binder
          </button>
          <button
            onClick={() => setActiveSubTab("catalog")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold font-sans transition flex items-center justify-center gap-2 border-0 cursor-pointer ${
              activeSubTab === "catalog"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-950 bg-transparent"
            }`}
          >
            <BookOpen className="h-4 w-4" /> CDACC National Curriculum Catalog
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-450 font-mono font-semibold uppercase tracking-wider bg-slate-100/50 px-3 py-1.5 rounded-xl border border-slate-200/30">
          <Award className="h-3.5 w-3.5 text-emerald-600" />
          <span>Kenyan NVQF Level 6 Compliant</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === "portfolio" ? (
          /* PORTFOLIO BINDER VIEW */
          <motion.div
            key="portfolio-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans"
          >
            {/* LEFT COLUMN: UNITS LIST BINDER TABS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-1.5 font-display uppercase tracking-wider">
                <BookOpen className="h-4 w-4 text-emerald-600" /> Curriculum Units
              </h3>

              <div className="space-y-2.5">
                {data.units.map((unit) => {
                  const unitProgress = checklists[unit.id] || [false, false, false, false];
                  const itemsDone = unitProgress.filter(Boolean).length;
                  
                  return (
                    <button
                      key={unit.id}
                      onClick={() => setSelectedUnitId(unit.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        selectedUnitId === unit.id
                          ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                          : "bg-white border-slate-200/80 hover:border-slate-350 text-slate-700 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="space-y-1 truncate mr-2">
                        <div className={`text-[9px] font-mono font-bold tracking-widest uppercase ${selectedUnitId === unit.id ? "text-emerald-450" : "text-emerald-600"}`}>
                          {unit.code}
                        </div>
                        <div className="text-xs font-semibold truncate leading-snug">
                          {unit.name}
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 ml-1">
                        <span className={`text-[8.5px] px-2 py-0.5 rounded-full font-bold uppercase mb-1.5 leading-none ${
                          selectedUnitId === unit.id
                            ? "bg-emerald-500 text-white"
                            : unit.poeStatus === PoEStatus.CERTIFIED
                            ? "bg-emerald-100 text-emerald-800"
                            : unit.poeStatus === PoEStatus.READY_FOR_ASSESSMENT
                            ? "bg-indigo-100 text-indigo-800"
                            : unit.poeStatus === PoEStatus.IN_PROGRESS
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {unit.poeStatus}
                        </span>
                        <div className={`text-[9px] font-mono font-semibold ${selectedUnitId === unit.id ? "text-slate-300" : "text-slate-400"}`}>
                          {itemsDone}/4 Done
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: DETAILED CHECKLIST FOR SELECTED PORTFOLIO BINDER */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              {selectedUnit ? (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-5 gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded font-bold uppercase">
                        {selectedUnit.code}
                      </span>
                      <h3 className="text-base font-bold font-display text-slate-805 tracking-tight mt-1.5 leading-snug">
                        {selectedUnit.name}
                      </h3>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PoE Completion</div>
                      <div className="text-2xl font-black text-slate-800 font-mono tracking-tight mt-0.5">
                        {progressPct}%
                      </div>
                    </div>
                  </div>

                  {/* BINDER PROGRESS INDICATOR */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150/50 mb-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <FolderCheck className="h-8.5 w-8.5 text-emerald-600 bg-emerald-50 p-1.5 rounded-xl border border-emerald-200/40" />
                      <div>
                        <div className="text-xs font-bold text-slate-850">Competency Dossier Status</div>
                        <div className="text-[11px] text-slate-500">
                          Classed as <span className="font-bold text-emerald-600">{selectedUnit.poeStatus}</span> based on elements checked.
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectUnitForAI(selectedUnit.code)}
                      className="bg-slate-900 text-white hover:bg-slate-800 text-[10px] px-3 py-2 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer border-0 shrink-0"
                    >
                      Coach Audit <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  {/* CHECKLIST CHECKPOINTS */}
                  <div className="space-y-3.5">
                    {checklistDescriptions.map((item, idx) => {
                      const checked = selectedChecks[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleCheck(selectedUnit.id, idx)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                            checked
                              ? "bg-slate-50/40 border-slate-150"
                              : "bg-white border-slate-200/80 hover:border-slate-350 hover:bg-slate-50/20"
                          }`}
                        >
                          <div className="mt-0.5 text-emerald-600 shrink-0">
                            {checked ? (
                              <CheckSquare className="h-5.5 w-5.5 text-emerald-600 fill-emerald-50" />
                            ) : (
                              <Square className="h-5.5 w-5.5 text-slate-300" />
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className={`text-xs font-semibold ${checked ? "text-slate-450 line-through" : "text-slate-805"}`}>
                              {item.title}
                            </div>
                            <p className="text-slate-450 text-[10.5px] leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-12">
                  Select a Unit of Learning on the left to review its continuous assessments evidence portfolio.
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-450 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Internal Verification Signed
                </span>
                <span>Section F (Rules of Evidence) Fully Compliant</span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* CDACC NATIONAL CURRICULUM CATALOG COMPONENT */
          <motion.div
            key="catalog-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans"
          >
            {/* LEFT COLUMN: ACTIVE TRADE SELECTOR PILLS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 font-display uppercase tracking-wider">
                  <ClipboardList className="h-4 w-4 text-emerald-600" /> Select Trade Core
                </h3>
                <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">
                  Browse any official CDACC curriculum specifications registry below.
                </p>
              </div>

              <div className="space-y-2">
                {catalogCourses.map((crs) => {
                  const CourseIcon = crs.icon;
                  const isCurrentCatalog = selectedCatalogCourse === crs.key;
                  const isEnrolled = data.student.courseName === CDACC_CURRICULA_PRESETS[crs.key]?.student.courseName;

                  return (
                    <button
                      key={crs.key}
                      onClick={() => {
                        setSelectedCatalogCourse(crs.key);
                        setExpandedCatalogUnitId("");
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                        isCurrentCatalog
                          ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                          : "bg-white border-slate-200/80 hover:border-slate-350 text-slate-750 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${isCurrentCatalog ? "bg-slate-850 text-emerald-400" : crs.color}`}>
                        <CourseIcon className="h-4.5 w-4.5" />
                      </div>
                      <div className="truncate flex-1 space-y-0.5">
                        <div className="text-xs font-bold leading-tight truncate">
                          {crs.title}
                        </div>
                        <div className={`text-[8.5px] font-semibold font-mono tracking-wider ${isCurrentCatalog ? "text-slate-300" : "text-slate-450"}`}>
                          {crs.code}
                        </div>
                      </div>
                      {isEnrolled && (
                        <span className="shrink-0 bg-emerald-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase font-mono tracking-tight leading-none scale-90">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN DETAILS: MODULES & TOPICS DIRECTORY FOR CHOSEN CURRICULUM */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                {/* Catalog Syllabus Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 mb-5 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-300/40 px-2 py-0.5 rounded font-extrabold uppercase">
                        TVET CDACC Registered Code
                      </span>
                      {isEnrolledInCatalogSelection && (
                        <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 font-mono bg-emerald-50/50 px-1.5 py-0.5 rounded-full">
                          <UserCheck className="h-3 w-3" /> Enrolled Course Track
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black font-display text-slate-805 tracking-tight leading-tight">
                      {currentSelectionPreset.student.courseName}
                    </h3>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">
                      Registered NVQF Level 6 • {currentSelectionPreset.units.length} Modules of Learning
                    </p>
                  </div>

                  {/* Syllabus Enrollment Fast Switch button */}
                  {!isEnrolledInCatalogSelection && onLoadCurriculaPreset && (
                    <button
                      onClick={() => onLoadCurriculaPreset(selectedCatalogCourse)}
                      className="bg-emerald-600 text-white hover:bg-emerald-700 font-sans text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer border-0 shadow-sm leading-none shrink-0"
                    >
                      Switch Program Setup
                    </button>
                  )}
                </div>

                {/* Course units listing directory */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3 font-mono flex items-center gap-1">
                    <span>Syllabus Modules Directory ({currentSelectionPreset.units.length})</span>
                  </h4>

                  {currentSelectionPreset.units.map((unit) => {
                    const isExpanded = expandedCatalogUnitId === unit.id;
                    const details = SYLLABUS_DETAILS_MAP[unit.id] || {
                      topics: ["Core concepts review", "Practical tasks logs", "Syllabus standards verification"],
                      evidenceRequired: ["Practical logs folder", "Classroom continuous assessment templates"],
                      standards: "Kenyan NVQF Level 6 Criteria"
                    };

                    return (
                      <div
                        key={unit.id}
                        className={`border rounded-xl transition-all ${
                          isExpanded
                            ? "border-slate-350 bg-slate-50/20 shadow-xs"
                            : "border-slate-200/85 hover:border-slate-300 hover:bg-slate-50/20"
                        }`}
                      >
                        {/* Module header accordion trigger */}
                        <div
                          onClick={() => setExpandedCatalogUnitId(isExpanded ? "" : unit.id)}
                          className="p-4 flex items-center justify-between cursor-pointer select-none gap-3"
                        >
                          <div className="space-y-1 truncate">
                            <span className="text-[9.5px] font-mono text-slate-500 font-bold tracking-wider block uppercase">
                              {unit.code} • {unit.creditHours} Credits ({unit.hoursRequired} Hours Expected)
                            </span>
                            <span className="text-xs font-bold text-slate-800 leading-snug hover:text-emerald-750 transition block whitespace-normal">
                              {unit.name}
                            </span>
                          </div>

                          <button className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg cursor-pointer transition border-0 shrink-0">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-slate-700" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        {/* Expandable Module details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-slate-150"
                            >
                              <div className="p-4 space-y-4 text-xs bg-white rounded-b-xl border-t-0">
                                
                                {/* Topics component */}
                                <div className="space-y-1.5">
                                  <h5 className="font-extrabold text-slate-800 uppercase tracking-widest text-[9.5px] font-mono flex items-center gap-1 text-emerald-600">
                                    <BookOpen className="h-3.5 w-3.5" /> Core Curricula Topics / Topics Of Study:
                                  </h5>
                                  <ul className="list-disc pl-4 space-y-1.1 text-slate-650 text-[11px] leading-relaxed">
                                    {details.topics.map((tpc, tIdx) => (
                                      <li key={tIdx} className="pl-1">
                                        {tpc}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Evidence list component */}
                                <div className="space-y-1.5">
                                  <h5 className="font-extrabold text-slate-800 uppercase tracking-widest text-[9.5px] font-mono flex items-center gap-1 text-blue-600">
                                    <FolderCheck className="h-3.5 w-3.5" /> Required Portfolio Binder Evidence (PoE):
                                  </h5>
                                  <ul className="list-decimal pl-4 space-y-1.1 text-slate-650 text-[11px] leading-relaxed">
                                    {details.evidenceRequired.map((ev, evIdx) => (
                                      <li key={evIdx} className="pl-1">
                                        {ev}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Evaluation strategy */}
                                <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-200/50 flex flex-col sm:flex-row justify-between gap-2.5">
                                  <div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Continuous Assessments Strategy:</span>
                                    <div className="text-[10px] text-slate-600 font-bold mt-0.5">
                                      2 Continuous Assessment Tests (30%) + 1 End Semester Practical Assignment (40%)
                                    </div>
                                  </div>
                                  <div className="sm:text-right shrink-0">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Standards Mapping Code:</span>
                                    <div className="text-[10px] font-mono text-emerald-600 font-bold mt-0.5">
                                      {details.standards}
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grid footer standards message */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-450 font-medium">
                <span className="flex items-center gap-1">
                  <Info className="h-4 w-4 text-emerald-500" /> Syllabus Specifications Registered
                </span>
                <span>Audit aligned on TVET CDACC curriculum framework Kenya 2026/2027</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
