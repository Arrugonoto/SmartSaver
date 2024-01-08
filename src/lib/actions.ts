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
      await signIn('credentials', Object.fromEntries(formData));
   } catch (error) {
      if ((error as Error).message.includes('CredentialsSignin')) {
         return 'CredentialsSignin';
      }
      throw error;
   }
}
