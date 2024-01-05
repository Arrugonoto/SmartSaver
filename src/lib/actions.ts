'use server';

import { z } from 'zod';

export async function createUser(formData: FormData) {
   const rawFormData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
   };

   console.log(rawFormData);
}
