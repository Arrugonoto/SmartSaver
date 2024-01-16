'use client';
import React, { useMemo, useState } from 'react';
import { Input } from '@nextui-org/input';
import Link from 'next/link';
import FormButton from '../buttons/FormButton';
import { createUser } from '@/lib/actions/create-user';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface FormDataType {
   name: string;
   email: string;
   password: string;
   confirmPassword: string;
}

const LoginForm = () => {
   const [formData, setFormData] = useState<FormDataType>({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
   });
   const [showPassword, setShowPassword] = useState<boolean>(false);

   const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
      <div className="w-1/4 min-w-[22rem] xl:min-w-[26rem] transition-all">
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
                  errorMessage={
                     isInvalid && 'Please enter a valid email address'
                  }
                  onChange={e => handleChange(e)}
               />
               <Input
                  label="Password"
                  isRequired={!formData.password}
                  size="sm"
                  radius="sm"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  endContent={
                     <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() => togglePasswordVisibility()}
                     >
                        {showPassword ? (
                           <FaEye className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                           <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                        )}
                     </button>
                  }
                  onChange={e => handleChange(e)}
               />
               <Input
                  label="Confirm Password"
                  isRequired={!formData.confirmPassword}
                  isInvalid={formData.password !== formData.confirmPassword}
                  size="sm"
                  radius="sm"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  errorMessage={
                     formData.password !== formData.confirmPassword &&
                     `Passwords doesn't match`
                  }
                  onChange={e => handleChange(e)}
               />

               <FormButton
                  type="submit"
                  isDisabled={formData.password !== formData.confirmPassword}
               >
                  Sign up
               </FormButton>
            </div>

            <p className="text-sm pt-6 pb-2 text-center">
               {`Have an account? `}
               <span className="relative text-green-400 after:content-[''] after:absolute after:w-full after:h-px after:bg-transparent after:left-0 after:-bottom-0.5 hover:after:bg-green-400 after:transition-all">
                  <Link href="/login">Log In</Link>
               </span>
            </p>
         </form>
      </div>
   );
};

export default LoginForm;
