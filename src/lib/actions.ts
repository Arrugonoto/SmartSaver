'use server';
import { sql } from '@vercel/postgres';
import type { User } from '@/lib/definitions';
import { z } from 'zod';
import { hash } from 'bcrypt';

const UserFormSchema = z.object({
   name: z.string(),
   email: z.string().email(),
   password: z.string(),
});

export async function createUser(formData: FormData) {
   const validatedFields = UserFormSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
   });

   if (!validatedFields.success) {
      throw new Error(' Fill all necessary fields.');
   }

   const { name, email, password } = validatedFields.data;
   const hashedPassword = await hash(password, 11);

   try {
      const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;

      if (user.rows[0].email) {
         return new Error(`User with that email already exists`);
      }
      if (user.rows[0].name) {
         throw new Error(`User with that name already exists`);
      }
      const newUser = await sql`
            INSERT INTO users (name, email, password)
            VALUES (${name}, ${email}, ${hashedPassword}) 
         `;
   } catch (error) {
      console.log(error);
      return;
   }
}

export async function getUser(email: string): Promise<User | undefined> {
   try {
      const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;

      if (!user.rows[0]) {
         throw Error(`User with that email address doesn't exist!`);
      }
      return user.rows[0];
   } catch (error) {
      const errorMessage =
         error instanceof Error ? error.message : 'Unknown error';
      throw { error: error, message: errorMessage };
   }
}
