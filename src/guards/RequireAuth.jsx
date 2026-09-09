import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function RequireAuth({ children }) {
  const sessionStatus = useAuthStore((state) => state.sessionStatus);

  if (sessionStatus === 'checking') return null;
  if (sessionStatus === 'guest') return <Navigate to="/" replace />;
  return children;
}
