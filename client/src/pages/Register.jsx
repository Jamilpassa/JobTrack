import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      return setError('Password must be at least 8 characters');
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <div className="card" style={{ marginTop: '4rem' }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Create your account</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" type="text" value={form.name}
              onChange={handleChange} required autoComplete="name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" value={form.email}
              onChange={handleChange} required autoComplete="email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password <span style={{color:'#94a3b8'}}>(min. 8 characters)</span></label>
            <input id="password" name="password" type="password" value={form.password}
              onChange={handleChange} required autoComplete="new-password" />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.65rem' }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#3b82f6' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
