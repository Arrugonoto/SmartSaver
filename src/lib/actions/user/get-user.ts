'use server';
import { sql } from '@vercel/postgres';
import type { User } from '@lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function getUser(email: string): Promise<User | undefined> {
  noStore();

  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;

    if (!user.rows[0]) {
      throw Error(`Account with that email address doesn't exist!`);
    }
    return user.rows[0];
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw { error: error, message: errorMessage };
  }
}
