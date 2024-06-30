import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY as string });

export async function POST(req: Request) {
  // Destructure prompt(message), and threadId from request
  const { prompt, threadId } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  try {
    // Check if thread exists (thread_id),
    // create new thread if thread_id isn't provided
    let thread_id = '';

    if (!threadId) {
      const thread = await openai.beta.threads.create();
      thread_id = thread.id;
    } else {
      thread_id = threadId;
    }

    // Create new user message (prompt)
    const message = await openai.beta.threads.messages.create(thread_id, {
      role: 'user',
      content: prompt,
    });

    const run = openai.beta.threads.runs.stream(thread_id, {
      assistant_id: process.env.ASSISTANT_ID as string,
    });

    // Accumulate response data
    // Use the stream OpenAI SDK helper to create a run with
    // streaming. The SDK provides helpful event listeners to handle
    // the streamed response. - OpenAI Docs
    let responseText = '';

    run
      .on('textCreated', (text) => (responseText += '\nassistant > '))
      .on('textDelta', (textDelta) => (responseText += textDelta.value))
      .on(
        'toolCallCreated',
        (toolCall) => (responseText += `\nassistant > ${toolCall.type}\n\n`)
      )
      .on('toolCallDelta', (toolCallDelta, snapshot) => {
        if (toolCallDelta.type === 'code_interpreter') {
          if (toolCallDelta?.code_interpreter?.input) {
            responseText += toolCallDelta.code_interpreter.input;
          }
          if (toolCallDelta?.code_interpreter?.outputs) {
            responseText += '\noutput >\n';
            toolCallDelta.code_interpreter.outputs.forEach((output) => {
              if (output.type === 'logs') {
                responseText += `\n${output.logs}\n`;
              }
            });
          }
        }
      });

    // Wait for the response to complete, and return it
    await new Promise<void>((resolve) => run.on('end', () => resolve()));

    // Get thread related messages
    const thread_messages = await openai.beta.threads.messages.list(thread_id);

    // Extract list of messages from thread of Assistant API response
    const messages = thread_messages.data.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    }));

    // Return structured response via Next API route
    return NextResponse.json(
      { response: responseText, thread_id, messages },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
