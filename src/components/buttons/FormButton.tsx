'use client';
import { Button } from '@nextui-org/button';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   children: React.ReactNode;
   onPress?: () => void;
}

const FormButton = ({ children, className, type, onPress }: ButtonProps) => {
   return (
      <Button
         radius="full"
         type={type ?? 'button'}
         className={`w-full ${className}`}
         onPress={() => onPress && onPress()}
      >
         {children}
      </Button>
   );
};

export default FormButton;
