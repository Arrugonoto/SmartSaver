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
import { Tooltip } from '@nextui-org/tooltip';

export const Header = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 left-0 w-full z-[999]">
      <Navbar
        className="flex h-12 bg-default-50"
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
            <div className="flex gap-2">
              <NavbarItem>
                <Link href="/login">
                  <Button className="flex items-center px-2">
                    <btnIcons.signin className="text-base" />
                    <p>Sign In</p>
                  </Button>
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Tooltip
                  content="Toggle color theme"
                  showArrow
                  placement="bottom-end"
                >
                  <Button
                    isIconOnly={true}
                    onPress={() => {
                      if (!theme) {
                        setTheme('light');
                      }
                      if (theme) {
                        setTheme(theme === 'dark' ? 'light' : 'dark');
                      }
                    }}
                    className="text-lg bg-transparent"
                  >
                    {theme === 'light' ? (
                      <btnIcons.lightMode />
                    ) : (
                      <btnIcons.darkMode />
                    )}
                  </Button>
                </Tooltip>
              </NavbarItem>
            </div>
          )}
        </NavbarContent>
      </Navbar>
    </header>
  );
};
