import { useState, React } from "react";
import { toast, Bounce } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Pages/Home.css";
import { SpinnerCircularFixed } from "spinners-react";


export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  setTimeout(() => {
    setLoading(false)
  },5000)

  const handleShow = () => {
    setShow(!show);
  };

   const submitHandler = async () => {
     setLoading(true);
     if (!email || !password) {
       toast.warning("Please fill all the fields!", {
         position: "top-center",
         autoClose: 2000,
         hideProgressBar: true,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "colored",
         transition: Bounce,
       });
       setLoading(false);
       return;
     }
    //  console.log(email, password);
     try {
       const config = {
         headers: {
           "Content-type": "application/json",
         },
       };

       const { data } = await axios.post(
         "/api/user/login",
         { email, password },
         config
       );
      //  console.log(JSON.stringify(data));
       toast.success("Login Successful!", {
         position: "top-center",
         autoClose: 2000,
         hideProgressBar: true,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "colored",
         transition: Bounce,
       });

       localStorage.setItem("userInfo", JSON.stringify(data));
       setLoading(true);
         navigate("/chats");
      //  setTimeout(() => {
      //  }, 1000)
     } catch (error) {
       toast.error("Error Occured!", {
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
       setLoading(false);
     }
   };

  return (
    <div className="chat-login-body">
      <form action="">
        <div>
          <label htmlFor="email">Email Address</label> <br />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="on"
            autoFocus
            placeholder="enter your email"
            className="chat-login-body-input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />{" "}
        </div>

        <div>
          <label htmlFor="password">Password</label> <br />
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            placeholder="enter your password"
            className="chat-login-body-input"
            onChange={(e) => setPassword(e.target.value)}
          />
          {
            <div className="pass-show-btn-login" onClick={handleShow}>
              {show ? "hide" : "show"}
            </div>
          }
        </div>

        <div>
          <button
            type="submit"
            className="chat-submit-btn"
            onClick={submitHandler}
          >
            Login
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
          </button>
        </div>
      </form>
    </div>
  );
}
