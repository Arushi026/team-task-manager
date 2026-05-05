import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Project() {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    fetchProject()
    fetchTasks()
  }, [])

  const fetchProject = async () => {
    const res = await api.get(`/projects/${projectId}`)
    setProject(res.data)
  }

  const fetchTasks = async () => {
    const res = await api.get(`/tasks/${projectId}`)
    setTasks(res.data)
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    await api.post('/tasks', {
      title,
      projectId,
      assigneeId: assigneeId || null,
      dueDate: dueDate || null
    })
    setTitle('')
    setDueDate('')
    setAssigneeId('')
    fetchTasks()
  }

  const handleStatusChange = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/status`, { status })
    fetchTasks()
  }

  const statusColor = (status) => {
    if (status === 'TODO') return 'bg-yellow-100'
    if (status === 'IN_PROGRESS') return 'bg-blue-100'
    if (status === 'DONE') return 'bg-green-100'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{project?.name}</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back
        </button>
      </nav>

      <div className="p-6">
        {user?.role === 'ADMIN' && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="font-bold text-lg mb-4">Create Task</h2>
            <form onSubmit={handleCreateTask} className="flex gap-4 flex-wrap">
              <input
                type="text"
                placeholder="Task title"
                className="border rounded px-3 py-2 flex-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                type="date"
                className="border rounded px-3 py-2"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <select
                className="border rounded px-3 py-2"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                <option value="">Assign to...</option>
                {project?.members?.map(m => (
                  <option key={m.userId} value={m.userId}>
                    {m.user?.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Task
              </button>
            </form>
          </div>
        )}

        <h2 className="font-bold text-lg mb-4">Tasks</h2>
        <div className="grid grid-cols-1 gap-4">
          {tasks.map(task => (
            <div key={task.id} className={`p-4 rounded-lg shadow ${statusColor(task.status)}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-gray-500 text-sm">
                    Assigned to: {task.assignee?.name || 'Unassigned'}
                  </p>
                  {task.dueDate && (
                    <p className="text-gray-500 text-sm">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <select
                  className="border rounded px-3 py-2"
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}