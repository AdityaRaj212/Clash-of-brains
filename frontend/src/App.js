import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import AdminPanel from './pages/AdminPanel';
import CreateQuestion from './pages/CreateQuestion';
import QuestionPage from './pages/QuestionPage';
import UserPanel from './pages/UserPanel';
import WaitingPage from './pages/WaitingPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/user-panel" element={<UserPanel/>}/>
          <Route path="/create-question" element={<CreateQuestion/>} />
          <Route path="/question-page/:questionId" element={<QuestionPage/>}/>
          <Route path="/quiz-waiting-lobby" element={<WaitingPage/>}/>
          <Route path="/quiz/:quizId" element={<QuizPage/>}/>
          <Route path="/result/:quizId" element={<ResultPage/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
