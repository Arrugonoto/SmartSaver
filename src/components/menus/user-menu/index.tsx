'use client';
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

export const UserMenu = () => {
  const { data: session } = useSession();

  return (
    <section>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar name={session?.user.name} isBordered as="button" />
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions" variant="faded">
          <DropdownSection aria-label="Profile" showDivider>
            <DropdownItem
              key="profile"
              isReadOnly
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
          <DropdownSection aria-label="Actions">
            <DropdownItem
              key="settings"
              startContent={<userMenuIcons.settings className="text-base" />}
              href="/user-settings"
            >
              Settings
            </DropdownItem>
            <DropdownItem
              key="log-out"
              startContent={<userMenuIcons.logout className="text-base" />}
              onPress={() => signOut({ callbackUrl: '/' })}
            >
              Log Out
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </section>
  );
};
