import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/options';
import { Metadata } from 'next';
import { OverviewSection } from '@components/sections/overview-section';

export const metadata: Metadata = {
  title: 'Overview',
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const user_id = session?.user.id;

  return (
    <main className="flex flex-col w-full h-full overflow-auto">
      <OverviewSection user_id={user_id} />
    </main>
  );
}
