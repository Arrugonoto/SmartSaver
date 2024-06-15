'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { asistantIcons } from '@lib/constants/icons';
import { Button } from '@nextui-org/button';

export const AssistantModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <motion.div
      initial={{
        right: '30px',
        bottom: '30px',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
      }}
      animate={{
        maxWidth: isOpen ? '380px' : '50px',
        maxHeight: isOpen ? '500px' : '50px',
        borderRadius: isOpen ? '6px' : '50%',
      }}
      transition={{ duration: 0.4 }}
      className={`absolute right-[30px] bottom-[30px] w-[50px] h-[50px] bg-content1 shadow-medium z-[999]`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full overflow-hidden">
        <Button
          className="p-0 w-full h-full bg-blue-400 rounded-full"
          isIconOnly
          onPress={() => setIsOpen(!isOpen)}
        >
          <asistantIcons.message className="w-6 h-6" />
        </Button>
      </div>
    </motion.div>
  );
};
