'use client';
import { useState, useEffect, useRef } from 'react';
import { AssistantForm } from '@components/forms/assistant-form';
import { AssistantChatWindow } from '@components/assistant/assistant-chat-window';
import type { Message } from '@lib/constants/types/message';
import { asistantIcons } from '@lib/constants/icons';
import { Divider } from '@nextui-org/divider';

export const AssistantSection = () => {
  const [userMessage, setUserMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <section className="flex flex-col h-full w-full bg-content2 rounded-lg">
      <div className="flex gap-1 py-3 px-4 items-end">
        <span>
          <asistantIcons.assistant className="text-[1.4rem]" />
        </span>
        <h2 className="leading-4 text-[1.1rem] font-normal">Assistant</h2>
      </div>
      <Divider />
      <div className="flex flex-col h-full px-[2rem] lg:px-[15%] py-4">
        <AssistantChatWindow
          ref={messagesContainerRef}
          messages={messages}
          loading={loading}
          userMessage={userMessage}
        />
        <AssistantForm
          setMessages={setMessages}
          setLoading={setLoading}
          setUserMessage={setUserMessage}
        />
      </div>
    </section>
  );
};
