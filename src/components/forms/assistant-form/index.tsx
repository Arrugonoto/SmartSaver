'use client';
import React, { useState } from 'react';
import { Textarea } from '@nextui-org/input';
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
  const [textLimit, setTextLimit] = useState<number>(200);

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 200) {
      setPrompt(e.target.value);
    }
  };

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
        <Textarea
          label="Message"
          isRequired={!prompt}
          size="sm"
          radius="md"
          type="text"
          name="message"
          value={prompt}
          onChange={(e) => handlechange(e)}
          minRows={1}
          maxRows={3}
          className="w-full p-0"
          classNames={{
            inputWrapper: [
              'bg-content3',
              'group-data-[focus=true]:bg-content1',
            ],
            label: ['h-8'],
          }}
          endContent={
            <div
              className={`flex self-end text-xs w-16 justify-end ${
                prompt.length >= 100 && prompt.length < 150 && 'text-yellow-300'
              }
                ${prompt.length >= 150 && prompt.length < 200 && 'text-warning'}
                ${prompt.length === 200 && 'text-danger'}
            `}
            >
              <p>{prompt.length}/200</p>
            </div>
          }
        />
        <FormButton
          type="submit"
          isDisabled={!prompt}
          className="min-w-0 w-auto rounded-lg bg-content1"
        >
          ask
        </FormButton>
      </form>
    </div>
  );
};
