'use client';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserMenu } from '@components/menus/user-menu';
import { btnIcons } from '@lib/constants/icons';
import { useTheme } from 'next-themes';

export const Header = () => {
  const { data: session } = useSession();
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 left-0 w-full z-[999]">
      <Navbar
        className={`flex h-12 ${
          theme === 'dark' ? 'bg-[#18181b]' : 'bg-[#f0f0f0]'
        }`}
        isBordered
        shouldHideOnScroll
        maxWidth="full"
      >
        <NavbarBrand>im a header</NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <p>{session && `Hi ${session?.user?.name}`}</p>
          </NavbarItem>

          {session ? (
            <NavbarItem>
              <UserMenu />
            </NavbarItem>
          ) : (
            <NavbarItem>
              <Link href="/login">
                <Button className="flex items-center px-2">
                  <btnIcons.signin className="text-base" />
                  <p>Sign In</p>
                </Button>
              </Link>
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>
    </header>
  );
};
