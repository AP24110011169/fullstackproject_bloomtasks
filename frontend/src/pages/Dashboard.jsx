import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PRIORITY = {
  high:   { bg: '#fde8e8', color: '#b03030', label: 'High' },
  medium: { bg: '#fef3e2', color: '#8a5e10', label: 'Medium' },
  low:    { bg: '#e8f5e8', color: '#2d6a35', label: 'Low' },
};

const Badge = ({ bg, color, text }) => (
  <span style={{
    background: bg, color, fontSize: '11px', fontWeight: '700',
    padding: '3px 11px', borderRadius: '20px', fontFamily: 'Georgia, serif'
  }}>{text}</span>
);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch { toast.error('Failed to load tasks'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const { data } = await API.put(`/tasks/${editId}`, form);
        setTasks(tasks.map(t => t._id === editId ? data : t));
        toast.success('Task updated!');
      } else {
        const { data } = await API.post('/tasks', form);
        setTasks([data, ...tasks]);
        toast.success('Task created!');
      }
      setForm({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowForm(false);
      setEditId(null);
    } catch { toast.error('Failed to save task'); }
  };

  const toggleComplete = async (task) => {
    try {
      const { data } = await API.put(`/tasks/${task._id}`, {
        status: task.status === 'completed' ? 'pending' : 'completed'
      });
      setTasks(tasks.map(t => t._id === task._id ? data : t));
    } catch { toast.error('Update failed'); }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted!');
    } catch { toast.error('Delete failed'); }
  };

  const startEdit = (task) => {
    setForm({ title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate?.slice(0, 10) || '' });
    setEditId(task._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const filtered = tasks.filter(t => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'high') return t.priority === 'high';
    return true;
  });

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '2px solid #d4ead4', fontSize: '14px', outline: 'none',
    color: '#2d5a2d', background: '#f8fdf8', fontFamily: 'Georgia, serif'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7f0', fontFamily: 'Georgia, serif' }}>

      {/* Navbar */}
      <div style={{
        background: '#fff', padding: '14px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '2px solid #d4ead4',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#3a7d44', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🌿 Bloom Tasks
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#d4ead4', color: '#2d5a2d',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: '700', border: '2px solid #a8d5a2'
          }}>{initials}</div>
          <span style={{ color: '#3a7d44', fontSize: '14px', fontStyle: 'italic', fontWeight: '600' }}>{user?.name}</span>
          <button onClick={handleLogout} style={{
            background: '#fff', color: '#c0504d',
            border: '1.5px solid #f4b8b4', padding: '6px 16px',
            borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
            fontFamily: 'Georgia, serif', fontWeight: '600'
          }}>Sign out</button>
        </div>
      </div>

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(160deg, #c8e6c8 0%, #e8f5e8 100%)',
        padding: '28px 28px 22px', textAlign: 'center',
        borderBottom: '1px solid #d4ead4'
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#2d5a2d', margin: 0 }}>
          {greeting}, {user?.name?.split(' ')[0]} 🌸
        </h2>
        <p style={{ color: '#5a8a5a', marginTop: '6px', fontSize: '14px', fontStyle: 'italic' }}>
          {tasks.filter(t => t.status === 'pending').length === 0
            ? 'All tasks done — you are amazing!'
            : `You have ${tasks.filter(t => t.status === 'pending').length} task${tasks.filter(t => t.status === 'pending').length > 1 ? 's' : ''} pending. You've got this!`}
        </p>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total tasks', value: tasks.length, color: '#2d5a2d' },
            { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#c0504d' },
            { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#3a7d44' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: '#fff', borderRadius: '16px', padding: '16px',
              textAlign: 'center', border: '2px solid #d4ead4'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color }}>{value}</div>
              <div style={{ fontSize: '12px', color: '#5a8a5a', marginTop: '4px', fontStyle: 'italic' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[['all', 'All'], ['pending', 'Pending'], ['completed', 'Completed'], ['high', 'High priority']].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'Georgia, serif',
              border: '1.5px solid #d4ead4',
              background: filter === key ? '#3a7d44' : '#fff',
              color: filter === key ? '#fff' : '#3a7d44',
            }}>{label}</button>
          ))}
        </div>

        {/* Add task button */}
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', description: '', priority: 'medium', dueDate: '' }); }}
          style={{
            width: '100%', padding: '13px',
            background: showForm ? '#fff' : '#3a7d44',
            color: showForm ? '#c0504d' : '#fff',
            border: showForm ? '2px solid #f4b8b4' : '2px solid #3a7d44',
            borderRadius: '14px', fontSize: '14px', fontWeight: '700',
            cursor: 'pointer', marginBottom: '16px', fontFamily: 'Georgia, serif'
          }}>
          {showForm ? '✕ Cancel' : '🌱 Add a new task'}
        </button>

        {/* Task form */}
        {showForm && (
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '24px',
            marginBottom: '20px', border: '2px solid #d4ead4',
            boxShadow: '0 4px 20px rgba(58,125,68,0.08)'
          }}>
            <h3 style={{ fontSize: '16px', color: '#2d5a2d', marginBottom: '16px', fontWeight: '700' }}>
              {editId ? 'Edit task' : 'New task'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#3a7d44', marginBottom: '6px' }}>Task title *</label>
                <input style={inputStyle} placeholder="What needs to be done?" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} required
                  onFocus={e => e.target.style.borderColor = '#3a7d44'}
                  onBlur={e => e.target.style.borderColor = '#d4ead4'} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#3a7d44', marginBottom: '6px' }}>Description</label>
                <textarea style={{ ...inputStyle, resize: 'none' }} placeholder="Add some details (optional)"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                  onFocus={e => e.target.style.borderColor = '#3a7d44'}
                  onBlur={e => e.target.style.borderColor = '#d4ead4'} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#3a7d44', marginBottom: '6px' }}>Priority</label>
                  <select style={inputStyle} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#3a7d44', marginBottom: '6px' }}>Due date</label>
                  <input type="date" style={inputStyle} value={form.dueDate}
                    onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    onFocus={e => e.target.style.borderColor = '#3a7d44'}
                    onBlur={e => e.target.style.borderColor = '#d4ead4'} />
                </div>
              </div>
              <button type="submit" style={{
                width: '100%', padding: '13px', background: '#3a7d44',
                color: '#fff', border: 'none', borderRadius: '12px',
                fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                fontFamily: 'Georgia, serif'
              }}>
                {editId ? 'Save changes' : 'Create task'}
              </button>
            </form>
          </div>
        )}

        {/* Section label */}
        <div style={{ fontSize: '13px', color: '#7aaa7a', fontStyle: 'italic', marginBottom: '12px' }}>
          {filtered.length} task{filtered.length !== 1 ? 's' : ''} shown
        </div>

        {/* Task list */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', color: '#7aaa7a', marginTop: '48px',
            fontSize: '15px', fontStyle: 'italic'
          }}>
            Nothing here yet — add a task above 🌿
          </div>
        ) : (
          filtered.map(task => (
            <div key={task._id} style={{
              background: '#fff', borderRadius: '16px', padding: '16px 18px',
              marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '14px',
              border: '2px solid #e8f5e8',
              opacity: task.status === 'completed' ? 0.7 : 1,
              boxShadow: '0 2px 10px rgba(58,125,68,0.06)'
            }}>

              {/* Checkbox */}
              <div onClick={() => toggleComplete(task)} style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                marginTop: '3px', cursor: 'pointer',
                background: task.status === 'completed' ? '#3a7d44' : '#fff',
                border: task.status === 'completed' ? '2px solid #3a7d44' : '2px solid #a8d5a2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '12px', fontWeight: '700'
              }}>
                {task.status === 'completed' ? '✓' : ''}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '15px', fontWeight: '700',
                  color: task.status === 'completed' ? '#aaa' : '#2d5a2d',
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                }}>{task.title}</div>

                {task.description && (
                  <div style={{ fontSize: '13px', color: '#5a8a5a', marginTop: '4px', fontStyle: 'italic' }}>
                    {task.description}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                  <Badge bg={PRIORITY[task.priority].bg} color={PRIORITY[task.priority].color} text={PRIORITY[task.priority].label} />
                  {task.dueDate && <Badge bg="#e8f0fe" color="#3a4ca0" text={`Due ${new Date(task.dueDate).toLocaleDateString()}`} />}
                  {task.status === 'completed' && <Badge bg="#f3e8ff" color="#6a3a9a" text="Completed" />}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => startEdit(task)} style={{
                  background: '#e8f5e8', color: '#2d6a35', border: '1.5px solid #c8e6c8',
                  padding: '6px 13px', borderRadius: '8px', fontSize: '12px',
                  fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif'
                }}>Edit</button>
                <button onClick={() => deleteTask(task._id)} style={{
                  background: '#fde8e8', color: '#b03030', border: '1.5px solid #f4b8b4',
                  padding: '6px 13px', borderRadius: '8px', fontSize: '12px',
                  fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia, serif'
                }}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}