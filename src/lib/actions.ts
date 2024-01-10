'use server';
import { z } from 'zod';
import { signIn } from 'next-auth/react';

export async function createUser(formData: FormData) {
   const rawFormData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
   };

   console.log(rawFormData);
}

export async function authenticate(
   prevState: string | undefined,
   formData: FormData
) {
   try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(formData),
      });

      console.log(formData);

      if (res.ok) {
         return 'Success';
      }
   } catch (error) {
      console.error('Error during sign-in:', error);
      throw error;
   }
}
