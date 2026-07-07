import express from 'express';
import {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  getEmployerApplications,
  updateApplicationStatus,
  getApplicationStats,
  withdrawApplication
} from '../controllers/applicationController.js';
import { protect, isJobSeeker, isEmployer } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';

const router = express.Router();

router.get('/my', protect, getMyApplications);
router.get('/stats', protect, isEmployer, getApplicationStats);
router.get('/employer', protect, isEmployer, getEmployerApplications);
router.get('/job/:jobId', protect, isEmployer, getJobApplicants);
router.post('/job/:jobId', protect, isJobSeeker, uploadResume, applyToJob);
router.put('/:id/status', protect, isEmployer, updateApplicationStatus);
router.delete('/:id', protect, withdrawApplication);

export default router;
