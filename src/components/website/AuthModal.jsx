import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import useAuthModalStore from '../../store/authModalStore';

export default function AuthModal() {
  const isOpen = useAuthModalStore((state) => state.isOpen);
  const closeAuth = useAuthModalStore((state) => state.closeAuth);
  const [employeeId, setEmployeeId] = useState('STAFF-OPERATOR');
  const [pin, setPin] = useState('123456');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    closeAuth();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded border border-slate-300 shadow-xl max-w-md w-full p-6 relative">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-base">Authentication Required</h3>
          </div>
          <button
            onClick={closeAuth}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold px-2 py-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-4">
          Accessing the Owner Operations Workspace.
          Please enter your employee PIN or store staff key.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Employee ID / User Key
            </label>
            <input
              type="text"
              placeholder="e.g. EMP-104"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Passcode / Security PIN
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-500">
            Data metrics, financial registers, and customer lists are rendered after session authorization.
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={closeAuth}
              className="px-4 py-2 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold"
            >
              Authenticate Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}