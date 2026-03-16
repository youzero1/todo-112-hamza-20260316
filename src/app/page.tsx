'use client';

import { useState, useEffect, useCallback } from 'react';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EditState {
  title: string;
  description: string;
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditState>({ title: '', description: '' });

  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDescription || undefined })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create todo');
      }
      setNewTitle('');
      setNewDescription('');
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (todo: Todo) => {
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      });
      if (!res.ok) throw new Error('Failed to update todo');
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete todo');
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditState({ title: todo.title, description: todo.description || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditState({ title: '', description: '' });
  };

  const handleUpdate = async (id: number) => {
    if (!editState.title.trim()) return;
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editState.title, description: editState.description || null })
      });
      if (!res.ok) throw new Error('Failed to update todo');
      setEditingId(null);
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px'
    } as React.CSSProperties,
    header: {
      textAlign: 'center' as const,
      marginBottom: '40px'
    } as React.CSSProperties,
    title: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1a1a2e',
      margin: '0 0 8px 0'
    } as React.CSSProperties,
    subtitle: {
      color: '#666',
      fontSize: '1rem',
      margin: 0
    } as React.CSSProperties,
    card: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      marginBottom: '24px'
    } as React.CSSProperties,
    formTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1a1a2e',
      marginTop: 0,
      marginBottom: '16px'
    } as React.CSSProperties,
    input: {
      width: '100%',
      padding: '10px 14px',
      fontSize: '1rem',
      border: '1.5px solid #e0e0e0',
      borderRadius: '8px',
      outline: 'none',
      boxSizing: 'border-box' as const,
      marginBottom: '12px',
      transition: 'border-color 0.2s'
    } as React.CSSProperties,
    textarea: {
      width: '100%',
      padding: '10px 14px',
      fontSize: '1rem',
      border: '1.5px solid #e0e0e0',
      borderRadius: '8px',
      outline: 'none',
      boxSizing: 'border-box' as const,
      marginBottom: '12px',
      resize: 'vertical' as const,
      minHeight: '80px',
      fontFamily: 'inherit'
    } as React.CSSProperties,
    btnPrimary: {
      backgroundColor: '#4f46e5',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 24px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    } as React.CSSProperties,
    btnDanger: {
      backgroundColor: '#ef4444',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '0.85rem',
      fontWeight: 500,
      cursor: 'pointer'
    } as React.CSSProperties,
    btnSecondary: {
      backgroundColor: '#6b7280',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '0.85rem',
      fontWeight: 500,
      cursor: 'pointer'
    } as React.CSSProperties,
    btnEdit: {
      backgroundColor: '#f59e0b',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '0.85rem',
      fontWeight: 500,
      cursor: 'pointer'
    } as React.CSSProperties,
    btnSuccess: {
      backgroundColor: '#10b981',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '0.85rem',
      fontWeight: 500,
      cursor: 'pointer'
    } as React.CSSProperties,
    errorBox: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '12px 16px',
      color: '#dc2626',
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    } as React.CSSProperties,
    todoItem: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      padding: '16px 20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      marginBottom: '12px',
      border: '1.5px solid #f0f0f0'
    } as React.CSSProperties,
    todoItemCompleted: {
      backgroundColor: '#f9fafb',
      borderRadius: '10px',
      padding: '16px 20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      marginBottom: '12px',
      border: '1.5px solid #e5e7eb',
      opacity: 0.75
    } as React.CSSProperties,
    todoHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    } as React.CSSProperties,
    checkbox: {
      width: '20px',
      height: '20px',
      cursor: 'pointer',
      marginTop: '2px',
      flexShrink: 0
    } as React.CSSProperties,
    todoContent: {
      flex: 1,
      minWidth: 0
    } as React.CSSProperties,
    todoTitle: {
      fontSize: '1.05rem',
      fontWeight: 600,
      color: '#1a1a2e',
      margin: '0 0 4px 0',
      wordBreak: 'break-word' as const
    } as React.CSSProperties,
    todoTitleCompleted: {
      fontSize: '1.05rem',
      fontWeight: 600,
      color: '#9ca3af',
      margin: '0 0 4px 0',
      textDecoration: 'line-through',
      wordBreak: 'break-word' as const
    } as React.CSSProperties,
    todoDescription: {
      fontSize: '0.9rem',
      color: '#6b7280',
      margin: '0 0 6px 0',
      wordBreak: 'break-word' as const
    } as React.CSSProperties,
    todoDate: {
      fontSize: '0.78rem',
      color: '#9ca3af',
      margin: 0
    } as React.CSSProperties,
    todoActions: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      flexShrink: 0
    } as React.CSSProperties,
    emptyState: {
      textAlign: 'center' as const,
      padding: '40px 20px',
      color: '#9ca3af',
      fontSize: '1rem'
    } as React.CSSProperties,
    loadingState: {
      textAlign: 'center' as const,
      padding: '40px 20px',
      color: '#6b7280',
      fontSize: '1rem'
    } as React.CSSProperties,
    statsBar: {
      display: 'flex',
      gap: '16px',
      marginBottom: '16px',
      fontSize: '0.9rem',
      color: '#6b7280'
    } as React.CSSProperties,
    statBadge: {
      backgroundColor: '#f3f4f6',
      borderRadius: '20px',
      padding: '4px 12px',
      fontWeight: 500
    } as React.CSSProperties
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📝 Todo App</h1>
        <p style={styles.subtitle}>Stay organized and get things done</p>
      </div>

      {/* Add Todo Form */}
      <div style={styles.card}>
        <h2 style={styles.formTitle}>Add New Todo</h2>
        {error && (
          <div style={styles.errorBox}>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: 700, fontSize: '1rem' }}
            >
              ×
            </button>
          </div>
        )}
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Todo title (required)"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
            style={styles.textarea}
          />
          <button
            type="submit"
            style={{ ...styles.btnPrimary, opacity: submitting ? 0.7 : 1 }}
            disabled={submitting || !newTitle.trim()}
          >
            {submitting ? 'Adding...' : '+ Add Todo'}
          </button>
        </form>
      </div>

      {/* Todo List */}
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ ...styles.formTitle, marginBottom: 0 }}>Your Todos</h2>
          {totalCount > 0 && (
            <div style={styles.statsBar}>
              <span style={styles.statBadge}>Total: {totalCount}</span>
              <span style={{ ...styles.statBadge, backgroundColor: '#d1fae5', color: '#065f46' }}>Done: {completedCount}</span>
              <span style={{ ...styles.statBadge, backgroundColor: '#fef3c7', color: '#92400e' }}>Pending: {totalCount - completedCount}</span>
            </div>
          )}
        </div>

        {loading ? (
          <div style={styles.loadingState}>Loading todos...</div>
        ) : todos.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ fontSize: '2rem', margin: '0 0 8px 0' }}>🎉</p>
            <p style={{ margin: 0 }}>No todos yet. Add one above to get started!</p>
          </div>
        ) : (
          <div>
            {todos.map(todo => (
              <div key={todo.id} style={todo.completed ? styles.todoItemCompleted : styles.todoItem}>
                {editingId === todo.id ? (
                  <div>
                    <input
                      type="text"
                      value={editState.title}
                      onChange={e => setEditState(s => ({ ...s, title: e.target.value }))}
                      style={{ ...styles.input, marginBottom: '8px' }}
                    />
                    <textarea
                      value={editState.description}
                      onChange={e => setEditState(s => ({ ...s, description: e.target.value }))}
                      style={{ ...styles.textarea, marginBottom: '8px', minHeight: '60px' }}
                      placeholder="Description (optional)"
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleUpdate(todo.id)}
                        style={styles.btnSuccess}
                        disabled={!editState.title.trim()}
                      >
                        Save
                      </button>
                      <button onClick={cancelEdit} style={styles.btnSecondary}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={styles.todoHeader}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
                      style={styles.checkbox}
                      title="Toggle completion"
                    />
                    <div style={styles.todoContent}>
                      <p style={todo.completed ? styles.todoTitleCompleted : styles.todoTitle}>
                        {todo.title}
                      </p>
                      {todo.description && (
                        <p style={styles.todoDescription}>{todo.description}</p>
                      )}
                      <p style={styles.todoDate}>Created: {formatDate(todo.createdAt)}</p>
                    </div>
                    <div style={styles.todoActions}>
                      <button
                        onClick={() => startEdit(todo)}
                        style={styles.btnEdit}
                        title="Edit todo"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        style={styles.btnDanger}
                        title="Delete todo"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
