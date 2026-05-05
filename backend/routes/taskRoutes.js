import express from 'express'
import {
  getTasks,
  createTask,
  updateTaskStatus,
  getDashboard
} from '../controllers/taskController.js'
import authenticate from '../middleware/auth.js'
import { requireRole } from '../middleware/rbac.js'

const router = express.Router()

router.get('/dashboard', authenticate, getDashboard)
router.get('/:projectId', authenticate, getTasks)
router.post('/', authenticate, requireRole('ADMIN'), createTask)
router.patch('/:taskId/status', authenticate, updateTaskStatus)

export default router