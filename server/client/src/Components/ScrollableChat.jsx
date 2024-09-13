import React from "react";
import Avatar from "react-avatar";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../Config/ChatLogics";
import { ChatState } from "../Pages/ChatPage";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{
            display: "flex",
            padding:"2px"
          }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Avatar
                style={{
                  cursor: "pointer",
                  marginTop: "12px",
                  marginRight: "3px",
                }}
                size={30}
                name={m.sender.name}
                src={m.sender.pic}
              />
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE555" : "silver"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 6 : 10,
                borderRadius: "20px",
                padding: "5px 20px",
                maxWidth: "50%",
                overflowWrap: "break-word",
                fontWeight: "bolder",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
