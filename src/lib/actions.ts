'use server';
import { sql } from '@vercel/postgres';
import type { User } from '@/lib/definitions';
import { z } from 'zod';

export async function createUser(formData: FormData) {
   const rawFormData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
   };

   console.log(rawFormData);
}

export async function getUser(email: string): Promise<User | undefined> {
   try {
      const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
      return user.rows[0];
   } catch (error) {
      console.log(
         `Failed to fetch user, user with that email address doesn't exist`,
         error
      );
      throw new Error(`${error}`);
   }
}
