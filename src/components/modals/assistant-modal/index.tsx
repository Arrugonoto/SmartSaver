'use client';
import { useState } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { asistantIcons } from '@lib/constants/icons';
import { Button } from '@nextui-org/button';

export const AssistantModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scope, animate] = useAnimate();

  const handleAnimate = async () => {
    if (!isOpen) {
      await animate(
        scope.current,
        { maxHeight: '500px', borderRadius: '6px' },
        { duration: 0.3 }
      );
      await animate(scope.current, { maxWidth: '380px' }, { duration: 0.3 });
    } else {
      await animate(scope.current, { maxWidth: '50px' }, { duration: 0.3 });
      await animate(
        scope.current,
        { maxHeight: '50px', borderRadius: '50%' },
        { duration: 0.3 }
      );
    }
  };

  return (
    <motion.section
      ref={scope}
      className={`absolute right-[30px] bottom-[30px] max-w-[50px] max-h-[50px] w-full h-full bg-content1 shadow-medium rounded-full z-[999]`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full overflow-hidden">
        <Button
          className="p-0 w-full h-full bg-transparent rounded-full"
          isIconOnly
          onPress={() => {
            handleAnimate();
            setIsOpen(!isOpen);
          }}
        >
          <asistantIcons.message className="w-6 h-6" />
        </Button>
      </div>
    </motion.section>
  );
};
