'use client';
import { Button } from '@nextui-org/button';

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
   return (
      <Button
         radius="full"
         type={type ?? 'button'}
         className={`w-full ${className}`}
         onPress={() => onPress && onPress()}
         isDisabled={isDisabled}
      >
         {children}
      </Button>
   );
};

export default FormButton;
