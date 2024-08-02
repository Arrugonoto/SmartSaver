'use client';
import { useState, useEffect } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from '@nextui-org/dropdown';
import { Avatar } from '@nextui-org/avatar';
import { useSession, signOut } from 'next-auth/react';
import { userMenuIcons } from '@lib/constants/icons';
import { Switch } from '@nextui-org/switch';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export const UserMenu = () => {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleThemeChange = (isSelected: boolean) => {
    setTheme(isSelected ? 'light' : 'dark');
  };

  return (
    <section>
      <Dropdown placement="bottom-end" closeOnSelect={false}>
        <DropdownTrigger>
          <Avatar name={session?.user.name} isBordered as="button" />
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions" variant="faded">
          <DropdownSection aria-label="Profile" showDivider>
            <DropdownItem
              key="profile"
              isReadOnly
              textValue="User info"
              classNames={{
                base: ['border-none', 'px-[9px]', 'cursor-default'],
              }}
            >
              <p className="text-primary text-base font-medium">
                {session?.user.name}
              </p>
              <p className="text-xs opacity-85">{`<${session?.user.email}>`}</p>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection aria-label="Theme" showDivider>
            <DropdownItem
              key="change-theme"
              className="flex justify-between"
              endContent={
                <Switch
                  size="md"
                  startContent={<userMenuIcons.themeLight />}
                  endContent={<userMenuIcons.themeDark />}
                  isSelected={theme === 'light'}
                  onValueChange={(isSelected) => handleThemeChange(isSelected)}
                  classNames={{
                    wrapper: ['bg-secondary/[0.6]'],
                    endContent: ['text-white'],
                  }}
                />
              }
            >
              Theme
            </DropdownItem>
          </DropdownSection>

          <DropdownSection aria-label="Actions">
            <DropdownItem
              key="settings"
              closeOnSelect={true}
              textValue="Settings"
              className="p-0"
            >
              <Link
                href="/user-settings"
                className="flex gap-2 px-2 py-1.5 items-center"
              >
                <userMenuIcons.settings className="text-base" />
                <p>Settings</p>
              </Link>
            </DropdownItem>
            <DropdownItem
              key="log-out"
              startContent={<userMenuIcons.logout className="text-base" />}
              onPress={() => signOut({ callbackUrl: '/' })}
              closeOnSelect={true}
            >
              Log Out
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </section>
  );
};
