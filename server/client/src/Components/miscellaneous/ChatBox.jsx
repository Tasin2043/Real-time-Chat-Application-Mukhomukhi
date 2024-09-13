import React from 'react';
import "./ChatBox.css";
import { ChatState } from "../../Pages/ChatPage";
import SingleChat from "../../Components/SingleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div className="chatbox-container"
      style={{
      display: `${{ 1000 : selectedChat? "block" : "block" }}`
    }}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
}; 

export default Chatbox;
