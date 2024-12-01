import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  userId: mongoose.Types.ObjectId;
  adminId: mongoose.Types.ObjectId;
  task: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

const AssignmentSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
