import React,{ useState } from "react";
import "./SideDrawer.css";
import { Link, useNavigate } from "react-router-dom";
import { MdNotificationsActive } from "react-icons/md";
import Avatar from "react-avatar";
import { ChatState } from "../../Pages/ChatPage";
import "./ProfileModal.css";
import { toast, Bounce } from "react-toastify";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { SpinnerCircularFixed } from "spinners-react";
import { FaSearch } from "react-icons/fa";
import { getSender } from "../../Config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { useDisclosure } from "@chakra-ui/hooks";


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState("");
  const [loadingChat, setLoadingChat] = useState("");
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const [openMyProfile, setOpenMyProfile] = useState(false);
  const { onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };
  
   setTimeout(() => {
     setLoading(false);
   }, 5000);

  const handleOpen = () => {
    setOpenMyProfile(!openMyProfile);
  };


  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please enter name or email in search", {
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

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
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
  
  const accessChat = async (userId) => {
    console.log(userId);
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast.error("Error fetching the chat", {
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


  return (
    <div className="sidedrawer-navbar d-flex">
      <div className="sidedrawer-notification d-flex">
        <div className="dropdown">
          <Link
            className="btn dropdown-toggle sidedrawer-notification-link"
            to="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              color: "silver",
            }}
          >
            <Avatar
              className="sidedrawer-avatar"
              size={35}
              cursor="pointer"
              name={user.name}
              src={user.pic}
              style={{}}
            />
          </Link>

          <ul className="dropdown-menu sidedrawer-menu">
            <li>
              <Link className="dropdown-item" onClick={handleOpen}>
                My Profile
              </Link>
            </li>

            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>

        <div className="dropdown">
          <Link
            className="btn sidedrawer-notification-link"
            to="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              marginLeft: "2px",
              color: "silver",
            }}
          >
            <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            />
            <MdNotificationsActive size={25} />
          </Link>

          <ul
            className="dropdown-menu"
            style={{
              paddingLeft: "2px",
              backgroundColor: "#7CE917",
              textAlign: "center",
            }}
          >
            {!notification.length && "No New Messages"}
            {notification.map((notif) => (
              <li
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </li>
            ))}
          </ul>
        </div>
        <div>
          {openMyProfile ? (
            <div className="profile-modal">
              <h1 className="profile-modal-name">{user.name}</h1>
              <img className="profile-modal-pic" src={user.pic} alt="" />
              <h5 className="profile-modal-email">{user.email}</h5>

              <button className="profile-modal-close" onClick={handleOpen}>
                Close
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* Header title start*/}

      <div className="sidedrawer-navbar-title">
        <nav className="navbar">
          <div className="container-fluid">
            <Link
              className="navbar-brand"
              to="/"
              style={{
                color: "black",
              }}
            >
              mukhomukhi
            </Link>
          </div>
        </nav>
      </div>

      {/* Header title end*/}

      {/* Sidecanvas details */}

      <div className="sidedrawer">
        {/* Sidecanvas button start */}

        <button
          className="btn sidedrawer-btn"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"
          style={{
            color: "silver",
            fontWeight: "bolder",
          }}
        >
          <FaSearch size={20} />
          User
        </button>

        {/* Sidecanvas button end*/}

        {/* Side canvas start */}
        <div
          className="offcanvas offcanvas-end"
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
          style={{
            backgroundColor: "#7CE917",
            width: "300px",
            borderTopLeftRadius: "35px",
            borderBottomLeftRadius: "35px",
          }}
        >
          <div className="offcanvas-header">
            <h5 id="offcanvasRightLabel">Search User</h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="sidedrawer-search">
              <form className="d-flex">
                <input
                  className="form-control me-2"
                  style={{
                    boxShadow: "0px 0px 10px 1px white",
                  }}
                  id="sidedrawer-search"
                  name="sidedrawer-search"
                  type="search"
                  placeholder="Search by name or email"
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                ></input>

                <button
                  className="btn offcanvas-search-btn"
                  type="button"
                  style={{
                    fontWeight: "bolder",
                  }}
                  onClick={handleSearch}
                >
                  Go
                  <SpinnerCircularFixed
                    style={{
                      position: "absolute",
                      marginTop: "0px",
                      marginLeft: "-23px",
                    }}
                    size={25}
                    thickness={200}
                    enabled={loading}
                    color="black"
                  />
                </button>
              </form>

              <div>
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                )}
                {loadingChat && (
                  <SpinnerCircularFixed
                    style={{
                      position: "absolute",
                      marginTop: "0px",
                      marginLeft: "-28px",
                    }}
                    size={125}
                    thickness={200}
                    enabled={loading}
                    color="black"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side canvas end */}
    </div>
  );
}

export default SideDrawer;
