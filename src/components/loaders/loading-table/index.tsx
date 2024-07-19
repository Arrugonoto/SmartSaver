import { Skeleton } from '@nextui-org/skeleton';
import { Card, CardBody } from '@nextui-org/card';

export const LoadingTable = ({ sm }: { sm?: boolean }) => {
  const rows = sm ? 5 : 10;

  return (
    <article className="w-full h-full">
      <Card className="w-full h-full">
        <CardBody className="p-4 h-full gap-6">
          <div className="flex justify-between">
            <Skeleton className={`${sm ? 'h-6' : 'h-10'}  w-1/4 rounded-md`} />
            <Skeleton className={`${sm ? 'h-6' : 'h-10'}  w-1/4 rounded-md`} />
          </div>
          <Skeleton className="h-16 rounded-md" />
          <div className="flex flex-col h-full justify-between overflow-y-scroll gap-4">
            {[...Array(rows)].map((el, i) => (
              <Skeleton
                key={i}
                className={` ${sm ? 'h-6' : 'h-8'}  rounded-md`}
              />
            ))}
          </div>
        </CardBody>
      </Card>
    </article>
  );
};
