'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Copy, Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getVisitorId } from '@/lib/visitor';
import ReactMarkdown from 'react-markdown';
import type { Submission, RecentRefinementsProps } from '@/types';

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

function HistoryItem({ 
  submission, 
  index, 
  copiedId, 
  onCopy 
}: { 
  submission: Submission; 
  index: number; 
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const plainText = useMemo(() => stripMarkdown(submission.refinedPrompt), [submission.refinedPrompt]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncate = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  };

  return (
    <motion.div
      key={submission._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-xl p-4 space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-zinc-500 mb-1">
            {formatDate(submission.createdAt)}
          </p>
          <p className="text-sm text-zinc-400">
            <span className="text-zinc-500">Original:</span>{' '}
            {truncate(submission.originalPrompt, 60)}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCopy(plainText, submission._id)}
            title="Copy as plain text"
          >
            {copiedId === submission._id ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
              <div className="prose prose-invert prose-sm max-w-none prose-headings:text-emerald-400 prose-headings:text-sm prose-headings:font-semibold prose-headings:mb-2 prose-headings:mt-3 prose-p:text-zinc-200 prose-p:text-sm prose-p:leading-relaxed prose-strong:text-zinc-100 prose-code:text-emerald-300 prose-code:bg-zinc-700/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-ul:text-zinc-200 prose-ul:text-sm prose-li:text-zinc-200 prose-li:text-sm">
                <ReactMarkdown>
                  {submission.refinedPrompt}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-emerald-400"
          >
            <ChevronDown className="w-4 h-4 shrink-0 opacity-50" />
            <p className="text-sm text-zinc-400 line-clamp-2">
              {truncate(stripMarkdown(submission.refinedPrompt), 100)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function RecentRefinements({ refreshTrigger }: RecentRefinementsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/history?visitorId=${visitorId}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (submissions.length === 0 && !loading) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40"
      >
        <Button
          variant="secondary"
          onClick={() => setIsOpen(true)}
          className="rounded-l-xl rounded-r-none px-3 py-6 flex-col gap-1 border-r-0"
        >
          <History className="w-5 h-5 text-emerald-400" />
          <span className="text-xs">History</span>
          {submissions.length > 0 && (
            <span className="absolute -top-1 -left-1 w-5 h-5 bg-emerald-500 rounded-full text-xs flex items-center justify-center text-black font-bold">
              {submissions.length}
            </span>
          )}
        </Button>
      </motion.div>

      {/* Slide-over Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-semibold text-zinc-100">Recent Refinements</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  submissions.map((submission, index) => (
                    <HistoryItem
                      key={submission._id}
                      submission={submission}
                      index={index}
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
