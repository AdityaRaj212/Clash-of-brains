import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrashAlt, faPlus, faImage } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuestionPage = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const { user } = useContext(AuthContext);

  const [questionCreatorId, setQuestionCreatorId] = useState(null);
  const [question, setQuestion] = useState({});
  const [questionText, setQuestionText] = useState('');
  const [questionImage, setQuestionImage] = useState(null);
  const [options, setOptions] = useState([{ text: '', file: null }, { text: '', file: null }]);
  const [difficulty, setDifficulty] = useState('3');
  const [points, setPoints] = useState(1);
  const [topic, setTopic] = useState('');
  const [time, setTime] = useState(30);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`/api/question/get-by-id/${questionId}`);
        setQuestion(response.data.question);
        setQuestionCreatorId(response.data.question.uploadedBy);
        setQuestionText(response.data.question.questionText || '');
        setDifficulty(response.data.question.difficulty || '3');
        setPoints(response.data.question.points || 1);
        setTopic(response.data.question.topic || '');
        setTime(response.data.question.time || 30);
        setSelectedOptionIndex(response.data.question.answer ?? null);
        const mappedOptions = response.data.question.option.map(opt => ({
          text: opt.text || '',
          file: opt.file || null,
        }));
        setOptions(mappedOptions);
      } catch (err) {
        toast.error('Error while fetching question: ' + err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId]);

  const handleAddOption = () => setOptions([...options, { text: '', file: null }]);
  const handleRemoveOption = (index) => setOptions(options.filter((_, i) => i !== index));
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    if (field === 'file') newOptions[index].file = value;
    else newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let option = [];
      options.forEach(opt => {
        let obj = { text: opt.text, image: opt.file };
        option.push(obj);
      });
      const formData = {
        questionText,
        questionImage,
        option,
        answer: selectedOptionIndex,
        points,
        difficulty,
        topic,
        time,
      };
      const response = await axios.put(`/api/question/update/${questionId}`, formData);
      if (response.status === 201) toast.success('Question updated successfully!');
      else toast.error('Failed to update question.');
    } catch (error) {
      toast.error('Error updating question: ' + error.message);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`/api/question/delete/${questionId}`);
      if (response.status === 201) {
        navigate('/admin-panel');
        toast.success('Question deleted');
      } else {
        toast.error('Failed to delete question');
      }
    } catch (err) {
      toast.error('Error deleting this question: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-pink-100 to-yellow-100">
        <span className="text-xl font-bold text-blue-600 animate-pulse">Loading...</span>
      </div>
    );
  }

  // EDIT MODE (creator)
  if (user && user._id === questionCreatorId?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-pink-100 to-yellow-100 px-2 py-8">
        <ToastContainer />
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col gap-8 border border-blue-100"
        >
          <h2 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-400 bg-clip-text text-center tracking-tight mb-2 drop-shadow-lg">
            ✏️ Edit Question
          </h2>
          {/* Question Text & Image */}
          <div>
            <label className="block font-semibold mb-1 text-blue-700">Question</label>
            <textarea
              rows={3}
              className="w-full border-2 border-blue-200 rounded-xl p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/60 font-medium text-lg shadow"
              placeholder="Write question here"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <label className="block font-semibold mt-2 mb-1 text-blue-700">Figure (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border-2 border-blue-200 rounded-xl p-2 bg-blue-50/60"
              onChange={(e) => setQuestionImage(e.target.files[0])}
            />
          </div>
          {/* Options */}
          <div>
            <label className="block font-semibold mb-2 text-pink-700">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 items-center mb-3 bg-gradient-to-r from-pink-50 to-yellow-50 rounded-xl p-3 shadow">
                <input
                  type="radio"
                  name="options"
                  checked={selectedOptionIndex === index}
                  onChange={() => setSelectedOptionIndex(index)}
                  className="accent-blue-500 scale-125"
                />
                <textarea
                  rows={2}
                  className="flex-1 border-2 border-pink-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/60 font-medium"
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                />
                <label className="flex items-center gap-1 cursor-pointer">
                  <FontAwesomeIcon icon={faImage} className="text-yellow-400" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleOptionChange(index, 'file', e.target.files[0])}
                  />
                </label>
                {options.length > 2 && (
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700 p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-pink-400 text-white rounded-xl font-bold shadow hover:scale-105 transition flex items-center gap-2"
              onClick={handleAddOption}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Option
            </button>
          </div>
          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-yellow-700">Difficulty</label>
              <div className="flex items-center gap-2">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="border-2 border-yellow-200 rounded-lg p-2 bg-yellow-50/60 font-semibold"
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-700">Points</label>
              <input
                type="number"
                value={points}
                min={1}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full border-2 border-blue-200 rounded-lg p-2 bg-blue-50/60 font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-pink-700">Topic</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full border-2 border-pink-200 rounded-lg p-2 bg-pink-50/60 font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-700">Time (sec)</label>
              <input
                type="number"
                value={time}
                min={5}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border-2 border-blue-200 rounded-lg p-2 bg-blue-50/60 font-semibold"
              />
            </div>
          </div>
          {/* Buttons */}
          <div className="flex gap-4 justify-center mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-pink-400 text-white rounded-xl font-bold shadow hover:scale-105 transition"
            >
              Update Question
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-yellow-400 text-white rounded-xl font-bold shadow hover:scale-105 transition"
              onClick={handleDelete}
            >
              Delete Question
            </button>
          </div>
        </form>
      </div>
    );
  }

  // VIEW-ONLY MODE (not creator)
  if (user && user._id !== questionCreatorId?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-pink-100 to-yellow-100 px-2 py-8">
        <ToastContainer />
        <form className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col gap-8 border border-blue-100">
          <h2 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-400 bg-clip-text text-center tracking-tight mb-2 drop-shadow-lg">
            👁️ View Question
          </h2>
          {/* Question Text & Image */}
          <div>
            <label className="block font-semibold mb-1 text-blue-700">Question</label>
            <textarea
              rows={3}
              className="w-full border-2 border-blue-200 rounded-xl p-3 mb-2 bg-blue-50/60 font-medium text-lg shadow"
              value={questionText}
              disabled
            />
            <label className="block font-semibold mt-2 mb-1 text-blue-700">Figure (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border-2 border-blue-200 rounded-xl p-2 bg-blue-50/60"
              disabled
            />
          </div>
          {/* Options */}
          <div>
            <label className="block font-semibold mb-2 text-pink-700">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 items-center mb-3 bg-gradient-to-r from-pink-50 to-yellow-50 rounded-xl p-3 shadow">
                <input
                  type="radio"
                  name="options"
                  checked={selectedOptionIndex === index}
                  className="accent-blue-500 scale-125"
                  disabled
                />
                <textarea
                  rows={2}
                  className="flex-1 border-2 border-pink-200 rounded-lg p-2 bg-pink-50/60 font-medium"
                  value={option.text}
                  disabled
                />
                <label className="flex items-center gap-1 cursor-not-allowed">
                  <FontAwesomeIcon icon={faImage} className="text-yellow-400" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled
                  />
                </label>
              </div>
            ))}
          </div>
          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-yellow-700">Difficulty</label>
              <div className="flex items-center gap-2">
                <select
                  value={difficulty}
                  className="border-2 border-yellow-200 rounded-lg p-2 bg-yellow-50/60 font-semibold"
                  disabled
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-700">Points</label>
              <input
                type="number"
                value={points}
                min={1}
                className="w-full border-2 border-blue-200 rounded-lg p-2 bg-blue-50/60 font-semibold"
                disabled
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-pink-700">Topic</label>
              <input
                value={topic}
                className="w-full border-2 border-pink-200 rounded-lg p-2 bg-pink-50/60 font-semibold"
                disabled
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-700">Time (sec)</label>
              <input
                type="number"
                value={time}
                min={5}
                className="w-full border-2 border-blue-200 rounded-lg p-2 bg-blue-50/60 font-semibold"
                disabled
              />
            </div>
          </div>
        </form>
      </div>
    );
  }

  return null;
};

export default QuestionPage;
