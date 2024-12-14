import { createContext, useContext, useState, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext(null);

// Provide authentication context to the application
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from the backend
    fetch('http://localhost:5000/api/user', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        console.log('data' , data);
        if (data && !data.error) {
          setUser(data);
        } else if(!data.error) {
          setUser(null);
        } else {
          setUser({});
        }
      })
      .catch(error => console.error('Error fetching user:', error));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
