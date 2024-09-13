import {React, useContext} from 'react';
import SideDrawer from '../Components/miscellaneous/SideDrawer'
import MyChats from "../Components/miscellaneous/MyChats"
import ChatBox from '../Components/miscellaneous/ChatBox';
import { ChatContext } from "../Context/ChatProvider";

export const ChatState = () => {
  return useContext(ChatContext);
};
const ChatPage = () => {
  const { user } = ChatState();
  return (
    <div className='w-100'>
      {user && <SideDrawer />}
      <div className="d-flex">
        {user && <ChatBox />}
        {user && <MyChats />}
      </div>
    </div>
  );
}

export default ChatPage;
