'use client';
import { useState, useEffect, useRef } from 'react';
import { AssistantForm } from '@components/forms/assistant-form';
import { AssistantChatWindow } from '@components/assistant/assistant-chat-window';
import { asistantIcons } from '@lib/constants/icons';
import { Divider } from '@nextui-org/divider';
import { useAssistantChatConext } from '@context/AsssistantChatContext';

export const AssistantSection = () => {
  const [userMessagePlaceholder, setUserMessagePlaceholder] =
    useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { chatHistory } = useAssistantChatConext();
  const messages = chatHistory.messages;

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
      <div className="flex flex-col h-full min-h-0 px-[2rem] lg:px-[15%] py-4 justify-between">
        <div className="overflow-y-scroll flex-1 min-h-0">
          <AssistantChatWindow
            ref={messagesContainerRef}
            loading={loading}
            userMessage={userMessagePlaceholder}
          />
        </div>
        <AssistantForm
          loading={loading}
          setLoading={setLoading}
          setUserMessage={setUserMessagePlaceholder}
        />
      </div>
    </section>
  );
};
