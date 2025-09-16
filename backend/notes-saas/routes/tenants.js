import express from 'express';
import Tenant from '../models/Tenant.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/:slug/upgrade', authMiddleware, adminMiddleware, async (req, res) => {
  const { slug } = req.params;
  const tenant = await Tenant.findOne({ slug });
  if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

  tenant.plan = 'Pro';
  await tenant.save();
  res.json({ message: `${slug} upgraded to Pro!` });
});

export default router;