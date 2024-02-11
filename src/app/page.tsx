import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/options';

export default async function Home() {
   const session = await getServerSession(authOptions);

   if (session) {
      redirect('/dashboard');
   }

   return (
      <main className="flex flex-1 w-full flex-col items-center">
         <div className="flex flex-col flex-1 w-full items-center justify-center pt-20 ">
            <section className="container bg-violet-700">
               <p>Main page, hero section</p>
            </section>
         </div>
      </main>
   );
}
