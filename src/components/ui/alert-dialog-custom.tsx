import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AlertDialogProps {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isOpen: boolean;
  onClose: () => void; // Hàm để đóng dialog
}

const CustomAlertDialog: React.FC<AlertDialogProps> = ({
  title,
  description,
  onConfirm,
  onCancel,
  isOpen,
  onClose,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel || onClose}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500">
            Tiếp tục
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
