import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.user, data.token);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full name', key: 'name', type: 'text', placeholder: 'Your full name' },
    { label: 'Email address', key: 'email', type: 'email', placeholder: 'you@example.com' },
    { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
  ];

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
          <div style={{ fontSize: '38px', marginBottom: '8px' }}>🌸</div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#2d5a2d', margin: 0 }}>Create account</h1>
          <p style={{ color: '#7aaa7a', marginTop: '8px', fontSize: '14px', fontStyle: 'italic' }}>Join Bloom Tasks today</p>
        </div>

        <form onSubmit={handleSubmit}>
          {fields.map(({ label, key, type, placeholder }) => (
            <div key={key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#3a7d44', marginBottom: '7px' }}>{label}</label>
              <input
                type={type} placeholder={placeholder}
                value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px',
                  border: '2px solid #d4ead4', fontSize: '14px', outline: 'none',
                  color: '#2d5a2d', background: '#f8fdf8', fontFamily: 'Georgia, serif'
                }}
                onFocus={e => e.target.style.borderColor = '#3a7d44'}
                onBlur={e => e.target.style.borderColor = '#d4ead4'}
              />
            </div>
          ))}

          <div style={{ marginTop: '8px' }}>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: '#3a7d44', color: '#fff',
              border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              fontFamily: 'Georgia, serif', opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#5a8a5a' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3a7d44', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}