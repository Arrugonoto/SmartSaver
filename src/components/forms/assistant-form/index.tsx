'use client';
import React, { useState } from 'react';
import { Input } from '@nextui-org/input';
import FormButton from '@components/buttons/FormButton';

type Message = {
  id: string;
  role: string;
  content: [
    {
      text: {
        annotations: [];
        value: string;
      };
    }
  ];
};

export const AssistantForm = ({
  setMessages,
  setUserMessage,
  setLoading,
}: {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUserMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [threadId, setThreadId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    clearInput();
    setUserMessage(prompt);
    setLoading(true);

    const message = {
      prompt: prompt,
      threadId: threadId,
    };

    try {
      const res = await fetch('api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!res.ok) {
        console.error(res);
        throw new Error('Network response was not ok');
      }

      const result = await res.json();
      const reversedMessages = result?.messages.reverse();

      setThreadId(result.thread_id);
      setMessages(reversedMessages);

      console.log(result);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const clearInput = () => {
    setPrompt('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          label="Message"
          isRequired={!prompt}
          size="sm"
          radius="sm"
          type="text"
          name="message"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full"
          classNames={{ inputWrapper: ['bg-content3'] }}
        />
        <FormButton
          type="submit"
          isDisabled={!prompt}
          className="min-w-0 w-auto rounded-lg"
        >
          ask
        </FormButton>
      </form>
    </div>
  );
};
