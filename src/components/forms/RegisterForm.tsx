'use client';
import { useState } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import Link from 'next/link';

import React from 'react';

type formDataTypes = {
   name: string;
   email: string;
   password: string;
};

const LoginForm = () => {
   const [formData, setFormData] = useState<formDataTypes>({
      name: '',
      email: '',
      password: '',
   });

   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   return (
      <div className="w-1/4 min-w-[20rem]">
         <form className="flex flex-col w-full bg-gray-900 px-4 md:px-8 py-6 rounded-lg transition-all">
            <h1 className="text-2xl text-center mb-6">Sign Up</h1>
            <div className="flex flex-col w-full gap-3">
               <Input
                  label="Name"
                  required
                  size="sm"
                  radius="sm"
                  type="text"
                  name="name"
                  value={formData.email}
                  onChange={e => handleFormChange(e)}
               />
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
               <Button radius="full">Sign up</Button>
            </div>

            <p className="text-sm pt-6 pb-2 text-center">
               {`Have an account?`}{' '}
               <span className="relative text-green-400 after:content-[''] after:absolute after:w-full after:h-px after:bg-transparent after:left-0 after:-bottom-0.5 hover:after:bg-green-400 after:transition-all">
                  <Link href="/login">Log In</Link>
               </span>
            </p>
         </form>
      </div>
   );
};

export default LoginForm;
