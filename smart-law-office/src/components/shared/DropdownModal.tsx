"use client";

import React from "react";
import { MoreHorizontal, Eye, Download, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { deleteDocuemntApi } from "@/app/api/document.api";

interface DropdownModalProps {
  // The item data (document, user)
  item: any;
  // function for see More
  onView?: (item: any) => void;
  // function for download
  onDownload?: (item: any) => void;
  // function for delete
  onDelete?: (item: any) => Promise<void>;
}

export function DropdownModal({
  item,
  onView,
  onDownload,
  onDelete
}: DropdownModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await deleteDocuemntApi(item.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none hover:bg-slate-100 rounded-md transition-colors">
        <MoreHorizontal className="w-4 h-4 text-slate-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {onView && (
          <DropdownMenuItem
            onClick={() => onView(item)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4 text-slate-500" /> See more
          </DropdownMenuItem>
        )}

        {onDownload && (
          <DropdownMenuItem
            onClick={() => onDownload(item)}
            className="cursor-pointer"
          >
            <Download className="mr-2 w-4 h-4 text-slate-500" /> Download
          </DropdownMenuItem>
        )}

        {onDelete && (
          <DropdownMenuItem
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            {isDeleting ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 w-4 h-4 text-slate-500" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
