import {
  Briefcase,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  Lock,
  MessageSquare,
  PlusCircle,
  UserPlus,
  Users
} from "lucide-react";

export type NavItems = {
  name: string;
  icon: any;
  route: string;
  roles: Array<"ADMIN" | "COUNSEL" | "CLIENT" | "">;
  subItems?: NavItems[];
};

export const ALL_LINKS: Record<string, NavItems> = {
  // shared links
  overview: {
    name: "Overview",
    icon: Home,
    route: "/admin/overview",
    roles: ["ADMIN", "COUNSEL", "CLIENT"]
  },

  // Admin/Counsel links
  caseManagement: {
    name: "Case Management",
    icon: Briefcase,
    route: "/admin/case-mgmt",
    roles: ["ADMIN", "COUNSEL"],
    subItems: [
      {
        name: "Create Case",
        icon: PlusCircle,
        route: "/admin/cases",
        roles: ["ADMIN", "COUNSEL"]
      },
      {
        name: "Assign Cases",
        icon: UserPlus,
        route: "/admin/assign-case",
        roles: ["ADMIN", "COUNSEL"]
      }
    ]
  },
  manageCounsel: {
    name: "Manage Counsel",
    icon: Users,
    route: "/admin/counsel",
    roles: ["ADMIN", "COUNSEL"]
  },

  //clients links
  myCases: {
    icon: FileText,
    name: "My Cases",
    route: "/clients/my-cases",
    roles: ["CLIENT"]
  },
  consultations: {
    icon: FileText,
    name: "Consultations",
    route: "/clients/consultations",
    roles: ["CLIENT"]
  },
  invoice: {
    icon: FileText,
    name: "My Cases",
    route: "/clients/invoice",
    roles: ["CLIENT"]
  },

  // Finiancial Links
  billings: {
    name: "Billings & Payment",
    icon: CreditCard,
    route: "/admin/billings",
    roles: ["ADMIN", "COUNSEL"]
  },

  // shared links
  comminications: {
    name: "Communications",
    icon: MessageSquare,
    route: "/admin/comms",
    roles: ["ADMIN", "COUNSEL", "CLIENT"]
  },
  support: {
    name: "Support",
    icon: HelpCircle,
    route: "/admin/support",
    roles: ["ADMIN", "COUNSEL", "CLIENT"]
  }
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
