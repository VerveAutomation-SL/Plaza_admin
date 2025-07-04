"use client";

import React from "react";
import { Dialog } from "@headlessui/react";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const GenericModal: React.FC<GenericModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "max-w-xl",
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className={`w-full rounded-xl bg-white dark:bg-gray-900 p-6 shadow-xl ${className}`}
        >
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default GenericModal;
