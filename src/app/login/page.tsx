import LoginForm from '@/components/forms/LoginForm';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export default async function Login() {
   const session = await getServerSession(authOptions);

   if (session) {
      redirect('/dashboard');
   }

   return (
      <main className="h-screen">
         <section className="flex flex-col w-full justify-center items-center h-full">
            <LoginForm />
         </section>
      </main>
   );
}
