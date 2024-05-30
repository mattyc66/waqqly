import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import NavLinks from './components/nav-links'
import './App.css';
import Home from './components/pages/homepage';
import Main from './components/pages/main'
import Login from './components/pages/login'
import Sign from './components/pages/sign'
import Profile from './components/pages/profile'

function App() {
  return (
    <Router>
      <NavLinks/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/homepage" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign" element={<Sign />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </Router>
  );
}

export default App;