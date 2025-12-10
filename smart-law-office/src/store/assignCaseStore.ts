import { create } from "zustand";

export interface UnassignedCase {
  id: string;
  clientName: string;
  caseType: string;
  date: string;
  time: string;
  status: string;
  contractDoc?: { name: string; size: string };
}

export interface Counsel {
  id: string;
  name: string;
  specialty: string;
  casesCount: number;
  status: "Active" | "Inactive";
  email: string;
  avatar: string;
}

export interface AssignedCase {
  id: string;
  caseId: string;
  clientName: string;
  caseType: string;
  dateTime: string;
  counselName: string;
  counselSpecialty: string;
  assignedAt: string;
}

interface AssignState {
  unassignedCases: UnassignedCase[];
  counsels: Counsel[];
  assignedCases: AssignedCase[];

  // actions
  assignCase: (caseId: string, counselId: string) => void;
}

export const useAssignStore = create<AssignState>((set, get) => ({
  // Mock Data mimicking 'assigndas.png' left panel
  unassignedCases: [
    {
      id: "2025-0012",
      clientName: "Innovate Plc",
      caseType: "Intellectual property",
      date: "2025-11-09",
      time: "10:00 AM",
      status: "Pending Lawyer agreement",
      contractDoc: { name: "Contract_document.pdf", size: "2.4 MB" }
    },
    {
      id: "2025-0023",
      clientName: "John Smith",
      caseType: "Real Estate",
      date: "2025-11-06",
      time: "06:32 AM",
      status: "New"
    },
    {
      id: "2025-0015",
      clientName: "Tech Corp",
      caseType: "Corporate Litigation",
      date: "2025-11-12",
      time: "02:15 PM",
      status: "Urgent"
    }
  ],

  // Mock Data mimicking 'assigndas.png' right panel
  counsels: [
    {
      id: "L1",
      name: "Jane Francis",
      specialty: "Real Estate",
      casesCount: 5,
      status: "Active",
      email: "jane.francis@law.com",
      avatar: "JF"
    },
    {
      id: "L2",
      name: "Lydia Hart",
      specialty: "Family Law",
      casesCount: 4,
      status: "Active",
      email: "lydia.hart@law.com",
      avatar: "LH"
    },
    {
      id: "L3",
      name: "Tari Lawson",
      specialty: "Finance Law",
      casesCount: 11,
      status: "Active",
      email: "tari.lawson@law.com",
      avatar: "TL"
    },
    {
      id: "L4",
      name: "Derek Derrick",
      specialty: "Corporate Litigation",
      casesCount: 3,
      status: "Active",
      email: "derek.d@law.com",
      avatar: "DD"
    }
  ],

  // Initially empty
  assignedCases: [],

  assignCase: (caseId, counselId) => {
    const { unassignedCases, counsels, assignedCases } = get();

    const caseToAssign = unassignedCases.find((c) => c.id === caseId);
    const counsel = counsels.find((l) => l.id === counselId);

    if (caseToAssign && counsel) {
      const newAssignment: AssignedCase = {
        id: Math.random().toString(36).substring(2, 9),
        caseId: caseToAssign.id,
        clientName: caseToAssign.clientName,
        caseType: caseToAssign.caseType,
        dateTime: `${caseToAssign.date} - ${caseToAssign.time}`,
        counselName: counsel.name,
        counselSpecialty: counsel.specialty,
        assignedAt: new Date().toISOString()
      };

      set({
        assignedCases: [newAssignment, ...assignedCases],
        // remve from unassigned list
        unassignedCases: unassignedCases.filter((c) => c.id !== caseId)
      });
    }
  }
}));
