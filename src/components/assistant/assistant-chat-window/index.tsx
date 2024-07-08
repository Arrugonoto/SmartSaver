'use client';
import React, { forwardRef } from 'react';
import { capitalizeString } from '@lib/helpers/capitalize';
import { LoaderDots } from '@components/loaders/loader-dots';
import { asistantIcons } from '@lib/constants/icons';

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

type ChatWindowTypes = {
  messages: Message[];
  loading: boolean;
  userMessage: string;
};

export const AssistantChatWindow = forwardRef(
  (
    { messages, loading, userMessage }: ChatWindowTypes,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className="flex flex-col h-full gap-4 overflow-auto scroll-smooth"
      >
        <div className="flex gap-2 bg-content3 p-2 rounded-md max-w-[80%]">
          <span>
            <asistantIcons.assistant className="text-[1rem]" />
          </span>
          <p className="text-sm">{`Hi. I'm Your personal Assistant. Sometimes I can make mistakes. Remember, it is always best to contact an experienced professional.`}</p>
        </div>
        {messages.map((message, index, array) => (
          <div
            key={message.id}
            className={` ${
              message.role === 'user' && 'self-end pr-3'
            } max-w-[80%]`}
          >
            {message.role !== 'user' &&
              message.role !== array[index - 1].role && (
                <p>{capitalizeString(message.role)}</p>
              )}

            <p
              className={` ${
                message.role === 'user' ? 'bg-content1' : 'bg-content3'
              }  p-2 rounded-lg text-sm
      `}
            >
              {message.content[0].text.value}
            </p>
          </div>
        ))}
        {loading && (
          <div className="self-end text-sm max-w-[80%] bg-content3 opacity-60 p-2 rounded-lg">
            <p>{userMessage}</p>
          </div>
        )}
        {loading && <LoaderDots />}
      </div>
    );
  }
);

AssistantChatWindow.displayName = 'AssistantChatWindow';
