import {
  Briefcase,
  CreditCard,
  DownloadCloud,
  FileText,
  HelpCircle,
  Home,
  MessageSquare,
  UserPlus,
  Users
} from "lucide-react";
import { TbCalendarEvent, TbDashboard, TbInvoice } from "react-icons/tb";

export type NavItems = {
  name: string;
  icon: any;
  route: string;
  roles: Array<"ADMIN" | "STAFF" | "CLIENT" | "">;
  subItems?: NavItems[];
};

export const ALL_LINKS: Record<string, NavItems> = {
  // Admin Dashboard
  dashboard: {
    name: "Dashboard",
    icon: TbDashboard,
    route: "/admin/dashboard",
    roles: ["ADMIN", "STAFF"]
  },
  // Admin/Counsel links
  caseManagement: {
    name: "Case Management",
    icon: Briefcase,
    route: "/admin/case-mgmt",
    roles: ["ADMIN"],
    subItems: [
      {
        icon: Briefcase,
        name: "Create New Case",
        route: "/admin/create-case",
        roles: ["ADMIN", "STAFF"]
      },
      {
        name: "Assign Cases",
        icon: UserPlus,
        route: "/admin/assign-case",
        roles: ["ADMIN"]
      }
    ]
  },
  billings: {
    name: "Billings & Payment",
    icon: CreditCard,
    route: "/admin/billing",
    roles: ["ADMIN"]
  },
  subscribe: {
    icon: FileText,
    name: "Subscriptions",
    route: "/subscribe",
    roles: ["ADMIN", "STAFF"]
  },
  manageCounsel: {
    name: "Manage Counsel",
    icon: Users,
    route: "/admin/counsel",
    roles: ["ADMIN"]
  },

  // Staff Links
  // dashboard: {
  //   icon: TbDashboard,
  //   name: "Dashboard",
  //   route: "/staff/dashboard",
  //   roles: ["STAFF"]
  // },
  cases: {
    icon: Briefcase,
    name: "My Cases",
    route: "/staff/my-cases",
    roles: ["STAFF"]
  },
  // billingTrack: {
  //   icon: TbInvoice,
  //   name: "TrackBilling",
  //   route: "/staff/track-billing",
  //   roles: ["STAFF"]
  // },
  documents: {
    icon: DownloadCloud,
    name: "Document",
    route: "/staff/document",
    roles: ["STAFF"]
  },

  //clients links
  myCases: {
    icon: FileText,
    name: "Manage cases",
    route: "/client/manage-case",
    roles: ["CLIENT"]
  },
  // createCase: {
  //   icon: Briefcase,
  //   name: "Create New Case",
  //   route: "/create-case",
  //   roles: ["CLIENT", "STAFF"]
  // },
  consultations: {
    icon: FileText,
    name: "Consultations",
    route: "/client/consultations",
    roles: ["CLIENT"]
  },
  invoice: {
    icon: FileText,
    name: "Billings & Payment",
    route: "/client/billings",
    roles: ["CLIENT"]
  },
  // commsClient: {
  //   name: "Communications",
  //   icon: MessageSquare,
  //   route: "/client/comms",
  //   roles: ["CLIENT"]
  // }

  // shared links (moved to the bottom before commented out section)
  commsAdmin: {
    name: "Communications",
    icon: MessageSquare,
    route: "/comms",
    roles: ["ADMIN", "STAFF", "CLIENT"]
  },
  calendar: {
    name: "Calendar & Scheduling",
    icon: TbCalendarEvent,
    route: "/calendar-&-scheduling",
    roles: ["ADMIN", "STAFF", "CLIENT"]
  },
  support: {
    name: "Support",
    icon: HelpCircle,
    route: "/support",
    roles: ["ADMIN", "STAFF", "CLIENT"]
  }

  // Finiancial Links

  // privacy: {
  //   name: "Privacy Policy",
  //   icon: Lock,
  //   route: "privacy",
  //   roles: ["ADMIN", "COUNSEL", "CLIENT"]
  // },
  // terms: {
  //   name: "Terms and Conditions",
  //   icon: FileText,
  //   route: "terms",
  //   roles: ["ADMIN", "COUNSEL", "CLIENT"]
  // }
};
