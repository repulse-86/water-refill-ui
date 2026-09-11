import { FileText } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import { formatDate } from '../../../utils/date';

export default function MeterNotesModal({ isOpen, onClose, reading }) {
  if (!isOpen || !reading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Meter Reading Notes" icon={FileText}>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-slate-500">Date</p>
          <p className="text-sm font-medium text-slate-700">{formatDate(reading.reading_date)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Meter Value</p>
          <p className="text-sm font-medium text-slate-700">
            {reading.meter_value != null ? `${Number(reading.meter_value).toFixed(2)} gal` : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Notes</p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 whitespace-pre-wrap min-h-[60px]">
            {reading.notes || <span className="text-slate-400 italic">No notes</span>}
          </div>
        </div>
      </div>
    </Modal>
  );
}
