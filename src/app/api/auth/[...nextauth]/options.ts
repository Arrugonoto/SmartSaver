import type { NextAuthOptions } from 'next-auth';
import { authConfig } from '@auth';

export const authOptions: NextAuthOptions = {
   ...authConfig,
};
