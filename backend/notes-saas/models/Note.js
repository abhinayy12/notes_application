import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tenant: { type: String, required: true },
  createdBy: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Note || mongoose.model('Note', noteSchema);