import express from 'express';
import {
  saveJob,
  unsaveJob,
  getSavedJobs,
  checkIfSaved
} from '../controllers/savedJobController.js';
import { protect, isJobSeeker } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getSavedJobs);
router.get('/check/:jobId', protect, checkIfSaved);
router.post('/:jobId', protect, saveJob);
router.delete('/:jobId', protect, unsaveJob);

export default router;
