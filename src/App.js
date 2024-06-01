import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import NavLinks from './components/nav-links'
import './App.css';
import Home from './components/pages/homepage';
import Main from './components/pages/main'
import Login from './components/pages/login'
import Sign from './components/pages/sign'
import Profile from './components/pages/profile'


const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('userUID');
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <NavLinks />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homepage" element={<Home />} />
        <Route path="/main" element={<PrivateRoute element={<Main />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;