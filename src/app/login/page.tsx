'use client';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { signIn } from 'next-auth/react';

export default function Login() {
   return (
      <main className="h-screen">
         <section className="flex flex-col w-full justify-center items-center h-full">
            <div className="w-1/4 min-w-[20rem]">
               <form className="flex flex-col w-full bg-gray-900 px-8 py-6 rounded-lg">
                  <h1 className="text-2xl text-center mb-6">Sign In</h1>
                  <div className="flex flex-col w-full gap-3">
                     <Input />
                     <Input />
                     <Button>Login</Button>
                  </div>
                  <div className="relative h-1 mt-8 mb-6 bg-black">
                     <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 px-3">
                        OR
                     </p>
                  </div>
                  <div className="flex flex-col w-full gap-3">
                     <h2 className="w-full text-center text-md">
                        Continue with
                     </h2>
                     <Button onPress={() => signIn('github')}>GitHub</Button>

                     <Button onPress={() => signIn('google')}>Google</Button>
                  </div>
                  <p className="text-sm pt-6 pb-2 text-center">{`Don't have an account? Create one!`}</p>
               </form>
            </div>
         </section>
      </main>
   );
}
