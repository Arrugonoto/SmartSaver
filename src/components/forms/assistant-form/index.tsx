'use client';
import { useState } from 'react';
import { Input } from '@nextui-org/input';
import FormButton from '@components/buttons/FormButton';

export const AssistantForm = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!res.ok) {
        console.error(res);
        throw new Error('Network response was not ok');
      }

      const result = res.json();

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex">
        <Input
          label="Message"
          isRequired={!prompt}
          size="sm"
          radius="sm"
          type="text"
          name="message"
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full"
        />
        <FormButton type="submit" isDisabled={!prompt} className="w-auto">
          send
        </FormButton>
      </form>
    </div>
  );
};
