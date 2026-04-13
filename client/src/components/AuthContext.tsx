import { createContext, useContext, useState } from "react";
import type { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  isAdmin: boolean;
  isDriver: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAdmin: false,
  isDriver: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAdmin: user?.role === "admin",
      isDriver: user?.role === "driver",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
