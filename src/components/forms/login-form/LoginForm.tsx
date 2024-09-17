'use client';
import React, { useMemo, useEffect } from 'react';
import { useState } from 'react';
import { Input } from '@nextui-org/input';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import FormButton from '@components/buttons/FormButton';
import { useRouter } from 'next/navigation';
import { pushNotification } from '@lib/helpers/push-notification';
import { useTheme } from 'next-themes';
import { brandIcons } from '@lib/constants/icons';
import { LoadingPlainCard } from '@components/loaders/loading-plain-card';

type FormDataType = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<FormDataType>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<any>(null);
  const [pending, setPending] = useState<boolean>(false);
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);

  const validateEmail = (formData: FormDataType) =>
    formData.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const res = await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    if (!res?.ok) {
      if (res?.error?.includes('CredentialsSignin')) {
        setError('Invalid password');
      } else {
        setError(res?.error);
      }
      console.error(res);
    }
    setPending(false);
    if (!res?.error) {
      router.push('/dashboard');
      router.refresh();
      pushNotification({
        status: 'success',
        text: 'Succesfully logged in',
        config: {
          theme: theme,
        },
      });
    }
  };

  const isInvalid = useMemo(() => {
    if (!formData.email) return false;

    return validateEmail(formData) ? false : true;
    // eslint-disable-next-line
  }, [formData.email]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-1/4 min-w-[22rem] xl:min-w-[26rem] transition-all">
      {!mounted && <LoadingPlainCard />}

      {mounted && (
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col w-full bg-content1 ${
            theme === 'light' && 'bg-neutral-200'
          } px-4 md:px-8 py-6 rounded-lg transition-all`}
        >
          <h1 className="text-2xl text-center mb-6">Sign In</h1>
          <div className="flex flex-col w-full items-center gap-3">
            <Input
              label="Email"
              isInvalid={isInvalid}
              isRequired={!formData.email}
              size="sm"
              radius="sm"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange(e)}
              errorMessage={isInvalid && 'Please enter a valid email address'}
            />
            <Input
              label="Password"
              isRequired={!formData.password}
              size="sm"
              radius="sm"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleChange(e)}
            />
            {error && (
              <>
                <p className="text-red-600">{error}</p>
              </>
            )}

            <FormButton type="submit" isDisabled={pending} loading={pending}>
              {pending ? '' : 'Login'}
            </FormButton>
          </div>
          <div className="relative h-0.5 mt-8 mb-6 bg-black">
            <span
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-content1 ${
                theme === 'light' && 'bg-neutral-200'
              } px-3`}
            >
              OR
            </span>
          </div>
          <div className="flex flex-col w-full items-center gap-3">
            <h2 className="w-full text-center text-md">Continue with</h2>
            <div className="flex w-full gap-4">
              <FormButton
                onPress={() => signIn('github', { callbackUrl: '/dashboard' })}
                isDisabled={pending}
                loading={pending}
                className="h-20 rounded-md hover:bg-[#6e40c9]"
              >
                <div className="flex flex-col w-full gap-2 items-center">
                  <span>
                    <brandIcons.github className="text-3xl" />
                  </span>
                  <p className="text-base">{pending ? '' : 'GitHub'}</p>
                </div>
              </FormButton>
              <FormButton
                onPress={() => signIn('google', { callbackUrl: '/dashboard' })}
                isDisabled={pending}
                loading={pending}
                className="h-20 rounded-md hover:bg-[#ea4335]"
              >
                <div className="flex flex-col w-full gap-2 items-center">
                  <span>
                    <brandIcons.google className="text-3xl" />
                  </span>
                  <p className="text-base">{pending ? '' : 'Google'}</p>
                </div>
              </FormButton>
            </div>
          </div>
          <p className="text-sm pt-6 pb-2 text-center">
            {`Don't have an account? `}
            <span className="relative text-green-400 after:content-[''] after:absolute after:w-full after:h-px after:bg-transparent after:left-0 after:-bottom-0.5 hover:after:bg-green-400 after:transition-all">
              <Link href="/signup">Create Now</Link>
            </span>
          </p>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
