import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { formatDate } from '../../../utils/date';

export default function MeterDeleteDialog({ reading, isLoading, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      isOpen={Boolean(reading)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Meter Reading"
      message={
        reading
          ? `Are you sure you want to delete the reading for ${formatDate(reading.reading_date)}? This action cannot be undone.`
          : ''
      }
      isLoading={isLoading}
    />
  );
}
