import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #c8e6c8 0%, #e8f5e8 60%, #fff9f0 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px', padding: '44px 40px',
        width: '100%', maxWidth: '420px',
        border: '2px solid #d4ead4',
        boxShadow: '0 8px 32px rgba(58,125,68,0.10)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '38px', marginBottom: '8px' }}>🌿</div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#2d5a2d', margin: 0 }}>Welcome back</h1>
          <p style={{ color: '#7aaa7a', marginTop: '8px', fontSize: '14px', fontStyle: 'italic' }}>Sign in to Bloom Tasks</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#3a7d44', marginBottom: '7px' }}>Email address</label>
            <input
              type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '2px solid #d4ead4', fontSize: '14px', outline: 'none',
                color: '#2d5a2d', background: '#f8fdf8', fontFamily: 'Georgia, serif'
              }}
              onFocus={e => e.target.style.borderColor = '#3a7d44'}
              onBlur={e => e.target.style.borderColor = '#d4ead4'}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#3a7d44', marginBottom: '7px' }}>Password</label>
            <input
              type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '2px solid #d4ead4', fontSize: '14px', outline: 'none',
                color: '#2d5a2d', background: '#f8fdf8', fontFamily: 'Georgia, serif'
              }}
              onFocus={e => e.target.style.borderColor = '#3a7d44'}
              onBlur={e => e.target.style.borderColor = '#d4ead4'}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: '#3a7d44', color: '#fff',
            border: 'none', borderRadius: '12px',
            fontSize: '15px', fontWeight: '700', cursor: 'pointer',
            fontFamily: 'Georgia, serif', letterSpacing: '0.3px',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#5a8a5a' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#3a7d44', fontWeight: '700', textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}