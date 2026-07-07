import express from 'express';
import {
  createCompany,
  getCompany,
  getMyCompany,
  updateCompany,
  getAllCompanies,
  getCompanyJobs,
  getCompanyStats
} from '../controllers/companyController.js';
import { protect, isEmployer } from '../middleware/auth.js';
import { uploadLogo } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllCompanies);
router.get('/my', protect, getMyCompany);
router.get('/my/stats', protect, getCompanyStats);
router.get('/:id', getCompany);
router.get('/:id/jobs', getCompanyJobs);
router.post('/', protect, isEmployer, uploadLogo, createCompany);
router.put('/', protect, isEmployer, uploadLogo, updateCompany);

export default router;
