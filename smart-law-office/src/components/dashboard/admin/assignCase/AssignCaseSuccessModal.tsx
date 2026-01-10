"use client";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { AssignedCase } from "@/store/assignCaseStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AssignCaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignedCase: AssignedCase | null;
}

export function AssignCaseSuccessModal({
  isOpen,
  onClose,
  assignedCase
}: AssignCaseSuccessModalProps) {
  if (!assignedCase) return null;

  // Assuming you can get the lawyer's image or just use a placeholder
  const counselAvatar = assignedCase.counselName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[400px] p-8 bg-white rounded-xl shadow-2xl space-y-4">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Icon/Image Placeholder */}
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <Briefcase className="h-10 w-10 text-purple-600" />
          </div>

          <h3 className="text-xl font-bold text-gray-900">Case Assigned</h3>
          <p className="text-sm text-gray-500">
            You have successfully assigned a new case to a counsel in your team.
          </p>

          {/* Assigned Lawyer Details Card */}
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mt-4 w-full">
            <div className="flex items-center justify-center gap-3">
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignedCase.counselName}`}
                />
                <AvatarFallback>{counselAvatar}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {assignedCase.counselName}
                </p>
                <p className="text-xs text-gray-500">
                  {assignedCase.counselSpecialty}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-purple-200">
              <p className="text-sm font-semibold text-gray-700">
                {assignedCase.caseId}
              </p>
              <p className="text-xs text-gray-500">Pending Lawyer agreement</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 w-full">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="button"
              className="flex-1 bg-[#7C5CFC] hover:bg-[#6B46C1]"
              onClick={() => {
                // Add navigation logic to view the case here
                console.log("Viewing case:", assignedCase.caseId);
                onClose();
              }}
            >
              View
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
