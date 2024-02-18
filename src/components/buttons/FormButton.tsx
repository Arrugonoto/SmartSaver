'use client';
import { Button } from '@nextui-org/button';
import { useFormStatus } from 'react-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   children: React.ReactNode;
   onPress?: () => void;
   isDisabled?: boolean;
   color?:
      | 'default'
      | 'primary'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'danger'
      | undefined;
}

const FormButton = ({
   children,
   className,
   type,
   onPress,
   isDisabled,
   color,
}: ButtonProps) => {
   const { pending } = useFormStatus();

   return (
      <Button
         radius="full"
         type={type ?? 'button'}
         className={`w-full ${className}`}
         onPress={() => onPress && onPress()}
         isDisabled={isDisabled || pending}
         color={color}
      >
         {children}
      </Button>
   );
};

export default FormButton;
