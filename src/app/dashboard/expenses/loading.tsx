import { Skeleton } from '@nextui-org/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col w-full gap-4 py-4">
      <Skeleton className="w-full h-12 rounded-lg" />
      <Skeleton className="w-full h-[20rem] rounded-lg" />
    </div>
  );
}
