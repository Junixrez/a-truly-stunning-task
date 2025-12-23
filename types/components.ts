/**
 * Props for the PromptInput component
 */
export interface PromptInputProps {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

/**
 * Props for the RefinedResult component
 */
export interface RefinedResultProps {
  refinedPrompt: string;
  isStreaming?: boolean;
  onReset: () => void;
}

/**
 * Props for the RecentRefinements component
 */
export interface RecentRefinementsProps {
  refreshTrigger?: number;
}
