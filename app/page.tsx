'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { PromptInput } from '@/components/PromptInput';
import { RefinedResult } from '@/components/RefinedResult';
import { RecentRefinements } from '@/components/RecentRefinements';
import { getVisitorId } from '@/lib/visitor';

export default function Home() {
  const [visitorId, setVisitorId] = useState<string>('');
  const [refinedPrompt, setRefinedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Initialize visitor ID on client side
    const id = getVisitorId();
    setVisitorId(id);
  }, []);

  const handleSubmit = async (prompt: string) => {
    if (!visitorId) {
      setError('Session not initialized. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setIsStreaming(true);
    setError('');
    setRefinedPrompt('');

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          visitorId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to refine prompt');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Failed to read response stream');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                throw new Error(data.error);
              }
              
              if (data.content) {
                accumulatedContent += data.content;
                setRefinedPrompt(accumulatedContent);
              }
              
              if (data.done) {
                setIsStreaming(false);
                setRefreshTrigger((prev) => prev + 1); // Trigger history refresh
              }
            } catch (parseError) {
              // Ignore parsing errors for incomplete JSON
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRefinedPrompt('');
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRefinedPrompt('');
    setError('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[128px]" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-4xl mx-auto">
          <HeroSection />

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center text-sm">
              {error}
            </div>
          )}

          {refinedPrompt || isStreaming ? (
            <RefinedResult
              refinedPrompt={refinedPrompt}
              isStreaming={isStreaming}
              onReset={handleReset}
            />
          ) : (
            <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
          )}
        </div>
      </main>

      {/* History Panel */}
      <RecentRefinements refreshTrigger={refreshTrigger} />
    </div>
  );
}
