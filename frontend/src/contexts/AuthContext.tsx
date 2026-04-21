import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "@/lib/api";

type Role = "admin" | "resident" | "security";

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  token: string;
}

interface AuthContextType {
  user: User | null;
  role: Role | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  resident_type: "Owner" | "Tenant" | "Admin" | "Security";
  flat_id?: string | number;
  extra_details?: Record<string, string>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("userInfo");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      let role: Role = "resident";
      if (data.resident_type === "Admin") role = "admin";
      if (data.resident_type === "Security") role = "security";
      const userObj: User = {
        id: String(data.resident_id),
        email: data.email,
        name: data.first_name + " " + data.last_name,
        role,
        token: data.token,
      };
      setUser(userObj);
      localStorage.setItem("userInfo", JSON.stringify(userObj));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data } = await api.post("/auth/register", userData);
      let role: Role = "resident";
      if (data.resident_type === "Admin") role = "admin";
      if (data.resident_type === "Security") role = "security";
      const userObj: User = {
        id: String(data.resident_id),
        email: data.email,
        name: data.first_name + " " + data.last_name,
        role,
        token: data.token,
      };
      setUser(userObj);
      localStorage.setItem("userInfo", JSON.stringify(userObj));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Registration failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role ?? null,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
