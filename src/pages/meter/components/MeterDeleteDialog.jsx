import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { formatDate } from '../../../utils/date';

export default function MeterDeleteDialog({ reading, isLoading, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      isOpen={Boolean(reading)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Archive Meter Reading"
      message={reading ? `Archive the reading for ${formatDate(reading.reading_date)}? It will move to Archived and can be restored later.` : ''}
      confirmLabel="Archive"
      isLoading={isLoading}
    />
  );
}
