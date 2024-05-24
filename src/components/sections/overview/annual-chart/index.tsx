import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { AnnualSpendingsAreaChart } from '@components/charts/annual-spendings-area-chart';

export const AnnualChartSection = () => {
  return (
    <section>
      <Card className="w-full p-4">
        <CardBody>
          <AnnualSpendingsAreaChart />
        </CardBody>
      </Card>
    </section>
  );
};
