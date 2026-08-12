import { TriangleAlert } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', cancelLabel = 'Cancel', isLoading = false, icon: Icon = TriangleAlert }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} icon={Icon} hideClose>
      <p className="text-sm text-slate-600 mb-6">{message}</p>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button type="button" onClick={onConfirm} isLoading={isLoading} className="bg-red-600 hover:bg-red-700">
          {isLoading ? 'Deleting…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}