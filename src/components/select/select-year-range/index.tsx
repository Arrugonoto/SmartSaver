'use client';
import { useState } from 'react';
import { Select, SelectItem } from '@nextui-org/select';
import { selectIcons } from '@constants/icons';

type YearsOfData = {
  label: string;
  value: string;
};

interface PropTypes {
  yearOfData: YearsOfData[];
  selectedYear: string;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
}

export const SelectYearRange = ({
  yearOfData,
  selectedYear,
  setSelectedYear,
}: PropTypes) => {
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
      {yearOfData.map((year) => (
        <SelectItem key={year.value} value={year.value}>
          {year.label}
        </SelectItem>
      ))}
    </Select>
  );
};
