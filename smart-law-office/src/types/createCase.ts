import { User } from "@/store/authStore";
import { Note } from "./notes";
import { DocumentItem } from "./document";

export interface caseItem {
  id: string;
  title?: string;
  clientId: string;
  clientName: string;
  type: string;
  name: string;
  status: string;
  court: string;
  notes: Note[];
  documents: DocumentItem[];
  createdAt: string;
  nextAction: string;
  nextActionDate: string;
  lastAdjournedAt?: string;
  nextAdjournedAt?: string;
  assignedTo?: User | null;
  filingDate: string;
  caseId?: string;
  createdBy: User;
}
