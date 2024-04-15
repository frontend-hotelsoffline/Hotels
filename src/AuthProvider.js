import { createContext, useState, useEffect } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to manage the authentication state
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "success"
  );

  // Effect to listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "success");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
