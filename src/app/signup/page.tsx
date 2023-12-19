import RegisterForm from '@/components/forms/RegisterForm';

export default function Signup() {
   return (
      <main className="h-screen">
         <section className="flex flex-col w-full justify-center items-center h-full">
            <RegisterForm />
         </section>
      </main>
   );
}
