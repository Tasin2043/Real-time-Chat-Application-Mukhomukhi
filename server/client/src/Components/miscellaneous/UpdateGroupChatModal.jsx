import React from 'react';
// import {useDisclosure} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Pages/ChatPage";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import { HiMiniUserGroup } from "react-icons/hi2";
import { toast, Bounce } from "react-toastify";
import { Link } from "react-router-dom";
import { SpinnerCircularFixed } from "spinners-react";
import "./UpdateGroupChatModal.css"



const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [openGroupChat, setOpenGroupChat] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleOpenGroupChat = () => {
    setOpenGroupChat(!openGroupChat);
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
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Error Occured!", {
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
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
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
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User already in Group!", {
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

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone!", {
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

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error("Error Occured!", {
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
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only Admins can remove someone!", {
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

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast.error("Error Occured!", {
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
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <div>
      <Link
        className="group-chat-icon"
        style={{ display: "flex" }}
        onClick={handleOpenGroupChat}
      >
        <HiMiniUserGroup size={30} />
      </Link>

      {openGroupChat ? (
        <div className="group-chat-modal">
          <h1 className="group-chat-modal-title"> {selectedChat.chatName} </h1>

          <div className="group-chat-modal-body d-flex">
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </div>

          <div className="group-chat-modal-form ">
            <form action="">
              <input
                type="text"
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />

              <button
                className="group-chat-modal-btn"
                onClick={handleRename}
                isLoading={renameloading}
              >
                Update
              </button>
            </form>

            <form action="">
              <input
                type="text"
                placeholder="Add User to group"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </form>

            {loading ? (
              <SpinnerCircularFixed
                style={{
                  position: "absolute",
                  marginTop: "0px",
                  marginLeft: "-28px",
                }}
                size={25}
                thickness={200}
                enabled={loading}
                color="black"
              />
            ) : (
                <div style={{
                  overflowY: "scroll",
                  height: "13vh",
                  width: "100%",
                  marginBottom:"5px"
               }}>
                {searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))}
              </div>
            )}

            <div className="group-chat-modal-footer d-flex">
              <button
                className="group-chat-modal-btn"
                onClick={() => handleRemove(user)}
              >
                Leave Group
              </button>

              <button
                className="group-chat-modal-btn"
                onClick={handleOpenGroupChat}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
  export default UpdateGroupChatModal;