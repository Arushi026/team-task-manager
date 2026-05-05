import express from 'express'
import {
  getProjects,
  createProject,
  addMember,
  getProjectById
} from '../controllers/projectController.js'
import authenticate from '../middleware/auth.js'
import { requireRole } from '../middleware/rbac.js'

const router = express.Router()

router.get('/', authenticate, getProjects)
router.post('/', authenticate, requireRole('ADMIN'), createProject)
router.get('/:projectId', authenticate, getProjectById)
router.post('/:projectId/members', authenticate, requireRole('ADMIN'), addMember)

export default router