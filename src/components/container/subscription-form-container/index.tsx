'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@nextui-org/input';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Divider } from '@nextui-org/divider';
import { SubscriptionModal } from '@components/modals/subscription-modal';
import { BRANDS_LIST } from '@lib/constants/data/dummy/example-subscriptions';
import { btnIcons } from '@lib/constants/icons';
import type { BrandInfo } from '@lib/constants/data/dummy/example-subscriptions';
import { SubscriptionForm } from '@components/forms/subscription-form';

export const SubscriptionFormContainer = () => {
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [filteredBrands, setFilteredBrands] =
    useState<BrandInfo[]>(BRANDS_LIST);

  useEffect(() => {
    const searchedBrands = BRANDS_LIST.filter((brand) =>
      brand.name.toLowerCase().includes(searchPhrase)
    );

    setFilteredBrands(searchedBrands);
  }, [searchPhrase]);

  return (
    <div className="h-full w-full">
      <Accordion variant="light" className="bg-content2 rounded-md">
        <AccordionItem
          key="expense-subscription"
          aria-label="Accordion subscription form"
          title="Fill form or select from list"
          classNames={{
            title: ['text-base', 'font-light'],
            trigger: ['py-2'],
          }}
        >
          <SubscriptionForm />
        </AccordionItem>
      </Accordion>
      <Divider className="my-8" />
      <div className="flex flex-col gap-3">
        <h3 className="text-center">Popular subscriptions</h3>
        <Input
          type="text"
          variant="flat"
          startContent={<btnIcons.search />}
          className="mb-4"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          {filteredBrands.map((brand) => {
            return (
              <SubscriptionModal
                key={brand.name}
                brandName={brand.name}
                brandIcon={brand.icon}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
