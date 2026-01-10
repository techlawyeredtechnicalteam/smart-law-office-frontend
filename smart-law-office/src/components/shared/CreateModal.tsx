import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReusableModalProps {
  /** The text shown on the trigger button */
  triggerText: string;
  /** The title displayed in the modal header */
  modalTitle: string;
  /** The content/form to display inside the modal */
  children: React.ReactNode;
  /** External control of modal open state (optional) */
  isOpen?: boolean;
  /** Function to control modal open state externally (optional) */
  onOpenChange?: (open: boolean) => void;
  /** Custom trigger button (optional) - if provided, triggerText is ignored */
  customTrigger?: React.ReactNode;
  /** Additional classes for the trigger button */
  triggerClassName?: string;
  /** Variant for the trigger button */
  triggerVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  /** Size for the trigger button */
  triggerSize?: "default" | "sm" | "lg" | "icon";
}

export function CreateModal({
  triggerText,
  modalTitle,
  children,
  isOpen,
  onOpenChange,
  customTrigger,
  triggerClassName,
  triggerVariant = "default",
  triggerSize = "default"
}: ReusableModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Use external state if provided, otherwise use internal state
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {customTrigger || (
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={triggerClassName}
          >
            {triggerText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
