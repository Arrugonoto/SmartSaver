import { Skeleton } from '@nextui-org/skeleton';
import { Card } from '@nextui-org/card';

export const LoadingTable = () => {
  return (
    <article className="w-full">
      <Card className="p-4 h-full gap-6">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-1/4 rounded-md" />
          <Skeleton className="h-10 w-1/4 rounded-md" />
        </div>
        <Skeleton className="h-16 rounded-md" />
        <div className="flex flex-col h-full justify-between">
          {[...Array(10)].map((el, i) => (
            <Skeleton key={i} className="h-8 rounded-md" />
          ))}
        </div>
      </Card>
    </article>
  );
};
