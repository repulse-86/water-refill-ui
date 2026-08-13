import ConfirmDialog from '../../../components/ui/ConfirmDialog';

export default function MeterDeleteDialog({ reading, isLoading, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      isOpen={Boolean(reading)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Meter Reading"
      message={
        reading
          ? `Are you sure you want to delete the reading for ${new Date(reading.reading_date).toLocaleDateString()}? This action cannot be undone.`
          : ''
      }
      isLoading={isLoading}
    />
  );
}
