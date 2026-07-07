import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getDashboardStats
} from '../controllers/userController.js';
import { protect, authorize, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, isAdmin, getDashboardStats);
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id/status', protect, isAdmin, updateUserStatus);
router.delete('/:id', protect, isAdmin, deleteUser);

export default router;
