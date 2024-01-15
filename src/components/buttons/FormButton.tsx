'use client';
import { Button } from '@nextui-org/button';
import { useFormStatus } from 'react-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   children: React.ReactNode;
   onPress?: () => void;
   isDisabled?: boolean;
}

const FormButton = ({
   children,
   className,
   type,
   onPress,
   isDisabled,
}: ButtonProps) => {
   const { pending } = useFormStatus();

   return (
      <Button
         radius="full"
         type={type ?? 'button'}
         className={`w-full ${className}`}
         onPress={() => onPress && onPress()}
         isDisabled={isDisabled || pending}
      >
         {children}
      </Button>
   );
};

export default FormButton;
