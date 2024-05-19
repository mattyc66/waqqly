import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import NavLinks from './components/nav-links'
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
          <Route path="/homepage" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign" element={<Sign />} />
          <Route path="/profile" element={<Profile />}/>
        </Routes>
    </Router>
  );
}

export default App;