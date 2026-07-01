import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_URL || '';
const STATUSES = [
  'Applied', 'Interview Scheduled', 'Interview Completed',
  'Offer Received', 'Rejected', 'Withdrawn'
];

const EMPTY_FORM = {
  company: '', role: '', status: 'Applied',
  date_applied: '', salary_range: '', application_url: '', notes: ''
};

export default function Applications() {
  const [apps, setApps]         = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null); // null = creating new
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy]     = useState('');
  const [error, setError]       = useState('');

  // Fetch applications (re-runs when filter/sort change)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filterStatus) params.set('status', filterStatus);
    if (sortBy) params.set('sort', sortBy);
    fetch(`${API}/api/applications?${params}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setApps(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load applications'));
  }, [filterStatus, sortBy]);

  function openNew() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError('');
  }

  function openEdit(app) {
    setForm({
      company: app.company, role: app.role, status: app.status,
      date_applied: app.date_applied ? app.date_applied.slice(0, 10) : '',
      salary_range: app.salary_range || '', application_url: app.application_url || '',
      notes: app.notes || ''
    });
    setEditingId(app.id);
    setShowForm(true);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const method = editingId ? 'PUT' : 'POST';
    const url    = editingId ? `${API}/api/applications/${editingId}` : '/api/applications';
    try {
      const res  = await fetch(url, {
        method, credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Update local state without a full refetch
      if (editingId) {
        setApps(prev => prev.map(a => a.id === editingId ? data : a));
      } else {
        setApps(prev => [data, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this application?')) return;
    try {
      await fetch(`${API}/api/applications/${id}`, { method: 'DELETE', credentials: 'include' });
      setApps(prev => prev.filter(a => a.id !== id));
    } catch {
      setError('Could not delete application');
    }
  }

  const statusClass = s => 'status-badge status-' + s.replace(/\s+/g, '-');

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1>Applications <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '1rem' }}>({apps.length})</span></h1>
        <button className="btn-primary" onClick={openNew}>+ Add application</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto' }}>
          <option value="">Sort: newest first</option>
          <option value="date_desc">Date applied (newest)</option>
          <option value="date_asc">Date applied (oldest)</option>
          <option value="company">Company (A–Z)</option>
        </select>
      </div>

      {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}

      {/* Add / Edit form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1rem' }}>
            {editingId ? 'Edit application' : 'New application'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div className="form-group">
                <label htmlFor="company">Company *</label>
                <input id="company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role / Job title *</label>
                <input id="role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date_applied">Date applied</label>
                <input id="date_applied" type="date" value={form.date_applied} onChange={e => setForm(f => ({ ...f, date_applied: e.target.value }))} />
              </div>
              <div className="form-group">
                <label htmlFor="salary_range">Salary range</label>
                <input id="salary_range" placeholder="e.g. £30,000–£35,000" value={form.salary_range} onChange={e => setForm(f => ({ ...f, salary_range: e.target.value }))} />
              </div>
              <div className="form-group">
                <label htmlFor="application_url">Application URL</label>
                <input id="application_url" type="url" placeholder="https://..." value={form.application_url} onChange={e => setForm(f => ({ ...f, application_url: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea id="notes" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            {error && <p className="error-msg">{error}</p>}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn-primary">{editingId ? 'Save changes' : 'Add application'}</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Application list */}
      {apps.length === 0 && !showForm && (
        <div className="card" style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
          No applications yet. Click <strong>+ Add application</strong> to get started.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {apps.map(app => (
          <div key={app.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{app.company}</div>
              <div style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '0.4rem' }}>{app.role}</div>
              <span className={statusClass(app.status)}>{app.status}</span>
              {app.date_applied && (
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.75rem' }}>
                  Applied {new Date(app.date_applied).toLocaleDateString('en-GB')}
                </span>
              )}
              {app.salary_range && (
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.75rem' }}>{app.salary_range}</span>
              )}
              {app.notes && (
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>{app.notes}</p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
              <button className="btn-secondary" style={{ padding: '0.3rem 0.6rem' }} onClick={() => openEdit(app)}>Edit</button>
              <button className="btn-danger"    style={{ padding: '0.3rem 0.6rem' }} onClick={() => handleDelete(app.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
