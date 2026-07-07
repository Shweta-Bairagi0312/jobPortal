import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getEmployerJobs,
  getFeaturedJobs,
  getJobStats
} from '../controllers/jobController.js';
import { protect, isEmployer } from '../middleware/auth.js';

const router = express.Router();

router.get('/featured', getFeaturedJobs);
router.get('/stats', getJobStats);
router.get('/employer', protect, isEmployer, getEmployerJobs);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, isEmployer, createJob);
router.put('/:id', protect, isEmployer, updateJob);
router.delete('/:id', protect, deleteJob);

export default router;
