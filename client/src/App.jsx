import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import { useAuth } from './auth';

const App = () => {
  const { user } = useAuth();
  console.log('user', user);
  if(user === null) { 
    return <div>Loading...</div>
  } 

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={user?.id ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={user?.id ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/products" element={user?.isAdmin ? <Products /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
