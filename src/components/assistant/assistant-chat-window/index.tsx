'use client';
import React, { forwardRef, useEffect } from 'react';
import { capitalizeString } from '@lib/helpers/capitalize';
import { LoaderDots } from '@components/loaders/loader-dots';
import { asistantIcons } from '@lib/constants/icons';
import { useAssistantChatConext } from '@context/AsssistantChatContext';

type ChatWindowTypes = {
  loading: boolean;
  userMessage: string;
};

export const AssistantChatWindow = forwardRef(
  (
    { loading, userMessage }: ChatWindowTypes,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const { chatHistory, resetChat } = useAssistantChatConext();

    useEffect(() => {
      resetChat();
    }, []); // eslint-disable-line

    return (
      <div
        ref={ref}
        className="flex flex-col gap-4 scroll-smooth py-2 pl-2 pr-4"
      >
        <div className="flex relative gap-2 bg-content3 p-2 pl-3 rounded-md max-w-[80%] overflow-hidden">
          <span className="absolute left-0 top-0 w-1 h-full bg-primary" />
          <span>
            <asistantIcons.assistant className="text-[1rem]" />
          </span>
          <p className="text-sm">{`Hi. I'm Your personal Assistant. Sometimes I can make mistakes. Remember, it is always best to contact an experienced professional.`}</p>
        </div>
        {chatHistory.messages.map((message, index, array) => (
          <div
            key={message.id}
            className={` ${
              message.role === 'user' && 'self-end pr-3'
            }relative max-w-[80%]`}
          >
            {message.role !== 'user' &&
              (!array[index - 1] || message.role !== array[index - 1].role) && (
                <p>{capitalizeString(message.role)}</p>
              )}

            <p
              className={` ${
                message.role === 'user'
                  ? 'bg-content1'
                  : 'relative bg-content3 overflow-hidden pl-3'
              }  p-2 rounded-lg text-sm
      `}
            >
              {message.role !== 'user' && (
                <span className="absolute left-0 top-0 w-1 h-full bg-primary" />
              )}
              {message.text}
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
  },
);

AssistantChatWindow.displayName = 'AssistantChatWindow';
