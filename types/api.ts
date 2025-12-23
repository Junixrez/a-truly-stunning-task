/**
 * Submission type representing a refined prompt stored in the database
 */
export interface Submission {
  _id: string;
  visitorId: string;
  originalPrompt: string;
  refinedPrompt: string;
  createdAt: string;
}

/**
 * API response for the refine endpoint (non-streaming fallback)
 */
export interface RefineResponse {
  refinedPrompt: string;
  submissionId: string;
}

/**
 * API response for the history endpoint
 */
export interface HistoryResponse {
  submissions: Submission[];
}

/**
 * Streaming data chunk from the refine endpoint
 */
export interface StreamChunk {
  content?: string;
  done?: boolean;
  submissionId?: string;
  error?: string;
}
