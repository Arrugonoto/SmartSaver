import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/options';
import { Metadata } from 'next';
import { UserSettingsSection } from '@components/sections/settings-section';
import type { Session } from 'next-auth';

export const metadata: Metadata = {
  title: 'User settings',
};

export default async function UserSettings() {
  const userSession = await getServerSession(authOptions);

  return (
    <main className="flex relative flex-col w-full h-full overflow-auto px-4 py-3 rounded-md">
      <UserSettingsSection userSession={userSession as Session} />
    </main>
  );
}
