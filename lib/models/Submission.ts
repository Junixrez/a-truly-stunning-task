import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  visitorId: string;
  originalPrompt: string;
  refinedPrompt: string;
  createdAt: Date;
}

const SubmissionSchema: Schema = new Schema({
  visitorId: {
    type: String,
    required: true,
    index: true,
  },
  originalPrompt: {
    type: String,
    required: true,
  },
  refinedPrompt: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model recompilation in development
export const Submission = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
