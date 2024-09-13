import React, { useState } from "react";
import { toast, Bounce, Zoom } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Pages/Home.css";
import { SpinnerCircularFixed } from "spinners-react";


export default function SignIn() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleShow = () => {
    setShow(!show);
  };

 
  // const handleValidation = (e) => {
  //   const regExp = /^(?=.*\d) (?=.*[a-z]) (?=.*[A-Z])[a-zA-Z0-9]{5,}$/;
  //   if (password === "") {
  //     toast.warning("Please enter your password!", {
  //       position: "top-center",
  //       autoClose: 5000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: 0,
  //       theme: "colored",
  //       transition: Zoom,
  //     });
  //   } else if (regExp.test(password)) {
  //     toast.success("The Password is Valid!", {
  //       position: "top-center",
  //       autoClose: 5000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: 0,
  //       theme: "colored",
  //       transition: Zoom,
  //     });
  //   } else if (!regExp.test(password)) {
  //     toast.error("The Password is Invalid, Allowed character(s) is(are): @#*!$&% (A-Z) (a-z) (0-9)]. Password minimum length is 5 characters", {
  //       position: "bottom-left",
  //       autoClose: 10000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: 0,
  //       theme: "colored",
  //       transition: Zoom,
  //     });
  //   } else {
  //     toast("");
  //   }
  // };



  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast.warning("Please Select an Image!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Zoom,
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "mukhomukhi");
      data.append("cloud_name", "tasin2043");
      fetch("https://api.cloudinary.com/v1_1/tasin2043/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast.warning("Please Select an Image!", {
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
      return;
    }
  };


  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
        toast.warning("Please fill all the fields!", {
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
      setLoading(false)
      return;
    }
    
     if (password !== confirmPassword) {
       toast.warning("Passwords do not Match!", {
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
       const config = {
         headers: {
           "Content-type": "application/json",
         },
       };

       const { data } = await axios.post(
         "/api/user",
         { name, email, password, pic },
         config
       );
       toast.success("Registration Successful!", {
         position: "top-center",
         autoClose: 2000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "colored",
         transition: Bounce,
       });
       
       localStorage.setItem("userInfo", JSON.stringify(data));
       setLoading(false);
      //  setTimeout(() => {
       //  }, 1000)
       
       navigate("/login");

       
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
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="given-name"
            autoFocus
            placeholder="enter your name"
            className="chat-login-body-input"
            onChange={(e) => setName(e.target.value)}
            required
          />{" "}
        </div>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="on"
            autoFocus
            placeholder="enter your valid email"
            className="chat-login-body-input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />{" "}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            placeholder="minimum 5 char. password"
            className="chat-login-body-input"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="pass-show-btn-signin" onClick={handleShow}>
            {show ? "hide" : "show"}
          </div>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={show ? "text" : "password"}
            placeholder="retype the password"
            className="chat-login-body-input"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="pass-show-btn-signin" onClick={handleShow}>
            {show ? "hide" : "show"}
          </div>
        </div>

        <div>
          <label htmlFor="file" id="pic">
            Upload your Picture
          </label>{" "}
          <br />
          <input
            type="file"
            name="file"
            id="file"
            className="chat-login-body-input p-2 pb-0 border-0"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="chat-submit-btn"
            onClick={submitHandler}
            isLoading={loading}
          >
            {" "}
            Signup{" "}
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
