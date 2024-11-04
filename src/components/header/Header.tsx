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
import { btnIcons, menuIcons } from '@lib/constants/icons';
import { useTheme } from 'next-themes';
import { Tooltip } from '@nextui-org/tooltip';
import Image from 'next/image';
import { useMobileMenuConext } from '@context/MobileMenuContext';

export const Header = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { showMobileMenu, setShowMobileMenu } = useMobileMenuConext();

  return (
    <Navbar
      isBordered
      shouldHideOnScroll
      maxWidth="full"
      className="flex min-h-12 h-12 bg-default-50 overflow-hidden gap-0"
      classNames={{
        wrapper: ['gap-2'],
      }}
    >
      {session && (
        <NavbarItem className="sm:hidden">
          <Button
            isIconOnly
            className={`bg-transparent ${
              theme === 'dark' ? 'hover:bg-gray-200/20' : 'hover:bg-gray-400/40'
            } `}
            onPress={() => {
              setShowMobileMenu((prev) => !prev);
            }}
          >
            <menuIcons.menu className="text-2xl" />
          </Button>
        </NavbarItem>
      )}

      <NavbarBrand className=" overflow-hidden">
        <Link href="/">
          <Image
            src="/images/logo-alternative.svg"
            alt="App logo"
            width={44}
            height={44}
            className="object-cover"
          />
        </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem className="hidden xs:list-item">
          <p>{session && `Hi ${session?.user?.name}`}</p>
        </NavbarItem>

        {session ? (
          <NavbarItem>
            <UserMenu />
          </NavbarItem>
        ) : (
          <div className="flex gap-2 items-center">
            <NavbarItem>
              <Link href="/login">
                <Button
                  size="sm"
                  className="flex items-center px-2 text-sm"
                  startContent={<btnIcons.signin className="text-base" />}
                >
                  <p>Sign In</p>
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/signup">
                <Button
                  size="sm"
                  variant="light"
                  className="flex items-center px-2 text-sm"
                >
                  <p>Sign Up</p>
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Tooltip
                content="Toggle color mode"
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
  );
};
