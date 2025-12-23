import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { connectToDatabase } from '@/lib/mongodb';
import { Submission } from '@/lib/models/Submission';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert UI/UX designer and prompt engineer specializing in website and web application concepts. 

Your task is to transform rough, unpolished website ideas into clear, detailed, and professional prompts that can be used to create stunning websites.

When refining a prompt:
1. Expand on the core concept with specific features and functionality
2. Suggest modern design elements, color schemes, and visual styles
3. Include user experience considerations
4. Add technical specifications when relevant
5. Maintain the original intent while elevating the quality
6. Structure the output clearly with sections if the idea is complex

Keep the refined prompt concise yet comprehensive (typically 150-300 words). Make it actionable and specific enough that a designer or developer could immediately start working on it.

Format your response using markdown for better readability:
- Use **bold** for emphasis on key features
- Use bullet points for lists
- Use headings (##) for sections when the concept is complex
- Use \`code\` formatting for technical terms`;

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const body = await request.json();
    const { prompt, visitorId } = body;

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!visitorId || typeof visitorId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Visitor ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        let fullContent = '';

        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: `Please refine the following rough website idea into a polished, detailed prompt:\n\n"${prompt}"` },
            ],
            temperature: 0.7,
            max_tokens: 1000,
            stream: true,
          });

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
              // Send the chunk as a server-sent event
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }

          // Save to MongoDB after streaming completes
          await connectToDatabase();
          
          const submission = new Submission({
            visitorId,
            originalPrompt: prompt,
            refinedPrompt: fullContent,
            createdAt: new Date(),
          });

          await submission.save();

          // Send completion signal with submission ID
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, submissionId: submission._id })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'An error occurred during generation' })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in /api/refine:', error);

    if (error instanceof Error && error.message.includes('API key')) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
