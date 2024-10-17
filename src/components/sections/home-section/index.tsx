'use client';
import React from 'react';
import { AuroraBackground } from '@components/ui/aurora-background';
import { Button } from '@nextui-org/button';
import { TextGenerateEffect } from '@components/ui/text-generate-effect';
import Link from 'next/link';

export const HomeSection = () => {
  return (
    <section>
      <AuroraBackground>
        <div className="flex flex-col w-full gap-28 items-center justify-center">
          <div className="flex w-full justify-center">
            <TextGenerateEffect
              className="text-5xl uppercase"
              words="track analyze save"
            />
          </div>
          <div className="flex flex-col gap-10 items-center">
            <h1 className="text-4xl">
              Achieve financial freedom with Smart
              <span className="text-[#6BD39A]">Saver</span>
            </h1>
            <Link href="/signup">
              <Button
                className="w-fit bg-[#6BD39A]"
                color="success"
                variant="shadow"
                size="lg"
              >
                Start saving now
              </Button>
            </Link>
          </div>
        </div>
      </AuroraBackground>
    </section>
  );
};
