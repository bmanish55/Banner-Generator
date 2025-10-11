import express from 'express';
import {
  generateDesigns,
  createBanner,
  getBanners,
  getBanner,
  updateBanner,
  deleteBanner
} from '../controllers/bannerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All banner routes require authentication
router.use(authenticateToken);

router.post('/generate-designs', generateDesigns);
router.post('/', createBanner);
router.get('/', getBanners);
router.get('/:id', getBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

export default router;
