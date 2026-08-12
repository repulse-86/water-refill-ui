import { useNavigate } from 'react-router-dom';
import { Droplet, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function Placeholder() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded border border-slate-200 shadow-sm max-w-md w-full p-8 text-center">
        <div className="w-12 h-12 bg-sky-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
          <Droplet className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-bold text-slate-900 mb-1">Signed in</h1>
        <p className="text-sm text-slate-500 mb-6">
          Welcome, {user?.name ?? 'Owner'}. This workspace is under construction.
        </p>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </button>
      </div>
    </div>
  );
}