'use client';
import {
   Navbar,
   NavbarBrand,
   NavbarContent,
   NavbarItem,
} from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export const Header = () => {
   const { data: session } = useSession();

   return (
      <header className="sticky top-0 left-0 w-full ">
         <Navbar className="flex" isBordered shouldHideOnScroll maxWidth="full">
            <NavbarBrand>im a header</NavbarBrand>
            <NavbarContent justify="end">
               <NavbarItem>
                  <p>{session && `Hi ${session?.user?.name}`}</p>
               </NavbarItem>
               <NavbarItem>
                  {session ? (
                     <Button onPress={() => signOut({ callbackUrl: '/' })}>
                        Logout
                     </Button>
                  ) : (
                     <Link href="/login">
                        <Button>Sign In</Button>
                     </Link>
                  )}
               </NavbarItem>
            </NavbarContent>
         </Navbar>
      </header>
   );
};
