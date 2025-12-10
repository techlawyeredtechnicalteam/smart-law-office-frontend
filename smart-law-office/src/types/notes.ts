import { User } from "@/store/authStore";

export interface Note {
  id: string;
  message: string;
  createdBy: User;
  createdAt: string;
}
