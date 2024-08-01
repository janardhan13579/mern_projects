import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(data);
      } catch (error) {
        setError('Failed to fetch tasks');
        console.error(error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/api/tasks', 
        { title: newTask }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, data]);
      setNewTask('');
    } catch (error) {
      setError('Failed to add task');
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      setError('Failed to delete task');
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className='dashboard-container'>
      <button onClick={handleLogout} className='logout-button'>
        Logout
      </button>
      <input
        className='task-input'
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task"
      />
      <button onClick={handleAddTask}>Add Task</button>
      {error && <div className='error'>{error}</div>}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title}
            <button onClick={() => handleDeleteTask(task._id)} className='delete-button'>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
