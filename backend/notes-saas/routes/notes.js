import express from 'express';
import Note from '../models/Note.js';
import Tenant from '../models/Tenant.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const { tenant, email } = req.user;

  const tenantData = await Tenant.findOne({ slug: tenant });
  if (tenantData.plan === 'Free') {
    const noteCount = await Note.countDocuments({ tenant });
    if (noteCount >= 3) return res.status(403).json({ message: 'Free plan limit reached' });
  }

  const note = await Note.create({ title, content, tenant, createdBy: email });
  res.json(note);
});

router.get('/', async (req, res) => {
  const { tenant } = req.user;
  const notes = await Note.find({ tenant });
  res.json(notes);
});

router.get('/:id', async (req, res) => {
  const { tenant } = req.user;
  const note = await Note.findOne({ _id: req.params.id, tenant });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

router.put('/:id', async (req, res) => {
  const { tenant } = req.user;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, tenant },
    req.body,
    { new: true }
  );
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

router.delete('/:id', async (req, res) => {
  const { tenant } = req.user;
  const note = await Note.findOneAndDelete({ _id: req.params.id, tenant });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Note deleted' });
});

export default router;