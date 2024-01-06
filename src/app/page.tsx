import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export default async function Home() {
   const session = await getServerSession(authOptions);

   if (session) {
      redirect('/dashboard');
   }

   return (
      <main className="flex min-h-screen flex-col items-center">
         <div className="flex flex-col w-full items-center pt-20">
            <section className="container bg-violet-700">Hello</section>
            <section className="container">There</section>
            <section className="container">General</section>
            <section className="container">Kenobi!</section>
         </div>
      </main>
   );
}
