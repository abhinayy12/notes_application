import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';

dotenv.config();
const router = express.Router();

// Predefined users
const predefinedUsers = [
  { email: 'admin@acme.test', password: bcrypt.hashSync('password', 8), role: 'Admin', tenant: 'acme' },
  { email: 'user@acme.test', password: bcrypt.hashSync('password', 8), role: 'Member', tenant: 'acme' },
  { email: 'admin@globex.test', password: bcrypt.hashSync('password', 8), role: 'Admin', tenant: 'globex' },
  { email: 'user@globex.test', password: bcrypt.hashSync('password', 8), role: 'Member', tenant: 'globex' },
];

predefinedUsers.forEach(async (u) => {
  const exists = await User.findOne({ email: u.email });
  if (!exists) {
    await User.create(u);
  }
  const tenantExists = await Tenant.findOne({ slug: u.tenant });
  if (!tenantExists) await Tenant.create({ slug: u.tenant });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Wrong password' });

  const token = jwt.sign(
    { email: user.email, role: user.role, tenant: user.tenant },
    process.env.JWT_SECRET,
    { expiresIn: '4h' }
  );

  res.json({ token });
});

export default router;