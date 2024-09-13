import React, {useEffect, useState} from 'react';
import { ChatState } from '../../Pages/ChatPage';
import { toast, Bounce } from "react-toastify";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import "./MyChats.css";
import ChatLoading from '../ChatLoading';
import {getSender} from "../../Config/ChatLogics";
import { Stack, useDisclosure } from "@chakra-ui/react";
import "./GroupChatModal.css";
import UserListItem from '../UserAvatar/UserListItem';
import { SpinnerCircularFixed } from "spinners-react";
import UserBadgeItem from "../UserAvatar/UserBadgeItem"


const MyChats = ({ fetchAgain }) => {
  const { onClose } = useDisclosure();
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [openGroup, setOpenGroup] = useState(false);
  const [loading, setLoading] = useState();
  // const [createChat, setCreateChat] = useState();

  const handleCreateChat = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.warning("Please fill all the fields!", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast.success("New Group Chat Created", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      toast.warning("Failed to create the chat!", {
        position: "top-left",
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

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error("User already added", {
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
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log();
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load the Search Results", {
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

  const handleOpenGroup = () => {
    setOpenGroup(!openGroup);
  };
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      // console.log(data)
      setChats(data);
    } catch (error) {
      toast.error("Error Occured", {
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

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <>
      <div className="mychats-container d-flex">
        <div className="mychats-header d-flex ">
          <button className="groupchat-btn" onClick={handleOpenGroup}>
            New Group Chat
            <IoMdAdd size={14} style={{ marginBottom: "3px" }} />
          </button>
          <h4>My Chats</h4>
        </div>

        <div
          className="mychats-body d-flex"
          style={{
            margin: "10px 5px",
            padding: "10px 3px",
            fontSize: "10px",
          }}
        >
          {chats ? (
            <Stack>
              {chats.map((chat) => (
                <div
                  className="mychats-body-chat-layer"
                  onClick={() => setSelectedChat(chat)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: `${
                      selectedChat === chat ? "#38B2AC" : "#E8E8E8"
                    }`,
                    color: `${selectedChat === chat ? "white" : "black"}`,
                    borderRadius: "5px",
                    boxShadow: "0px 5px 20px 0px silver",
                    paddingLeft: "10px",
                  }}
                  key={chat._id}
                >
                  <h6
                    style={{
                      fontSize: "18x",
                      margin: "3px",
                      padding: "0px",
                    }}
                  >
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </h6>
                </div>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </div>
      </div>

      {/* Modal for create group */}

      {openGroup ? (
        <div className="open-group-modal">
          <h1 className="open-group-modal-title">Create Group Chat</h1>

          <div className="open-group-modal-form ">
            <form action="">
              <input
                type="text"
                placeholder="Chat Name"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </form>

            <form action="">
              <input
                type="text"
                placeholder="Add Users eg: Tasin, Fahim, Tulon"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </form>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                marginLeft: "5px",
                textAlign: "center",
              }}
            >
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </div>

            {loading ? (
              <div>
                <SpinnerCircularFixed
                  style={{
                    position: "absolute",
                    marginTop: "20px",
                    marginLeft: "-28px",
                  }}
                  size={25}
                  thickness={200}
                  enabled={loading}
                  color="black"
                />
              </div>
            ) : (
              <div className="groupchat-modal-search-result">
                {searchResult?.slice(0, 4).map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="open-group-modal-footer">
            <button
              className="open-group-modal-footer-btn"
              onClick={handleCreateChat}
            >
              Create Chat
            </button>

            <button
              className="open-group-modal-footer-btn"
              onClick={handleOpenGroup}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default MyChats;
