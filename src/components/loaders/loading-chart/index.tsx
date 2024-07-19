import { Skeleton } from '@nextui-org/skeleton';
import { Card, CardBody } from '@nextui-org/card';

export const LoadingChart = ({ sm }: { sm?: boolean }) => {
  const columns = sm ? 8 : 12;

  return (
    <article className="w-full h-full">
      <Card className="w-full h-full">
        <CardBody className="flex flex-row p-12 h-full w-full gap-6">
          <div className="flex">
            <Skeleton className="h-full w-10 rounded-lg" />
          </div>
          <div className="flex flex-col h-full w-full gap-4">
            <div className="flex w-full justify-center">
              <Skeleton className="h-6 w-1/5 rounded-md" />
            </div>
            <div className="flex h-full justify-between">
              {[...Array(columns)].map((el, i) => (
                <Skeleton
                  key={i}
                  className={`${sm ? 'w-8' : 'w-9'} rounded-lg`}
                />
              ))}
            </div>
            <div>
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </CardBody>
      </Card>
    </article>
  );
};
