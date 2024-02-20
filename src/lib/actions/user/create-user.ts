'use server';
import { sql } from '@vercel/postgres';
import type { User } from '@lib/definitions';
import { z } from 'zod';
import { hash } from 'bcrypt';

const UserFormSchema = z.object({
   name: z.string(),
   email: z.string().email(),
   password: z.string(),
});

export async function createUser(formData: {
   name: string;
   email: string;
   password: string;
}) {
   const validatedFields = UserFormSchema.safeParse({
      name: formData.name,
      email: formData.email,
      password: formData.password,
   });

   if (!validatedFields.success) {
      throw new Error(' Fill all necessary fields.');
   }

   const { name, email, password } = validatedFields.data;
   const timeOfCreation = new Date().toISOString();

   try {
      const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;

      if (user.rows[0] && user.rows[0].email === email) {
         throw new Error(`User with that email address already exists`);
      }
      const hashedPassword = await hash(password, 11);
      const createNewUser = await sql`
            INSERT INTO users (name, email, password, created_At)
            VALUES (${name}, ${email}, ${hashedPassword}, ${timeOfCreation} ) 
         `;
   } catch (error) {
      const errorMessage = error instanceof Error && error.message;
      console.log(error);
      return { error: error, message: errorMessage };
   }
}
