import React from 'react';
import { IoClose } from "react-icons/io5";

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <div
          style={{
        padding: "3px",
        borderRadius: "10px",
        margin: "1px",
              fontSize: "12px",
        backgroundColor:"red",
        color: "Black",
        cursor: "pointer",
      }}
      onClick={handleFunction}
    >
      {user.name}
      <IoClose style={{paddingLeft:"2px"}} />
    </div>
  );
}

export default UserBadgeItem;
