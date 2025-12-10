import { User } from "@/store/authStore";

export interface DocumentItem {
  id: string;
  name: string;
  url: string;
  uploadedBy: User;
  createdAt: string;
}
