import { Skeleton } from '@nextui-org/skeleton';
import { Card, CardBody } from '@nextui-org/card';

export const LoadingPlainCard = () => {
  return (
    <article className="w-full h-[360px]">
      <Card className="h-full">
        <CardBody className="p-2 h-full">
          <Skeleton className="w-full h-full rounded-lg " />
        </CardBody>
      </Card>
    </article>
  );
};
