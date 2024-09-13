import "./App.css";
import Home from "./Pages/Home.jsx";
import ChatPage from "./Pages/ChatPage.jsx"
import { Route, Routes } from "react-router-dom";
import React,{useEffect, useState} from 'react'
import {ChatContext} from './Context/ChatProvider.jsx';
import { useNavigate } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js"


function App() {

  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);
      if (!userInfo) {
        navigate("/");
      }
    };
    fetchUserData();
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/login" element={<Home />} />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      </div>
    </ChatContext.Provider>
  );
}

export default App;
