import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = true,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel} widthClassName="max-w-sm">
      <div className="flex items-start gap-3 mb-6">
        <span className="w-9 h-9 rounded-full bg-danger-light text-danger flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </span>
        <p className="text-sm text-muted">{description}</p>
      </div>
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-sm font-medium text-muted hover:bg-surface-card dark:hover:bg-white/5"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`px-4 py-2 rounded-xl text-sm font-semibold text-white ${
            destructive ? 'bg-danger hover:bg-danger/90' : 'bg-primary hover:bg-primary-600'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
