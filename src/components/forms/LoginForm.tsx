'use client';
import React from 'react';
import { useState } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import FormButton from '@/components/buttons/FormButton';

type formDataTypes = {
   email: string;
   password: string;
};

const LoginForm = () => {
   const [formData, setFormData] = useState<formDataTypes>({
      email: '',
      password: '',
   });

   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   return (
      <div className="w-1/4 min-w-[20rem]">
         <form className="flex flex-col w-full bg-gray-900 px-4 md:px-8 py-6 rounded-lg transition-all">
            <h1 className="text-2xl text-center mb-6">Sign In</h1>
            <div className="flex flex-col w-full items-center gap-3">
               <Input
                  label="Email"
                  required
                  size="sm"
                  radius="sm"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={e => handleFormChange(e)}
               />
               <Input
                  label="Password"
                  required
                  size="sm"
                  radius="sm"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={e => handleFormChange(e)}
               />
               <FormButton type="submit">Login</FormButton>
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
               >
                  GitHub
               </FormButton>
               <FormButton
                  onPress={() =>
                     signIn('google', { callbackUrl: '/dashboard' })
                  }
               >
                  Google
               </FormButton>
            </div>
            <p className="text-sm pt-6 pb-2 text-center">
               {`Don't have an account?`}{' '}
               <span className="relative text-green-400 after:content-[''] after:absolute after:w-full after:h-px after:bg-transparent after:left-0 after:-bottom-0.5 hover:after:bg-green-400 after:transition-all">
                  <Link href="/signup">Create Now</Link>
               </span>
            </p>
         </form>
      </div>
   );
};

export default LoginForm;
