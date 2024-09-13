import { getSender, getSenderFull } from "../Config/ChatLogics";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { TiArrowBackOutline } from "react-icons/ti";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import "./SingleChat.css"
import { Text } from "@chakra-ui/layout";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Pages/ChatPage";
import { toast, Bounce } from "react-toastify";
import { SpinnerCircularFixed } from "spinners-react";





const ENDPOINT = "http://localhost:2043"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Failed to load the Message", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.error("Failed to send the Message", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            style={{
              fontSize: "28px",
              padding: "2px 3px",
              width: "100%",
              fontFamily: "Work sans",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TiArrowBackOutline
              style={{ display: "flex" }}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>

          <div className="chat-inside-box">
            {loading ? (
              <SpinnerCircularFixed
                size={50}
                thickness={200}
                enabled={loading}
                color="black"
              />
            ) : (
              <div className="chat-inside-messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <form
              className="chat-inside-form"
              onKeyDown={sendMessage}
              id="first-name"
              style={{ marginTop: 3 }}
              isRequired
            >
              {istyping ? (
                <div className="lottie-typing-animation">
                  <Lottie
                    options={defaultOptions}
                    // height={25}
                    width={95}
                    style={{
                      marginBottom: "-50px",
                      marginRight: "2%",
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
              <input
                className="chat-inside-input"
                id="chat-input"
                name="chat-input"
                data-tooltip-variant="filled"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </form>
          </div>
        </>
      ) : (
        // to get socket.io on same page
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Text
            style={{
              fontSize: "2rem",
              padding: "10px",
              paddingBottom: "0px",
              fontFamily: "Fascinate Inline",
              textAlign: "center",
            }}
          >
            Welcome to mukhomukhi. Please click on a user to start Chatting
          </Text>
        </div>
      )}
    </>
  );
};

export default SingleChat;
