import prisma from '../prismaClient.js'

export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: { assignee: true }
    })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const createTask = async (req, res) => {
  try {
    const { title, projectId, assigneeId, dueDate } = req.body
    const task = await prisma.task.create({
      data: {
        title,
        projectId,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    })
    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params
    const { status } = req.body
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status }
    })
    res.json(task)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const getDashboard = async (req, res) => {
  try {
    const total = await prisma.task.count()
    const todo = await prisma.task.count({ where: { status: 'TODO' } })
    const inProgress = await prisma.task.count({ where: { status: 'IN_PROGRESS' } })
    const done = await prisma.task.count({ where: { status: 'DONE' } })
    const overdue = await prisma.task.findMany({
      where: {
        dueDate: { lt: new Date() },
        status: { not: 'DONE' }
      },
      include: { assignee: true, project: true }
    })
    res.json({ total, todo, inProgress, done, overdue })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}