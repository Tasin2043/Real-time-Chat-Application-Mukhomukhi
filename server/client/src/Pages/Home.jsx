import { useState, useEffect, React } from "react";
import "./Home.css";
import Login from "../Components/Authentications/Login";
import SignIn from "../Components/Authentications/SignIn";
import { useNavigate } from "react-router";

const Home = () => {
  
  const [login, setLogin] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);


  const handleLogin = () => {
    setLogin(true);
  };

  const handleSignIn = () => {
    setLogin(false);
  };

  return (
    <div className="home-container">
      <div className="chat-login-title">
        <h1>mukhomukhi</h1>
      </div>
      {login ? (
        <div>
          <p className="register-btn-ques">Create new acoount?</p>
          <div className="arrow-for-connection"></div>
        </div>
      ) : (
        ""
      )}
      <div className="chat-login-Form">
        <div className="chat-login-btn-title d-flex">
          <button onClickCapture={handleLogin} className=" chat-login-btn">
            Login
          </button>

          <button className="chat-login-btn" onClick={handleSignIn}>
            Register
          </button>
        </div>

        {login ? <Login /> : <SignIn />}
      </div>
    </div>
  );
}

export default Home;
