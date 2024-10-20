'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useAnimate, AnimatePresence } from 'framer-motion';
import { asistantIcons } from '@lib/constants/icons';
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/react';
import { Divider } from '@nextui-org/divider';
import { AssistantForm } from '@components/forms/assistant-form';
import { AssistantChatWindow } from '@components/assistant/assistant-chat-window';
import type { Message } from '@lib/constants/types/message/message';

export const AssistantModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>('');
  const [initialBtnRender, setInitialBtnRender] = useState<boolean>(true);
  const [scope, animate] = useAnimate();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const handleAnimate = async () => {
    if (!isOpen) {
      await animate(
        scope.current,
        { maxHeight: '500px', borderRadius: '6px' },
        { duration: 0.3 }
      );
      await animate(scope.current, { maxWidth: '380px' }, { duration: 0.3 });
    } else {
      await animate(
        scope.current,
        { maxWidth: '50px' },
        { duration: 0.3, delay: 0.3 }
      );
      await animate(scope.current, { maxHeight: '50px' }, { duration: 0.3 });
      await animate(scope.current, { borderRadius: '50%' }, { duration: 0.2 });
    }
  };

  const handleClick = async () => {
    if (!isOpen) {
      setMessages([]);
    }

    setIsOpen(!isOpen);
    await handleAnimate();
  };

  useEffect(() => {
    setInitialBtnRender(false);
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <section
      ref={scope}
      className={`absolute right-[30px] bottom-[60px] max-w-[50px] max-h-[50px] w-full h-full bg-content2 shadow-medium rounded-full z-[999]`}
    >
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="btn-open"
            id="btn-open"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: initialBtnRender ? 0 : 0.3,
                delay: initialBtnRender ? 0 : 1.1,
              },
            }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <Tooltip content="Ask assistant">
              <Button
                className="p-0 w-full h-full bg-transparent rounded-full"
                isIconOnly
                onPress={() => handleClick()}
              >
                <asistantIcons.message className="text-[1.6rem]" />
              </Button>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col w-full h-full p-2 gap-2 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="flex justify-between">
              <div>
                <asistantIcons.assistant className="text-[1.4rem]" />
              </div>
              <Tooltip content="Close chat">
                <Button
                  isIconOnly
                  className="p-0 w-auto h-auto bg-transparent items-center justify-center"
                  onPress={() => handleClick()}
                >
                  <asistantIcons.minimize className="text-[1.2rem]" />
                </Button>
              </Tooltip>
            </div>
            <Divider />
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
