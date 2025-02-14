import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;  // Add logout method
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));  // Simulate a delay
  
    console.log('Attempting login with:', username);
  
    let role = '';
    if (username === 'admin' && password === 'admin123') {
      role = 'super-admin';
    } else if (username === 'finance' && password === 'finance123') {
      role = 'admin-finance';
    } else if (username === 'supplier' && password === 'supplier123') {
      role = 'supplier';
    } else {
      setIsLoading(false);
      return false;
    }
  
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('role', role); // Store role in localStorage
    console.log(`Assigned role: ${role}`);
    
    setIsLoading(false);
    return true;
  };
  

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    // Optionally clear stored tokens (if you're using any)
    localStorage.removeItem('authToken'); // Example if you're using localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
