import prisma from '../prismaClient.js'

export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { members: { include: { user: true } }, tasks: true }
    })
    res.json(projects)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const createProject = async (req, res) => {
  try {
    const { name } = req.body
    const project = await prisma.project.create({
      data: {
        name,
        members: {
          create: {
            userId: req.user.id,
            role: 'admin'
          }
        }
      }
    })
    res.status(201).json(project)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const addMember = async (req, res) => {
  try {
    const { projectId } = req.params
    const { userId, role } = req.body
    const member = await prisma.projectMember.create({
      data: { projectId, userId, role: role || 'member' }
    })
    res.status(201).json(member)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: { include: { user: true } }, tasks: true }
    })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}