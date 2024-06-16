'use client';
import { useState } from 'react';
import { Select, SelectItem } from '@nextui-org/select';
import { selectIcons } from '@constants/icons';

type YearsOfData = {
  label: string;
  value: string;
};

type PropTypes = {
  yearsOfData: YearsOfData[];
};

const currentYear = new Date().getFullYear().toString();

export const SelectYearRange = ({ yearsOfData }: PropTypes) => {
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  return (
    <Select
      label="Select year"
      className="max-w-[200px]"
      disallowEmptySelection={true}
      startContent={<selectIcons.calendar />}
      selectedKeys={[`${selectedYear}`]}
      onChange={(e) => handleChange(e)}
      variant="bordered"
      size="sm"
      radius="md"
      classNames={{ label: 'pb-1' }}
    >
      {yearsOfData.map((year) => (
        <SelectItem key={year.value} value={year.value}>
          {year.label}
        </SelectItem>
      ))}
    </Select>
  );
};
