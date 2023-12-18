import LoginForm from '@/components/forms/LoginForm';

export default function Login() {
   return (
      <main className="h-screen">
         <section className="flex flex-col w-full justify-center items-center h-full">
            <LoginForm />
         </section>
      </main>
   );
}
