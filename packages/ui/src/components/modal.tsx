'use client';

import { HTMLAttributes, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@sociolume/utils';

export interface ModalProps extends HTMLAttributes<HTMLDialogElement> {
  open?: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
}

export const Modal = ({
  className,
  open,
  onClose,
  closeOnOverlayClick = true,
  children,
  ...props
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = (e: Event) => {
      e.preventDefault();
      onClose?.();
    };

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (closeOnOverlayClick && e.target === dialogRef.current) {
      onClose?.();
    }
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className={cn('modal', className)}
      onClick={handleOverlayClick}
      {...props}
    >
      <div className="modal-box">{children}</div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>,
    document.body
  );
};

Modal.displayName = 'Modal';
