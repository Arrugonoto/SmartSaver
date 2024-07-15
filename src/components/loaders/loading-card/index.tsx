import { Skeleton } from '@nextui-org/skeleton';
import { Card } from '@nextui-org/card';

export const LoadingCard = () => {
  return (
    <article className="w-full h-[120px]">
      <Card className="p-4 gap-4">
        <div className="flex gap-4">
          <Skeleton className="h-6 rounded-lg w-full" />
          <Skeleton className="h-6 w-7 rounded-full" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </Card>
    </article>
  );
};
