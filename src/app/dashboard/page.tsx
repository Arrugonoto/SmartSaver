import { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Overview',
};

export default function Dashboard() {
   return <main className="flex flex-1 flex-col">Dashboard Page</main>;
}
