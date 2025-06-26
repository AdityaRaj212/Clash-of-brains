import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import QuestionShowcase from '../components/QuestionShowcase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [option, setOption] = useState(0);

  const handleAddQuestion = () => {
    navigate('/create-question');
  };

  const handleSwitchToUser = () => {
    navigate('/user-panel');
  };

  useEffect(() => {
    const pusher = new Pusher("cee81b1a4f2e2de34ad5", {
      cluster: "ap2"
    });

    const channel = pusher.subscribe('questions');
    channel.bind('new-question', () => {
      toast.success('A new question has been added');
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 flex flex-col">
      <ToastContainer />
      {/* Header */}
      <header className="w-full py-6 px-4 md:px-12 flex items-center justify-between bg-white/80 backdrop-blur-md shadow-lg rounded-b-3xl">
        <div className="flex items-center gap-3">
          <h1 className="font-extrabold text-3xl bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 bg-clip-text text-transparent tracking-tight">
            Admin Panel
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAddQuestion}
            className={`px-5 py-2 rounded-full text-white font-semibold shadow 
              ${option === 0
                ? 'bg-gradient-to-r from-blue-500 to-pink-400'
                : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700'
              } hover:scale-105 transition-transform`}
          >
            Add Question
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
        {/* Switch to user panel */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSwitchToUser}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full font-semibold shadow transition"
          >
            Switch to User
          </button>
        </div>
        {/* Question Showcase */}
        <div className="bg-white/80 rounded-2xl shadow-xl p-6">
          <QuestionShowcase />
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
