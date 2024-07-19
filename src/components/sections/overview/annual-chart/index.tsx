import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { AnnualSpendingsAreaChart } from '@components/charts/annual-spendings-area-chart';

export const AnnualChartSection = () => {
  return (
    <section className="w-full h-full min-h-[50vh]">
      <Card className="w-full h-full p-4">
        <CardBody className="w-full h-full">
          <AnnualSpendingsAreaChart />
        </CardBody>
      </Card>
    </section>
  );
};
