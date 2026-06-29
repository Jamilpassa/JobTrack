import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]   = useState(null);
  const [error, setError]   = useState('');

  useEffect(() => {
    fetch('/api/applications/stats', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => setError('Could not load stats'));
  }, []);

  const statCards = stats ? [
    { label: 'Total applied',  value: stats.total,      color: '#3b82f6' },
    { label: 'Interviews',     value: stats.interviews,  color: '#f59e0b' },
    { label: 'Offers',         value: stats.offers,      color: '#22c55e' },
    { label: 'Rejected',       value: stats.rejected,    color: '#ef4444' },
  ] : [];

  const responseRate = stats && stats.total > 0
    ? Math.round((stats.interviews / stats.total) * 100)
    : 0;

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.25rem' }}>Hello, {user?.name} 👋</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Here's your job search at a glance.</p>

      {error && <p className="error-msg">{error}</p>}

      {stats && (
        <>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {statCards.map(s => (
              <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Response rate */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.75rem' }}>Interview response rate</h2>
            <div style={{ background: '#f1f5f9', borderRadius: 20, height: 12, overflow: 'hidden' }}>
              <div style={{ background: '#3b82f6', width: `${responseRate}%`, height: '100%', borderRadius: 20, transition: 'width 0.4s' }} />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem' }}>
              {responseRate}% of applications led to an interview
            </p>
          </div>
        </>
      )}

      <Link to="/applications">
        <button className="btn-primary">View all applications →</button>
      </Link>
    </div>
  );
}
