import { Metadata } from 'next';
import { AssistantSection } from '@components/sections/assistant-section';

export const metadata: Metadata = {
  title: 'Assistant',
};

export default function Assistant() {
  return (
    <main className="flex flex-col w-full h-full px-6 py-3">
      <AssistantSection />
    </main>
  );
}
