import React, { ReactNode, createContext, useContext, useState } from 'react';

export interface User {
  userId: string;
  avatar: string;
  isPremium: boolean;
  isFreeTrial: boolean;
  premiumDate: Date | null;
  freeTrialDate: Date | null;
  premiumType: string | null;
}

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    userId: '',
    avatar: '',
    isPremium: false,
    isFreeTrial: false,
    premiumDate: null,
    freeTrialDate: null,
    premiumType: null,
  });
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserIdProvider');
  }
  return context;
};
