import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tasks');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/tasks`, {
        title: newTaskTitle,
        completed: false,
      });
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
    } catch (err) {
      console.error(err);
      setError('Failed to add task');
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId, currentStatus) => {
    try {
      const res = await axios.patch(`${API_URL}/tasks/${taskId}`, {
        completed: !currentStatus,
      });
      setTasks(tasks.map(t => (t._id === taskId ? res.data : t)));
    } catch (err) {
      console.error(err);
      setError('Failed to update task');
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete task');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>📋 Task Manager</h1>

      {/* New Task Input */}
      <div>
        <input
          type="text"
          placeholder="Enter task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Loading / Error */}
      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Task List */}
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task._id, task.completed)}
            />
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                marginLeft: '10px'
              }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task._id)} style={{ marginLeft: '15px' }}>
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
