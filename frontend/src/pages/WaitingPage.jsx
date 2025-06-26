import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Pusher from "pusher-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import multiavatar from "@multiavatar/multiavatar/esm";

const WaitingPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [opponent, setOpponent] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [userAvatar, setUserAvatar] = useState("");
  const [opponentAvatar, setOpponentAvatar] = useState("");

  // Generate SVG avatar locally
  const renderAvatar = (seed) => (
    <span
      className="w-20 h-20 rounded-full bg-white shadow-lg border-4 border-blue-200 flex items-center justify-center"
      dangerouslySetInnerHTML={{ __html: multiavatar(seed || "guest") }}
    />
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    const createQuiz = async () => {
      try {
        const quizResponse = await axios.get(`/api/quiz/create/${user._id}`);
        if (quizResponse.data.status === "ready to start") {
          const opponentId = quizResponse.data.quiz.players.find(
            (player) => player !== user._id
          );
          try {
            const opponentResponse = await axios.get(
              `/api/users/get-user-by-id/${opponentId}`
            );
            const opponent = opponentResponse.data.user;
            setOpponent(opponent);
            setOpponentAvatar(opponentId);
            setCountdown(5);
            const timer = setInterval(() => {
              setCountdown((prev) => {
                if (prev <= 1) {
                  clearInterval(timer);
                  navigate(`/quiz/${quizResponse.data.quiz._id}`);
                }
                return prev - 1;
              });
            }, 1000);
          } catch (err) {
            toast.error("Failed to fetch opponent information.");
          }
        } else {
          toast.info("Waiting for more players to join.");
        }
      } catch (err) {
        toast.error("Failed to create quiz.");
      }
    };
    createQuiz();

    const pusher = new Pusher("cee81b1a4f2e2de34ad5", { cluster: "ap2" });
    const channel = pusher.subscribe("quiz");
    channel.bind("new-quiz", async (data) => {
      if (data.status === "ready") {
        const opponentId = data.quiz.players.find(
          (player) => player !== user._id
        );
        try {
          const opponentResponse = await axios.get(
            `/api/users/get-user-by-id/${opponentId}`
          );
          const opponent = opponentResponse.data.user;
          setOpponent(opponent);
          setOpponentAvatar(opponentId);
          setCountdown(5);
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate(`/quiz/${data.quiz._id}`);
              }
              return prev - 1;
            });
          }, 1000);
        } catch (err) {
          toast.error("Failed to fetch opponent information.");
        }
      } else {
        toast.info(data.status);
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (user) {
      setUserAvatar(user._id);
    }
  }, [user]);

  useEffect(() => {
    const warnUser = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnUser);
    return () => {
      window.removeEventListener("beforeunload", warnUser);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md bg-white/80 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-600 mb-2 tracking-tight text-center">
          {opponent
            ? "Opponent Found!"
            : "Searching for an Opponent..."}
        </h2>
        <div className="flex items-center justify-center gap-8">
          <div className="flex flex-col items-center">
            {renderAvatar(userAvatar)}
            <span className="mt-2 font-semibold text-blue-700">
              {user?.userName || "You"}
            </span>
          </div>
          <span className="text-3xl font-black text-pink-400 animate-bounce">VS</span>
          <div className="flex flex-col items-center">
            {opponent
              ? renderAvatar(opponentAvatar)
              : (
                <span className="w-20 h-20 rounded-full bg-gray-200 animate-pulse flex items-center justify-center text-4xl text-gray-400">?</span>
              )
            }
            <span className="mt-2 font-semibold text-gray-500">
              {opponent ? opponent.userName : "Waiting..."}
            </span>
          </div>
        </div>
        <div className="w-full mt-6">
          {opponent && countdown > 0 ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-lg font-semibold text-gray-700">
                Quiz starts in
              </span>
              <span className="text-5xl font-extrabold text-pink-500 animate-pulse">
                {countdown}
              </span>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-400 to-pink-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(countdown / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-lg text-gray-500">
                Waiting for another player to join...
              </span>
              <div className="w-12 h-12 border-4 border-blue-200 border-dashed rounded-full animate-spin mt-2"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingPage;
