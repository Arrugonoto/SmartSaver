import RegisterForm from '@/components/forms/RegisterForm';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Signup() {
   const session = await getServerSession(authOptions);

   if (session) {
      redirect('/dashboard');
   }

   return (
      <main className="h-screen">
         <section className="flex flex-col w-full justify-center items-center h-full">
            <RegisterForm />
         </section>
      </main>
   );
}
