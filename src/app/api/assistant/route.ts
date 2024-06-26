import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY as string });

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  console.log(prompt);

  try {
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: prompt,
    });

    const run = openai.beta.threads.runs.stream(thread.id, {
      assistant_id: process.env.ASSISTANT_ID as string,
    });

    // Accumulate response data
    // Use the stream SDK helper to create a run with
    // streaming. The SDK provides helpful event listeners to handle
    // the streamed response.
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

    // Wait for the response to complete
    await new Promise<void>((resolve) => run.on('end', () => resolve()));
    console.log(responseText);
    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
