import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav style={{
      background: '#1e293b', color: '#f1f5f9',
      padding: '0.75rem 1.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
        JobTrack
      </Link>
      {user && (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Dashboard</Link>
          <Link to="/applications" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Applications</Link>
          <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{user.name}</span>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.3rem 0.75rem' }}>
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}
