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
    <Select
      label="Select date range"
      variant="flat"
      selectedKeys={[dateRange]}
      disallowEmptySelection={true}
      size="md"
      className="max-w-[200px]"
      startContent={<selectIcons.calendarEmpty />}
      onChange={(e) => handleChange(e)}
    >
      {datesRange.map((el) => (
        <SelectItem key={el.key} value={el.value}>
          {el.name}
        </SelectItem>
      ))}
    </Select>
  );
};
