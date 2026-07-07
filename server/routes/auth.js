import express from 'express';
import { register, login, getMe, updateProfile, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { uploadProfileImage, uploadResume } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, uploadProfileImage, updateProfile);
router.put('/resume', protect, uploadResume, updateProfile);
router.put('/password', protect, changePassword);

export default router;
