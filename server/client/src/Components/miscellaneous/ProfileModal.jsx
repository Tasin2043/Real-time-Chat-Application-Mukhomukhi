import React, { useState } from 'react';
import { ChatState } from "../../Pages/ChatPage"
import { FaStreetView } from "react-icons/fa6";
import { Link } from "react-router-dom";

   
const ProfileModal = () => {
    const { user} = ChatState();
    const [openProfile, setOpenProfile] = useState(false);
  
    const handleOpenProfile = () => {
        setOpenProfile(!openProfile);
    };

    return (
      <div
       
      >
        <Link
          className="profile-modal-icon"
          style={{ display: "flex" }}
          onClick={handleOpenProfile}
        >
          <FaStreetView size={30} />
        </Link>

        {openProfile ? (
          <div
            style={{
              margin: "auto",
              width: "250px",
              position: "fixed",
              right: "0",
              left: "0",
              zIndex: "2",
            }}
            className="profile-modal"
          >
            <h6
              style={{
                fontSize: "2rem",
              }}
              className="profile-modal-name"
            >
              {user.name}
            </h6>
            <img className="profile-modal-pic" src={user.pic} alt="" />
            <p
              style={{
                fontSize: "36%",
              }}
              className="profile-modal-email"
            >
              {user.email}
            </p>
            <button
              style={{
                width: "70%",
                fontSize: 16,
              }}
              className="profile-modal-close"
              onClick={handleOpenProfile}
            >
              Close
            </button>{" "}
          </div>
        ) : (
          ""
        )}
      </div>
    );
}

export default ProfileModal;
