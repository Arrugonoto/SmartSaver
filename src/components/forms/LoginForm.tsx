'use client';
import React, { useMemo } from 'react';
import { useState } from 'react';
import { Input } from '@nextui-org/input';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import FormButton from '@/components/buttons/FormButton';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';

type FormDataType = {
   email: string;
   password: string;
};

const LoginForm = () => {
   const [formData, setFormData] = useState<FormDataType>({
      email: '',
      password: '',
   });
   const [state, dispatch] = useFormState(authenticate, undefined);
   const { pending } = useFormStatus();

   const validateEmail = (formData: FormDataType) =>
      formData.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const isInvalid = useMemo(() => {
      if (!formData.email) return false;

      return validateEmail(formData) ? false : true;
      // eslint-disable-next-line
   }, [formData.email]);

   return (
      <div className="w-1/4 min-w-[20rem]">
         <form
            action={dispatch}
            className="flex flex-col w-full bg-gray-900 px-4 md:px-8 py-6 rounded-lg transition-all"
         >
            <h1 className="text-2xl text-center mb-6">Sign In</h1>
            <div className="flex flex-col w-full items-center gap-3">
               <Input
                  label="Email"
                  isInvalid={isInvalid}
                  isRequired={!formData.email}
                  size="sm"
                  radius="sm"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={e => handleChange(e)}
                  errorMessage={
                     isInvalid && 'Please enter a valid email address'
                  }
               />
               <Input
                  label="Password"
                  isRequired={!formData.password}
                  size="sm"
                  radius="sm"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={e => handleChange(e)}
               />
               <FormButton type="submit" isDisabled={pending}>
                  Login
               </FormButton>
            </div>
            <div className="relative h-0.5 mt-8 mb-6 bg-black">
               <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 px-3">
                  OR
               </p>
            </div>
            <div className="flex flex-col w-full items-center gap-3">
               <h2 className="w-full text-center text-md">Continue with</h2>
               <FormButton
                  onPress={() =>
                     signIn('github', { callbackUrl: '/dashboard' })
                  }
                  isDisabled={pending}
               >
                  GitHub
               </FormButton>
               <FormButton
                  onPress={() =>
                     signIn('google', { callbackUrl: '/dashboard' })
                  }
                  isDisabled={pending}
               >
                  Google
               </FormButton>
            </div>
            <p className="text-sm pt-6 pb-2 text-center">
               {`Don't have an account? `}
               <span className="relative text-green-400 after:content-[''] after:absolute after:w-full after:h-px after:bg-transparent after:left-0 after:-bottom-0.5 hover:after:bg-green-400 after:transition-all">
                  <Link href="/signup">Create Now</Link>
               </span>
            </p>
         </form>
      </div>
   );
};

export default LoginForm;
