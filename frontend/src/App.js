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
import ProtectedRoute from './components/ProtectedRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />

          <Route path="/admin-panel" element={
            <ProtectedRoute>
                <AdminPanel />
            </ProtectedRoute>
          } />

          <Route path="/user-panel" element={
            <ProtectedRoute>
              <UserPanel/>
            </ProtectedRoute>}
          />

          <Route path="/create-question" element={
            <ProtectedRoute>
              <CreateQuestion/>
            </ProtectedRoute>  
          } />

          <Route path="/question-page/:questionId" element={
            <ProtectedRoute>
              <QuestionPage/>
            </ProtectedRoute>  
          }/>

          <Route path="/quiz-waiting-lobby" element={<WaitingPage/>}/>

          <Route path="/quiz/:quizId" element={
            <ProtectedRoute>
              <QuizPage/>
            </ProtectedRoute>  
          }/>

          <Route path="/result/:quizId" element={
            <ProtectedRoute>
              <ResultPage/>
            </ProtectedRoute>  
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
