'use server';
import { sql } from '@vercel/postgres';
import { compare } from 'bcrypt';
import { getUser } from '@lib/actions/user/get-user';

export async function updateName(formData: {
  newUsername: string;
  password: string;
  email: string;
}) {
  const { newUsername, password, email } = formData;
  const user = await getUser(email);

  if (!user) return { error: `User not found`, message: 'User not found!' };

  const passwordsMatch = await compare(password, user.password);

  if (passwordsMatch) {
    const updateUsername = await sql`
       UPDATE users
       SET name=${newUsername}
       WHERE email=${email}
    `;
    return { message: `Succesfully changed name to: ${newUsername}` };
  } else {
    return { error: `Incorrect password`, message: 'Incorrect password!' };
  }
}

export async function updatePassword(formData: {
  newPassword: string;
  password: string;
  email: string;
}) {
  const { newPassword, password, email } = formData;
  const user = await getUser(email);

  if (!user) return { error: `User not found`, message: 'User not found!' };

  const passwordsMatch = await compare(password, user.password);

  if (passwordsMatch) {
    const changePassword = await sql`
           UPDATE users
           SET password=${newPassword}
           WHERE email=${email}
        `;
    return { message: 'Password succesfully changed' };
  } else {
    return { error: `Incorrect password`, message: 'Incorrect password!' };
  }
}
