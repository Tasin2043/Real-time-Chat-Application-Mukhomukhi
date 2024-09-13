import React from 'react';
import Avatar from "react-avatar";
import "./UserListItem.css"
  
  
const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="sidedrawer-search-user d-flex"
      style={{
        width: "100%",
        height: "50%",
        cursor: "pointer",
        backgroundColor: "#005D6F",
        marginTop: "13px",
        marginBottom: "-7px",
        padding: "0px 10px",
        paddingTop: "15px",
        border: "1px solid black",
        borderTopLeftRadius: "50px",
        borderBottomLeftRadius: "30px",
        boxShadow: "0px 5px 10px 1px black",
        alignItems: "center",
        textAlign:"left"
      }}
    >
      <Avatar
        className="sidedrawer-avatar"
        size={35}
        style={{
          marginRight: "15px",
          marginLeft: "10px",
          marginBottom: "25px",
          paddingBottom: "20px",
        }}
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <div style={{ padding: "0px" }}>
        <h5 style={{ fontSize: "1rem", color: "White", margin:"0px" }}>{user.name}</h5>
        <p style={{ fontSize: "0.8rem", color: "black" }}> {user.email} </p>
      </div>
    </div>
  );
}

export default UserListItem;
