'use server';
import { sql } from '@vercel/postgres';
import type { User } from '@lib/definitions';
import { z } from 'zod';
import { hash } from 'bcrypt';

const UserFormSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Name must be at least 4 characters long' }),
  email: z.string().email(),
  password: z
    .string()
    .min(12, { message: 'Password must be at least 12 characters long' }),
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

  try {
    if (!validatedFields.success) {
      const errorMessage = validatedFields.error.issues
        .map((issue) => issue.message)
        .join(', ');

      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('Fill all necessary fields.');
      } else {
        throw new Error(errorMessage);
      }
    }

    const { name, email, password } = validatedFields.data;
    const timeOfCreation = new Date().toISOString();

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
