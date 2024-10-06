'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@constants/routes';
import { Tooltip } from '@nextui-org/react';
import { useMobileMenuConext } from '@context/MobileMenuContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowSize } from '@lib/hooks/useWindowSize';

export const MobileMenu = () => {
  const pathname = usePathname();
  const { showMobileMenu, setShowMobileMenu } = useMobileMenuConext();
  const { width } = useWindowSize();

  useEffect(() => {
    if (width! >= 640) {
      setShowMobileMenu(false);
    }
  }, [width, setShowMobileMenu]);

  return (
    <AnimatePresence>
      {showMobileMenu && (
        <motion.section
          key="mobile-menu"
          className={`absolute flex flex-1 flex-col rounded-r-xl h-[calc(100%-3rem)] bg-default-50 z-50  border border-slate-700/30 w-3/5 xs:w-1/2`}
          initial={{ left: '-100%' }}
          transition={{ duration: 0.3 }}
          animate={{ left: -1 }}
          exit={{ left: '-100%', transition: { duration: 0.3 } }}
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
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <route.icon /> <p>{route.name}</p>
                    </Link>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </nav>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
