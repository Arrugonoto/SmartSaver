'use client';
import React, { useMemo, useState } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import FormButton from '../buttons/FormButton';
import { useFormState } from 'react-dom';
import { createUser } from '@/lib/actions';

interface FormDataType {
   name: string;
   email: string;
   password: string;
}

const LoginForm = () => {
   const [formData, setFormData] = useState<FormDataType>({
      name: '',
      email: '',
      password: '',
   });
   const initialState = { message: null, error: {} };
   // const [state, dispatch] = useFormState(createUser, initialState);

   const validateEmail = (formData: FormDataType) =>
      formData.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const isInvalid = React.useMemo(() => {
      if (!formData.email) return false;

      return validateEmail(formData) ? false : true;
      // eslint-disable-next-line
   }, [formData.email]);

   return (
      <div className="w-1/4 min-w-[20rem]">
         <form
            action={createUser}
            className="flex flex-col w-full bg-gray-900 px-4 md:px-8 py-6 rounded-lg transition-all"
         >
            <h1 className="text-2xl text-center mb-6">Sign Up</h1>
            <div className="flex flex-col w-full items-center gap-3">
               <Input
                  label="Name"
                  isRequired={!formData.name}
                  size="sm"
                  radius="sm"
                  type="text"
                  name="name"
                  onChange={e => handleChange(e)}
               />
               <Input
                  value={formData.email}
                  label="Email"
                  isInvalid={isInvalid}
                  isRequired={!formData.email}
                  size="sm"
                  radius="sm"
                  type="email"
                  name="email"
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
                  onChange={e => handleChange(e)}
               />

               <FormButton type="submit">Sign up</FormButton>
            </div>

            <p className="text-sm pt-6 pb-2 text-center">
               {`Have an account?`}
               <span className="relative text-green-400 after:content-[''] after:absolute after:w-full after:h-px after:bg-transparent after:left-0 after:-bottom-0.5 hover:after:bg-green-400 after:transition-all">
                  <Link href="/login">Log In</Link>
               </span>
            </p>
         </form>
      </div>
   );
};

export default LoginForm;
