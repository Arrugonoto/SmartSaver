'use client';
import { Select, SelectItem } from '@nextui-org/select';
import { selectIcons } from '@constants/icons';

type DateRange = {
  key: string;
  name: string;
  value: string;
};

const datesRange: DateRange[] = [
  { key: 'current_month', name: 'Current month', value: 'current_month' },
  { key: 'last_month', name: 'Last month', value: 'last_month' },
  {
    key: 'last_three_months',
    name: 'Last 3 months',
    value: 'last_three_months',
  },
  { key: 'last_six_months', name: 'Last 6 months', value: 'last_six_months' },
  { key: 'last_year', name: 'Last 12 months', value: 'last_year' },
];

export const MonthRangeSelect = ({
  dateRange,
  setDateRange,
}: {
  dateRange: string;
  setDateRange: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value);
  };

  return (
    <div className="flex w-full">
      <Select
        label="Select date range"
        variant="bordered"
        selectedKeys={[dateRange]}
        disallowEmptySelection={true}
        size="md"
        className="min-w-[200px] w-auto"
        startContent={<selectIcons.calendarEmpty />}
        onChange={(e) => handleChange(e)}
      >
        {datesRange.map((el) => (
          <SelectItem key={el.key} value={el.value}>
            {el.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
