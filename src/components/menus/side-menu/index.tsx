'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@constants/routes';
import { Tooltip } from '@nextui-org/react';
import { useTheme } from 'next-themes';

export const SideMenu = () => {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <section
      className={`hidden sm:flex flex-col rounded-lg my-3 ml-2 ${
        theme === 'dark' ? 'bg-[#18181b]' : 'bg-[#f0f0f0]'
      }`}
    >
      <nav className="p-2">
        <ul className="flex flex-col gap-2">
          {ROUTES.map((route) => (
            <li key={route.name}>
              <Tooltip
                content={`${route.name}`}
                placement="right-start"
                showArrow={true}
              >
                <Link
                  href={route.path}
                  className={`flex p-2 rounded-md hover:bg-gray-600/50 items-center gap-2 transition-all ${
                    pathname.includes(route.path) ? 'bg-primary' : ''
                  }`}
                >
                  <route.icon /> <p className="hidden lg:block">{route.name}</p>
                </Link>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};
