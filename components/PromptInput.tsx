'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { PromptInputProps } from '@/types';

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    await onSubmit(prompt.trim());
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-linear-to-r from-emerald-500/20 via-green-500/10 to-emerald-500/20 rounded-2xl blur-lg opacity-60" />
        <div className="relative glass rounded-2xl p-6 space-y-4">
          <label htmlFor="prompt-input" className="block text-sm font-medium text-zinc-300 mb-2">
            Describe your website idea
          </label>
          <Textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., I want a landing page for my SaaS product that helps people manage their tasks. It should feel modern and professional..."
            className="min-h-[140px]"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              {prompt.length > 0 ? `${prompt.length} characters` : 'Be as detailed as you like'}
            </p>
            <Button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="min-w-[160px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Refining...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Refine My Idea
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
