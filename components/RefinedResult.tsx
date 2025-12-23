'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import type { RefinedResultProps } from '@/types';

// Helper function to strip markdown formatting for plain text copy
function stripMarkdown(text: string): string {
  return text
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Remove inline code
    .replace(/`(.+?)`/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove links but keep text
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    // Remove bullet points
    .replace(/^[\s]*[-*+]\s+/gm, '• ')
    // Remove numbered lists formatting
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Clean up multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function RefinedResult({ refinedPrompt, isStreaming = false, onReset }: RefinedResultProps) {
  const [copied, setCopied] = useState(false);

  // Memoize the plain text version for copying
  const plainText = useMemo(() => stripMarkdown(refinedPrompt), [refinedPrompt]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="relative overflow-hidden">
        {/* Animated glow border */}
        <div className="absolute inset-0 bg-linear-to-r from-emerald-500/20 via-green-400/10 to-emerald-500/20 opacity-50" />
        <div className="absolute -inset-px bg-linear-to-r from-emerald-500/30 to-green-500/30 rounded-2xl blur-sm" />
        
        <div className="relative bg-zinc-900/90 rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isStreaming ? 360 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut', repeat: isStreaming ? Infinity : 0 }}
                >
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </motion.div>
                <CardTitle className="text-emerald-400">
                  {isStreaming ? 'Refining...' : 'Refined Prompt'}
                </CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
                disabled={isStreaming}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50"
            >
              <div className="prose prose-invert prose-sm max-w-none prose-headings:text-emerald-400 prose-strong:text-zinc-100 prose-code:text-emerald-300 prose-code:bg-zinc-700/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-a:text-emerald-400">
                <ReactMarkdown>
                  {refinedPrompt}
                </ReactMarkdown>
                {isStreaming && (
                  <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1" />
                )}
              </div>
            </motion.div>
            
            {!isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-4 flex justify-center"
              >
                <Button variant="ghost" onClick={onReset}>
                  Refine Another Idea
                </Button>
              </motion.div>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
