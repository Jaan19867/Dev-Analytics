import { type ReactNode } from 'react';

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  return <div className="grid min-h-screen place-items-center p-4 bg-black">{children}</div>;
};

export default AuthLayout;
