import React, { useContext, createContext, useState, ReactNode } from 'react';

type MessageType = {
  id: string;
  text: string;
  role: 'user' | 'assistant';
};

interface AssistantChatType {
  conversationId: string | null;
  messages: MessageType[];
}

interface ContextType {
  chatHistory: AssistantChatType;
  setChatHistory: React.Dispatch<React.SetStateAction<AssistantChatType>>;
  resetChat: () => void;
}

const initialState: AssistantChatType = {
  conversationId: null,
  messages: [],
};

const AssistantChatContext = createContext<ContextType>({
  chatHistory: initialState,
  setChatHistory: () => {},
  resetChat: () => {},
});

export const useAssistantChatConext = () => {
  const context = useContext(AssistantChatContext);

  if (!context) {
    throw new Error(
      'useAssistantChatConext must be used within an AssistantChatContextProvider',
    );
  }

  return context;
};

export const AssistantChatContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [chatHistory, setChatHistory] = useState<AssistantChatType>({
    conversationId: null,
    messages: [],
  });

  const resetChat = () => setChatHistory(initialState);

  return (
    <AssistantChatContext.Provider
      value={{ chatHistory, setChatHistory, resetChat }}
    >
      {children}
    </AssistantChatContext.Provider>
  );
};
