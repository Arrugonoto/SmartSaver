import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/options';
import { HomeSection } from '@components/sections/home-section';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="flex w-full flex-col items-center ">
      <div className="flex flex-col w-full">
        <HomeSection />
      </div>
    </main>
  );
}
