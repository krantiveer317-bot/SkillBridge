'use client';

import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '@/types';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillbridge_role') as UserRole | null;
      if (saved) return saved;
    }
    return 'student';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillbridge_role', newRole);
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isLoggedIn, setIsLoggedIn }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
