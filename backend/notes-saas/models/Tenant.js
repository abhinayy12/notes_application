import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // acme, globex
  plan: { type: String, enum: ['Free', 'Pro'], default: 'Free' },
});

export default mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema);