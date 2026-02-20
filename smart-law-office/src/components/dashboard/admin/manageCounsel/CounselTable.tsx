"use client";

import { useCounselStore } from "@/store/manageCounsel";
import { Edit, Trash2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { Lawyer } from "@/types/user";
import { TableModal, TableColumn } from "@/components/shared/TableModal";

const STATUS_STYLES: Record<Lawyer["status"], string> = {
  Active: "bg-green-100 text-green-700",
  Busy: "bg-yellow-100 text-yellow-700",
  Inactive: "bg-red-100 text-red-700"
};

const CounselTable = () => {
  const {
    counsel,
    isLoading,
    isFetching,
    fetchCounsels,
    openEditModal,
    openDeleteModal
  } = useCounselStore();

  useEffect(() => {
    fetchCounsels();
  }, [fetchCounsels]);

  const columns: TableColumn<Lawyer>[] = [
    {
      key: "name",
      header: "Counsel Name",
      render: (person) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
            {person.firstName[0]}
            {person.lastName[0]}
          </div>
          <span className="font-medium text-gray-900">{person.name}</span>
        </div>
      )
    },
    {
      key: "scn",
      header: "SCN Number",
      cellClassName: "text-sm text-gray-600",
      render: (person) => person.scn
    },
    {
      key: "email",
      header: "Email Address",
      cellClassName: "text-sm text-gray-600",
      render: (person) => person.email
    },
    {
      key: "casesCount",
      header: "Assigned Cases",
      cellClassName: "text-sm text-gray-600",
      render: (person) => (
        <span className="bg-gray-100 px-2.5 py-0.5 rounded-full">
          {person.casesCount}
        </span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (person) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            STATUS_STYLES[person.status] ?? STATUS_STYLES.Inactive
          }`}
        >
          {person.status}
        </span>
      )
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (person) => (
        <div className="flex justify-end gap-2">
          <ActionButton
            aria-label="Edit Counsel"
            onClick={() => openEditModal(person)}
            hoverClass="hover:text-blue-600 hover:bg-blue-50"
          >
            <Edit size={18} />
          </ActionButton>
          <ActionButton
            aria-label="Delete Counsel"
            onClick={() => openDeleteModal(person)}
            hoverClass="hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </ActionButton>
        </div>
      )
    }
  ];

  if (isFetching && counsel.length === 0) return <TableSkeleton />;

  return (
    <TableModal<Lawyer>
      data={counsel}
      columns={columns}
      getRowKey={(person) => person.id}
      emptyMessage="No counsel members found."
      containerClassName="w-full bg-white rounded-xl border border-gray-200 overflow-hidden"
    />
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hoverClass: string;
}

const ActionButton = ({
  hoverClass,
  children,
  ...props
}: ActionButtonProps) => (
  <button
    {...props}
    className={`p-1.5 text-gray-400 rounded-md transition-colors ${hoverClass}`}
  >
    {children}
  </button>
);

const TableSkeleton = () => (
  <div className="space-y-4 w-full">
    <div className="h-10 w-full bg-gray-100 animate-pulse rounded-t-xl" />
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="flex gap-4 px-6">
        <Skeleton className="h-12 w-full" />
      </div>
    ))}
  </div>
);

export default CounselTable;
