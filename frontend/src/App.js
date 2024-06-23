import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import AdminPanel from './pages/AdminPanel';
import CreateQuestion from './pages/CreateQuestion';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/create-question" element={<CreateQuestion/>} />
      </Routes>
    </Router>
  );
}

export default App;
