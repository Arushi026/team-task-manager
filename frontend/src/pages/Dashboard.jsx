import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
    }
    fetchDashboard()
    fetchProjects()
  }, [])

  const fetchDashboard = async () => {
    const res = await api.get('/tasks/dashboard')
    setDashboard(res.data)
  }

  const fetchProjects = async () => {
    const res = await api.get('/projects')
    setProjects(res.data)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Task Manager</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{user?.name} ({user?.role})</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6">
        {dashboard && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-gray-500">Total</p>
              <p className="text-3xl font-bold">{dashboard.total}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
              <p className="text-gray-500">Todo</p>
              <p className="text-3xl font-bold">{dashboard.todo}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
              <p className="text-gray-500">In Progress</p>
              <p className="text-3xl font-bold">{dashboard.inProgress}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow text-center">
              <p className="text-gray-500">Done</p>
              <p className="text-3xl font-bold">{dashboard.done}</p>
            </div>
          </div>
        )}

        {dashboard?.overdue?.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            <h2 className="text-red-600 font-bold mb-2">⚠️ Overdue Tasks</h2>
            {dashboard.overdue.map(task => (
              <div key={task.id} className="text-red-500">
                {task.title} — {task.project?.name}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Projects</h2>
          {user?.role === 'ADMIN' && (
            <Link
              to="/projects/new"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              + New Project
            </Link>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {projects.map(project => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md"
            >
              <h3 className="font-bold text-lg">{project.name}</h3>
              <p className="text-gray-500">{project.tasks?.length} tasks</p>
              <p className="text-gray-500">{project.members?.length} members</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}