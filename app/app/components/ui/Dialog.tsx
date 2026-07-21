
"use client";

import { useState, type ReactNode } from "react";
import Button, { type ButtonVariant } from "./Button";
import Modal, { type ModalSize } from "./Modal";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  confirmVariant?: ButtonVariant;
  closeAfterConfirm?: boolean;
  size?: ModalSize;
  footer?: ReactNode;
};

export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  icon,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  confirmVariant = "primary",
  closeAfterConfirm = true,
  size = "sm",
  footer,
}: DialogProps) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm || confirming) return;

    setConfirming(true);
    try {
      await onConfirm();
      if (closeAfterConfirm) onClose();
    } catch (error) {
      console.error("Dialog confirmation failed:", error);
    } finally {
      setConfirming(false);
    }
  };

  const defaultFooter = (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <Button variant="ghost" onClick={onClose} disabled={confirming}>
        {cancelLabel}
      </Button>
      {onConfirm && (
        <Button
  variant={confirmVariant}
  onClick={handleConfirm}
  loading={confirming}
>
  {confirming ? "Working..." : confirmLabel}
</Button>
      )}
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
      footer={footer ?? defaultFooter}
      closeOnOverlay={!confirming}
      closeOnEscape={!confirming}
    >
      <div className="flex gap-4">
        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent-ring)] bg-[var(--accent-soft)] text-[var(--accent)]">
            {icon}
          </div>
        )}
        {children && (
          <div className="min-w-0 flex-1 text-sm leading-7 text-[var(--text-muted)]">
            {children}
          </div>
        )}
      </div>
    </Modal>
  );
}

export type { DialogProps };